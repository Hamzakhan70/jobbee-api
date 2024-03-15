const express = require("express");
const errorMiddleware = require("./middlewares/errors");
const ErrorHandler = require("./utils/errorHandler");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

const connectDatabase = require("./config/database");

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });
// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down due to uncaught exception.");
  process.exit(1);
});

// Connecting to databse
connectDatabase();

// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));

// setting up the bodyparser
app.use(express.json());

// Setup security headers
app.use(helmet()); // help us to make secure website by giving it a header

// set Up cookie parser
app.use(cookieParser());

// Handle file uploads
app.use(fileUpload());

// Sanitize data  //in mongo email field different mongo operator can work to prevent unauthorised acces
app.use(mongoSanitize());

// Prevent XSS attacks //prevent us addding scripts and html tags
app.use(xssClean());

// Prevent Parameter Pollution // help us to prevent parameter pollution if sort=name&&sort=jobType
app.use(
  hpp({
    whitelist: ["positions"],
  })
);

// Setup CORS - Accessible by other domains
app.use(cors());
// Rate Limiting
const limiter = rateLimit({
  //control bundle of request in short time
  windowMs: 10 * 60 * 1000, //10 Mints
  max: 100,
});

// Setup CORS - Accessible by other domains
app.use(limiter);
// Importing all routes
const jobs = require("./routes/jobs");
const auth = require("./routes/auth");
const user = require("./routes/user");

app.use("/api/v1", jobs);
app.use("/api/v1", auth);
app.use("/api/v1", user);

// Handle unhandled routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

// Middleware to handle errors
app.use(errorMiddleware);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
    // "SERVER IS RUNNIG ON THE 3000"
  );
});
// Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled promise rejection.");
  server.close(() => {
    process.exit(1);
  });
});
