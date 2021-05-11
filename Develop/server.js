// Require express to interact with the front end
var express = require("express");
// Require path for filename paths
var path = require("path");
// Require fs and util to read and write to files
var fs = require('fs');
var util = require('util');

// Creates express server and set initial port
var app = express();
var PORT = process.env.PORT || 3000;

// Sets express server to handle data parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files 
app.use(express.static(path.join(__dirname, './public')));


// ========== HTML ROUTES ==========

// The below points our server to set up routes
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


// ========== VARIABLES TO READ AND WRITE FILES ==========

const writefileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
let allNotes;


// ========== LISTEN ========== 

// Start the server on the port
app.listen(PORT, function() {
    console.log(`Server listening on ${PORT}`);
});