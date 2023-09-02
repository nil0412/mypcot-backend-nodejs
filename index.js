const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require('./config/passportConfig');
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require('express-flash'); // Import the express-flash middleware
const multer = require('multer'); //user for form data
// Create a storage engine using multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const apiRoute = require("./src/routes/api");
const userRoutes = require("./src/routes/api/user/userRoutes");
const recordRoutes = require("./src/routes/api/records/recordRoutes");
const User = require("./src/models/User");
const isAuthenticated = require("./src/middleware/authMiddleware"); // Import the middleware

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "http://localhost:3000", //location of react app
		credentials: true,
	})
);

app.use(flash());

app.use(
	session({
		secret: "secretcode",
		resave: true,
		saveUninitialized: true,
	})
);

// Middleware for handling session and user authentication
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

mongoose
	.connect("mongodb://localhost/MYPCOY_DATABASE", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("MongoDB connection error:", error);
	});


app.use("/api", apiRoute);
// app.use('/api/user', userRoutes);
// app.use('/api/records', recordRoutes);

//start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
