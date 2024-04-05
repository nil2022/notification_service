/* eslint-disable no-console */
// require('dotenv').config();
require("./crons/cron");
const mongoose = require("mongoose");
const express = require("express");
const securedHeaders = require("helmet");
const { limiter } = require("./utils/api-rate-limiter");
const fetchRemoteIP = require("./utils/fetchRemoteIp");
const TicketNotificationRoute = require("./routes/ticketNotification.route");
const app = express();

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(fetchRemoteIP); // Fetch Remote IP middleware
app.use(limiter); // express-rate-limit middleware
app.use(securedHeaders());

const connectDB = async () => {
  try {
    const startTime = Date.now();
    const connect = await mongoose.connect(process.env.DB_URL, {
      // useNewUrlParser: true,  // DEPRECATED
      // useUnifiedTopology: true  // DEPRECATED
    });
    console.log(`Time taken to connect to DB: ${Date.now() - startTime}ms`);
    console.log(`MongoDB Connected to Host: ${connect.connection.host}`);
  } catch (error) {
    console.log("Can't connect to DB:", error.message);
  }
};

TicketNotificationRoute(app);

// FIRST CONNECT TO MONGODB THEN START LISTENING TO REQUESTS
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Service started on PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err)); // IF DB CONNECT FAILED, CATCH ERROR

app.get("/", (req, res) => {
  return res.status(200).send("Notification Service Running 🚀");
});
