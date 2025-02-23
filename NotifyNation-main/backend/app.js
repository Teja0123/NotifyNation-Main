var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const FirstRoutes = require("./Routes/FirstRoutes");
var dotenv = require("dotenv");
const { error } = require('console');

var app = express();


// Middleware setup
app.use(cors());
app.use(bodyparser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.SMTP_link)
.then((res) => {
    console.log('DB connected successfully...');
})
.catch(err => {
    console.error('MongoDB connection error:');
})
// Routes setup
app.use("/api", FirstRoutes );
app.get('/', (req, res) => {
 res.send({
    activestatus: true,
    error: false,
    message: "Server is running"
 })
}),
// Fallback route for 404
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler for APIs
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

app.listen(5000, function() {
    console.log("Server started on port 5000");
});

module.exports = app;
