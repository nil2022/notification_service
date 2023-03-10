require("./crons/cron")
const dbConfig = require('./configs/db.config')
const mongoose = require('mongoose')
const express = require('express')

const app = express()
app.use(express.json())

mongoose.connect(dbConfig.DB_URL,
    () => { console.log("Connected to Mongo DB") },
    err => { console.log("Error: ", err.message) }
)

require("./routes/ticketNotification.route")(app)

app.get('/', (req, res) => {
    res.status(200).send("<h2>Notification Service Running</h2>");
  });

app.listen(3030, () => {
    console.log("Notification service started on http://localhost:3030")
})