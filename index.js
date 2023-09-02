const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");

if (process.env.NODE_ENV !== "production") {
	// Load environment variables from .env file in non prod environments
	require("dotenv").config()
  }
require("./utils/connectdb");

require('./strategies/JwtStrategy')
require('./strategies/LocalStrategy')
require('./authenticate')


const apiRoute = require("./src/routes/api");

// const userRouter = require('./src/routes/api/user/userRoutes')

// const passportLocal = require("passport-local").Strategy;
// const bcrypt = require("bcryptjs");
// const flash = require('express-flash'); // Import the express-flash middleware
// const multer = require('multer'); //user for form data
// // Create a storage engine using multer
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const userRoutes = require("./src/routes/api/user/userRoutes");
// const recordRoutes = require("./src/routes/api/records/recordRoutes");
// const User = require("./src/models/User");
// const isAuthenticated = require("./src/middleware/authMiddleware"); // Import the middleware

const app = express();

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


const session = require("express-session");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET))
//Add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },

  credentials: true,
}

app.use(cors(corsOptions))

app.use(passport.initialize())
passport.session()


// app.use(flash());

app.use(
	session({
		secret: "secretcode",
		resave: false,
		saveUninitialized: true,
	})
);

// Middleware for handling session and user authentication
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(express.json());




app.use("/api", apiRoute);
// app.use('/api/user', userRoutes);
// app.use('/api/records', recordRoutes);


//Start the server in port 8080

const server = app.listen(process.env.PORT || 8080, () => {
	const port = server.address().port
	console.log("App started at port:", port)
  })
