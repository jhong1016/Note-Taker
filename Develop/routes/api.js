// Require fs to read and write to files
const fs = require('fs');
const notesData = require("../db/db.json");

module.exports = function(app) {

	function writeToDB(notes) {
        // Converts new JSON Array back to string
        notes = JSON.stringify(notes);
        console.log (notes);
        // Writes string back to db.json
        fs.writeFileSync("../db/db.json", notes, function(err){
            if (err) {
                return console.log(err);
            }
        });
    }

    // API call response for all inputted notes, and send results to the browser as an array of object
    app.get("/api/notes", function (req, res) {
        res.json(notesData);
    });

    // API to write all newly inputted notes to JSON file
    app.post("/api/notes", function (req, res) {

        // Set unique id to entry
        if (notesData.length == 0) {
            req.body.id = "0";
        } else {
            req.body.id = JSON.stringify(JSON.parse(notesData[notesData.length - 1].id) + 1);
        }
        
        console.log("req.body.id: " + req.body.id);

        // Pushes body to JSON array
        notesData.push(req.body);

        // Write notes data to database
        writeToDB(notesData);
        console.log("Succesfully added new note!");

        // Returns new note in JSON file
        res.json(req.body);
    });

    // API to delete individual notes from JSON file
    app.delete("/api/notes/:id", function (req, res) {

        // Obtains id and converts to a string
        let id = req.params.id.toString();
        console.log(id);

        // Goes through notesArray searching for matching ID
        for (i=0; i < notesData.length; i++) {
            
            if (notesData[i].id == id) {
                console.log("Deleted!");

                // Responds with deleted note
                res.send(notesData[i]);

                // Removes the deleted note
                notesData.splice(i,1);
                break;
            }
        }

        // Write notes data to database
        writeToDB(notesData);
    });

};