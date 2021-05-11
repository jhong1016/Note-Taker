// Require express to interact with the front end
const express = require("express");
// Require path for filename paths
const path = require("path");
// Require fs to read and write to files
const fs = require('fs');

// Creates express server and sets initial port
const app = express();
const PORT = process.env.PORT || 8000;

// Sets express server to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));

//  Initialize addedNote
let addedNote = [];

// API call response for all inputted notes, and send results to the browser as an array of object
app.get("/api/notes", function (req, res) {
	try {
		// reads the notes from the json file
		addedNote = fs.readFileSync("./db/db.json", "utf8");
		console.log("Note saved.");
		// parse the data to get an array of objects
		addedNote = JSON.parse(addedNote);

		// handles errors
		} catch (err) {
			console.log("\n error (in app.get.catch):");
			console.log(err);
		}

		// send objects to the browser
		res.json(addedNote);
});

// API to write all newly inputted notes to the json file
app.post("/api/notes", function (req, res) {
	try {
		// reads the json file
		addedNote = fs.readFileSync("./db/db.json", "utf8");
		console.log(addedNote);
		// parse the data to get an array of objects
		addedNote = JSON.parse(addedNote);
		// set new notes by using id
		req.body.id = addedNote.length;
		// add new notes to the array of objects
		addedNote.push(req.body);
		// make it string(stringify) to write to json file
		addedNote = JSON.stringify(addedNote);
		// writes new notes to jason file
		fs.writeFile("./db/db.json", addedNote, "utf8", function(err) {
		// handles errors
		if (err) throw err;
		});
		// change data back to an array of objects
		res.json(JSON.parse(addedNote));
	
		// handles errors
		} catch (err) {
		throw err;
		console.error(err);
		}
});

// API to delete individual notes from the json file
app.delete('/api/notes/:id', function (req, res) {
	try {
		// reads the json file
		addedNote = fs.readFileSync("./db/db.json", "utf8");
		// parse data to get an array of the objects
		addedNote = JSON.parse(addedNote);
		// delete selected note from the array
		addedNote = addedNote.filter(function(note) {
		return note.id != req.params.id;
		});
		// make it string(stringify) to write to json file
		addedNote = JSON.stringify(addedNote);
		// write new notes to the file
		fs.writeFile("./db/db.json", addedNote, "utf8", function(err) {
		// error handling
		if (err) throw err;
		});
		// change data back to an array of objects
		res.send(JSON.parse(addedNote));
	
		// handles errors
		} catch (err) {
		throw err;
		console.error(err);
		}
});

// Get homepage when the 'GetStarted' button is clicked
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// If no matching route is found default to homepage
app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", function(req, res) {
	return res.sendFile(path.json(__dirname, "./db/db.json"));
});

// Start the server on the port
app.listen(PORT, function() {
    console.log(`Server listening on ${PORT}.`)
});