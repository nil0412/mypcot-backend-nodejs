const User = require("../src/models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

passport.use(
	new passportLocal(function (email, password, done) {
		User.findOne({ email }, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: "User not found" });
			}
			if (!bcrypt.compareSync(password, user.password)) {
				return done(null, false, { message: "Incorrect password." });
			}
			return done(null, user);
		});
	})
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

// Configure Passport for JWT strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: "your-secret-key", // Replace with a secure secret key
};

passport.use(
	new JwtStrategy(jwtOptions, (payload, done) => {
		User.findById(payload.id, (err, user) => {
			if (err) return done(err, false);
			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	})
);

module.exports = passport;
