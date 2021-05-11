// Require fs to read and write to files
const fs = require("fs");

// Imported 'uuid' npm package for unique id
const { v4: uuidv4 } = require('uuid');

// Routing
module.exports = function(app) {

    // API call response for all inputted notes, and send results to the browser as an array of object
    app.get("/api/notes", (request, response) => {
        
        console.log("Executing...");

        // Reads 'db.json' file 
        let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
        
        console.log("Returning notes data: " + JSON.stringify(data));
        
        // Sends read data to response of 'GET' request
        response.json(data);
    });

    // API to write all newly inputted notes to JSON file
    app.post("/api/notes", (request, response) => {

        // Extractes new note from requestbody
        const newNote = request.body;
        
        console.log("New Note: " + JSON.stringify(newNote));

        // Assigns unique id obtained from 'uuid' npm package
        newNote.id = uuidv4();

        // Reads data from 'db.json' file
        let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    
        // Pushes new note in 'db.json' file
        data.push(newNote);

        // Writes notes datat to 'db.json' file
        fs.writeFileSync('./db/db.json', JSON.stringify(data));
        
        console.log("Succesfully added new note!");

        // Sends response
        response.json(data);
    });

    // API to delete individual notes from JSON file
    app.delete("/api/notes/:id", (request, response) => {

        // Fetches id to delete note
        let noteId = request.params.id.toString();
        
        console.log(`\n\nDELETE note request for noteId: ${noteId}`);

        // Reads data from 'db.json' file
        let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

        // Filters data to get notes except the one to delete
        const newData = data.filter( note => note.id.toString() !== noteId );

        // Writes new data to 'db.json' file
        fs.writeFileSync('./db/db.json', JSON.stringify(newData));

        console.log(`Successfully deleted note: ${noteId}`);

        // Sends response
        response.json(newData);
    });
};