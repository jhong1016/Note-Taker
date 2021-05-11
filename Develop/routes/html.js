// Require path for filename paths
const path = require("path");

module.exports = function(app) {

    // Get homepage when the 'GetStarted' button is clicked
    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "./public/notes.html"));
    });

    // If no matching route is found default to homepage
    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });
}