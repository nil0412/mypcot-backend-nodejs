// src/controllers/userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("../../config/passportConfig");
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
						console.log("User: ", user);
						user.name = name;
						user.username = email;
						user.password = hashedPassword;
						user.gender = gender;
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

	const token = getToken({ _id: req.user._id })
  const refreshToken = getRefreshToken({ _id: req.user._id })
  User.findById(req.user._id).then(
    user => {
      user.refreshToken.push({ refreshToken })
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500
          res.send(err)
        } else {
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
          res.send({ success: true, token })
        }
      })
    },
    err => next(err)
  )

	// try {
	// 	const { email, password } = req.body;
	// 	// Find the user by email
	// 	const user = await User.findOne({ email });
	// 	console.log("User: ", user);
	// 	if (!user) {
	// 		return res.status(401).json({ error: "Invalid credentials" });
	// 	}

	// 	// Compare the provided password with the hashed password in the database
	// 	const passwordMatch = bcrypt.compareSync(password, user.password);
	// 	if (!passwordMatch) {
	// 		console.log("Invalid creds need to bcrypt");
	// 		return res.status(401).json({ error: "Invalid credentials" });
	// 	}

	// 	// Generate and send a JWT token
	// 	const token = jwt.sign({ userId: user._id }, "your-secret-key", {
	// 		expiresIn: "1h", // Adjust the token expiration time as needed
	// 	});
	// 	res.status(200).json({ token });
	// } catch (error) {
	// 	console.error(error);
	// 	res.status(500).json({ error: "Server error" });
	// }
};

// exports.register = async (req, res) => {
// 	try {
// 		const { name, email, password, gender } = req.body;

// 		console.log(req.body);
// 		// Check if the email is already registered
// 		const existingUser = await User.findOne({ email });

// 		if (existingUser) {
// 			return res.status(400).json({ error: "Email already in use" });
// 		} else {
// 			// Hash the password
// 			const hashedPassword = await bcrypt.hashSync(password, 10);

// 			// Create a new user
// 			const user = new User({ name, email, password: hashedPassword, gender });
// 			await user.save();
// 			res.json({ message: "User Created Successfully!" });

// 			// Generate and send a JWT token
// 			// const token = jwt.sign({ userId: user._id }, 'your-secret-key');
// 			// res.json({ token });
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ error: "Server error" });
// 	}
// };

// exports.login = async (req, res) => {
// 	return res.status(200);
// 	try {
// 		const { email, password } = req.body;
// 		// Find the user by email
// 		const user = await User.findOne({ email });
// 		console.log("User: ", user);
// 		if (!user) {
// 			return res.status(401).json({ error: "Invalid credentials" });
// 		}

// 		// Compare the provided password with the hashed password in the database
// 		const passwordMatch = bcrypt.compareSync(password, user.password);
// 		if (!passwordMatch) {
// 			console.log("Invalid creds need to bcrypt");
// 			return res.status(401).json({ error: "Invalid credentials" });
// 		}

// 		// Generate and send a JWT token
// 		const token = jwt.sign({ userId: user._id }, "your-secret-key", {
// 			expiresIn: "1h", // Adjust the token expiration time as needed
// 		});
// 		res.status(200).json({ token });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ error: "Server error" });
// 	}
// };
