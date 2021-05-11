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


// ========== HTML ROUTES ==========

// The below points our server to set up routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// (catch all other urls) get home page
app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});


// ========== LISTEN ========== 

app.listen(PORT, function() {
    console.log(`Server listening on ${PORT}`);
});