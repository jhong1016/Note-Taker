const path = require("path");

module.exports = function(app){
    
    // Route to go to notes page
    app.get("/notes", function(req, res){
        res.sendFile(path.join(__dirname, "../public/notes.html"));
    });

    // If no matching route is found default to index page
    // app.get("*", function (req, res) {
        // res.sendFile(path.join(__dirname, "../public/index.html"));
    // });

    // Route to go to index page
    app.get("/", function(req, res){
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
}