// Require express to interact with the front end
const express = require("express");
// Require path for filename paths
const path = require("path");
// Require fs to read and write to files
const fs = require('fs');
const notesData = require("./db/db.json");

// Creates express server and sets initial port
const app = express();
const PORT = process.env.PORT || 8000;

// Sets express server to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));

module.exports = function(app) {
	function writeToDB(notes){
        // Converts new JSON Array back to string
        notes = JSON.stringify(notes);
        console.log (notes);
        // Writes String back to db.json
        fs.writeFileSync("./db/db.json", notes, function(err){
            if (err) {
                return console.log(err);
            }
        });
	}
}

// API call response for all inputted notes, and send results to the browser as an array of object
app.get("/api/notes", function (req, res) {
	res.json(notesData);
});

// API to write all newly inputted notes to JSON file
app.post("/api/notes", function (req, res) {

    // Set unique id to entry
	if (notesData.length == 0){
		req.body.id = "0";
	} else {
		req.body.id = JSON.stringify(JSON.parse(notesData[notesData.length - 1].id) + 1);
	}
	
	console.log("req.body.id: " + req.body.id);

	// Pushes Body to JSON array
	notesData.push(req.body);

	// Write notes data to database
	writeToDB(notesData);
	console.log(notesData);

	// Returns new note in JSON file
	res.json(req.body);
});

// API to delete individual notes from the json file
app.delete('/api/notes/:id', function (req, res) {
	let deleteId = req.params.id;
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

// If no matching route is found default to homepage
app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Start the server on the port
app.listen(PORT, function() {
    console.log(`Server listening on ${PORT}.`)
});