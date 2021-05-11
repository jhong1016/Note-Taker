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
const PORT = process.env.PORT || 8000;

// Sets express server to handle data parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './public')));

const id = 0;

// API call response for all inputted notes, and send results to the browser as an array of object
app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

// API to write all newly inputted notes to the json file
app.post("/api/notes", function (req, res) {
    var newNote = JSON.stringify(req.body);

	fs.readFile('./db/db.json', 'utf8', (err, data) => {
		if (err) throw err;

		let dataArray = JSON.parse(data);
		let lastNoteId = dataArray[dataArray.length - 1].id;

		if (lastNoteId === undefined ){
			lastNoteId = 0;
		}
		console.log("last note id", lastNoteId);

		let newId = lastNoteId + 1;
		console.log("new ID", newId);

		newNote = '{' + `"id":${newId},` + newNote.substr(1);
		let newNoteJSON = JSON.parse(newNote);
		console.log('newNoteJSON', newNoteJSON);
		
		console.log('dataArray', dataArray);
		dataArray.push(newNoteJSON);
		console.log('updated dataArray', dataArray);

		let newDataString = JSON.stringify(dataArray);
		console.log(newDataString);

		fs.writeFile('./db/db.json', newDataString, function (err) {
			if (err) throw err;
			console.log('Note saved.');
		});
	});

	res.sendFile(path.join(__dirname, './db/db.json'));
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
			console.log('Note deleted.');
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