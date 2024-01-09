/* eslint-disable no-console */
require('dotenv').config();
require('./crons/cron');
const mongoose = require('mongoose');
const express = require('express');
const securedHeaders = require('helmet');
const { limiter } = require('./utils/api-rate-limiter');

const app = express();
const db_url = process.env.DB_URL;
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(limiter); // express-rate-limit middleware
app.use(securedHeaders());

const connectDB = async () => {
	try {
		console.time('Mongodb connection time:');
		const connect = await mongoose.connect(db_url, {
			// useNewUrlParser: true,  // DEPRECATED
			// useUnifiedTopology: true  // DEPRECATED
		});
		console.timeEnd('Mongodb connection time:');
		console.log(`MongoDB Connected to Host: ${connect.connection.host}`);
	} catch (error) {
		console.log('Can\'t connect to DB:', error.message);
	}
};

// FIRST CONNECT TO MONGODB THEN START LISTENING TO REQUESTS
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Service started on PORT ${PORT}`);
	});
}).catch((e) => console.log(e)); // IF DB CONNECT FAILED, CATCH ERROR

require('./routes/ticketNotification.route')(app);

app.get('/', (req, res) => {
	// const ip = userIP(req);
	// console.log("Client Request IP:",ip);
	res.status(200).send('<h2>Notification Service Running 🚀</h2>');
});
