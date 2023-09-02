const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

//Called during login/sign up.
// passport.use(new LocalStrategy(User.authenticate()))

//called while after logging in / signing up to set user details in req.user
// passport.serializeUser(User.serializeUser())

passport.use(
	new LocalStrategy(
		{
			usernameField: "email", // Change this to match your field name for email
			passwordField: "password", // Change this to match your field name for password
		},
		async (email, password, done) => {
			try {
				const user = await User.findOne({ username: email });

				if (!user) {
					return done(null, false, { message: "User not found" });
				}
				if (!bcrypt.compareSync(password, user.password)) {
					return done(null, false, { message: "Incorrect password." });
				}
				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}
	)
);

// Serialize user to store in the session
passport.serializeUser((user, done) => {
	done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});
