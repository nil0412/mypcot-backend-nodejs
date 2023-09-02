const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
	getToken,
	COOKIE_OPTIONS,
	getRefreshToken,
} = require("../../authenticate");

exports.register = async (req, res, next) => {
	try {
		const { name, email, password, gender } = req.body;

		// Check if the email is already registered
		const existingUser = await User.findOne({ username: email });

		if (existingUser) {
			res.statusCode = 400;
			res.send({
				name: "DuplicateEmailError",
				error: "Email already in use",
			});
		} else {
			// Hash the password
			if (!password) {
				res.statusCode = 500;
				res.send({
					name: "PasswordUndefined",
					error: "Password is Undefined",
				});
				return;
			}
			const hashedPassword = bcrypt.hashSync(password, 10);

			User.register(
				new User({ name, username: email, password: hashedPassword, gender }),
				password,
				async (err, user) => {
					if (err) {
						console.log("Error: ", err);
						res.statusCode = 500;
						res.send(err);
					} else {
						const token = getToken({ _id: user._id });
						const refreshToken = getRefreshToken({ _id: user._id });
						user.refreshToken.push({ refreshToken });
						try {
							user.save();

							res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
							res.send({ success: true, token });
						} catch {
							res.statusCode = 500;
							res.send({
								name: "ServerError",
								error: err,
							});
						}
					}
				}
			);
		}
	} catch (error) {
		console.error(error);
		res.statusCode = 500;
		res.send({
			name: "ServerError",
			error: "Server Error",
		});
	}
};

exports.login = async (req, res, next) => {
	const user = await User.findOne({ username: req.body.email });
	if (!user) {
		res.statusCode = 404;
		res.send({ message: "User Not Found" });
		return;
	}
	const token = getToken({ _id: user._id });
	const refreshToken = getRefreshToken({ _id: user._id });
	User.findById(user._id).then((user) => {
		user.refreshToken.push({ refreshToken });
		try {
			user.save();

			res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
			res.send({ success: true, token });
		} catch (err) {
			res.statusCode = 500;
			res.send(err);
		}
	});
};

exports.logout = async (req, res, next) => {
	try {
		const { signedCookies = {} } = req;
		const { refreshToken } = signedCookies;
		User.findById(req.user._id).then(
			(user) => {
				const tokenIndex = user.refreshToken.findIndex(
					(item) => item.refreshToken === refreshToken
				);

				if (tokenIndex !== -1) {
					user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
				}

				try {
					user.save();

					res.clearCookie("refreshToken", COOKIE_OPTIONS);
					res.send({ success: true });
				} catch (err) {
					res.statusCode = 500;
					res.send(err);
				}
			},
			(err) => next(err)
		);
	} catch (err) {
		res.statusCode = 400;
		res.send(err);
	}
};

exports.refreshToken = async (req, res, next) => {
	const { signedCookies = {} } = req;
	const { refreshToken } = signedCookies;

	if (refreshToken) {
		try {
			const payload = jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET
			);
			const userId = payload._id;
			User.findOne({ _id: userId }).then(
				(user) => {
					if (user) {
						// Find the refresh token against the user record in database
						const tokenIndex = user.refreshToken.findIndex(
							(item) => item.refreshToken === refreshToken
						);

						if (tokenIndex === -1) {
							res.statusCode = 401;
							res.send("Unauthorized");
						} else {
							const token = getToken({ _id: userId });
							// If the refresh token exists, then create new one and replace it.
							const newRefreshToken = getRefreshToken({ _id: userId });
							user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
							try {
								user.save();

								res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
								res.send({ success: true, token });
							} catch (err) {
								res.statusCode = 500;
								res.send(err);
							}
						}
					} else {
						res.statusCode = 401;
						res.send("Unauthorized");
					}
				},
				(err) => next(err)
			);
		} catch (err) {
			res.statusCode = 401;
			res.send("Unauthorized");
		}
	} else {
		res.statusCode = 401;
		res.send("Unauthorized");
	}
};
