// Import express
var express = require("express");
var path = require("path");
var fs = require('fs');
var util = require('util');

// Create app
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files 
app.use(express.static(path.join(__dirname, './public')));



// Listen
app.listen(PORT, function() {
    console.log(`Server listening on ${PORT}`);
});