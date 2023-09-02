// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const Session = new Schema({
	refreshToken: {
		type: String,
		default: "",
	},
});

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	gender: String,
	// Add more fields as needed for your user model

	authStrategy: {
		type: String,
		default: "local",
	},
	refreshToken: {
		type: [Session],
	},
});

//Remove refreshToken from the response
userSchema.set("toJSON", {
	transform: function (doc, res, options) {
		delete res.refreshToken;
		return res;
	},
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
