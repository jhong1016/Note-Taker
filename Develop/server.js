// Require express to interact with the front end
const express = require("express");
// Require path for filename paths
const path = require("path");
// Require fs and util to read and write to files
const fs = require('fs');
const util = require('util');
// Location to store inputte dnotes
const db = require("./db/db.json");

// Creates express server and set initial port
const app = express();
const PORT = process.env.PORT || 3000;

// Sets express server to handle data parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Serve static files 
app.use(express.static(path.join(__dirname, './public')));

// Variables to read and write files
const writefileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
var allNotes;

const id = 0;

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
                allNotes.push(newNotes);
            }
            writefileAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
                .then(function () {
                    console.log("Note saved.");
                })
        });
    res.json(newNotes);
});

// Delete function
app.delete('/api/notes/:id', function (req, res) {
	var deleteId = req.params.id;
	console.log(req.params.id);
	
	fs.readFile('./db/db.json', 'utf8', (err, data) => {
		let dataArray = JSON.parse(data);

		dataArray = dataArray.filter(function (note) {
			return note.id != deleteId;
		});

		let newDataString = JSON.stringify(dataArray);

		fs.writeFile('./db/db.json', newDataString, function (err) {
			if (err) throw err;
			console.log('Saved');
		});
	});

	res.sendFile(path.join(__dirname, './db/db.json'))
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