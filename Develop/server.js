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


// ========== API ROUTES ==========

// API call response for all inputted notes, and send results to the browser as an array of object
app.get("/api/notes", function (req, res) {
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
        .then(function (data) {
            return res.json(JSON.parse(data));
        });
});

// API to write all newly inputted notes to the json file
app.post("/api/notes", function (req, res) {
    var newNotes = req.body;
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
        .then(function (data) {
            allNotes = JSON.parse(data);
            if (newNotes.id || newNotes.id === 0) {
                let currNote = allNotes[newNotes.id];
                currNote.title = newNotes.title;
                currNote.text = newNotes.text;
            } else {
                allNotes.push(newNote);
            }
            writefileAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
                .then(function () {
                    console.log("Wrote db.json");
                })
        });
    res.json(newNotes);
});


// ========== LISTEN ========== 

app.listen(PORT, function() {
    console.log(`Server listening on ${PORT}`);
});