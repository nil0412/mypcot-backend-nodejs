const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportLocal = require("passport-local").Strategy;

passport.use(
        new passportLocal(function (email, password, done) {
            User.findOne({ email }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: "Incorrect username or password" });
                }
                bcrypt.compare(password, user.passport, (err, result) => {
                    if (err) {
                        return done(err);
                    }
                    if(result === true){
                        return done(null, user);
                    }else{
                        return done(null, false, { message: "Incorrect username or password" });
                    }
                })
                if (!user.verifyPassword(password)) {
                    return done(null, false, { message: "Incorrect username or password" });
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

module.exports = passport;