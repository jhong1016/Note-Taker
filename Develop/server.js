// Require express to interact with the front end
const express = require("express");
// Require path for filename paths
const path = require("path");
// Require fs to read and write to files
const fs = require('fs');
// Location to store inputte dnotes
const db = require("./db/db.json");

// Creates express server and set initial port
const app = express();
const PORT = process.env.PORT || 3000;

// Sets express server to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files 
app.use(express.static(path.join(__dirname, './public')));

const id = 0;

// API call response for all inputted notes, and send results to the browser as an array of object
app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, './db/db.json'), "utf8")
});

// API to write all newly inputted notes to the json file
app.post("/api/notes", function (req, res) {
    var newNotes = JSON.stringify(req.body);
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
        .then(function (data) {
            allNotes = JSON.parse(data);
            if (newNotes.id || newNotes.id === 0) {
                let currentNote = allNotes[newNotes.id];
                currentNote.title = newNotes.title;
                currentNote.text = newNotes.text;
            } else {
                allNotes.push(newNotes);
            }
            writefileAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
                .then(function () {
                    console.log("Note saved.");
                });
        });
    res.json(newNotes);
});

// API to delete individual notes
app.delete('/api/notes/:id', function (req, res) {
	var deleteId = req.params.id;
	readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
        .then(function (data) {
            allNotes = JSON.parse(data);
            allNotes.splice(deleteId, 1);
            writefileAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
                .then(function () {
                    console.log("Note deleted.");
                });
        });
    res.json(deleteId);
});

// Get homepage when the 'GetStarted' button is clicked
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// If no matching route is found default to homepage
app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Start the server on the port
app.listen(PORT, function() {
    console.log(`Server listening on ${PORT}.`);
});