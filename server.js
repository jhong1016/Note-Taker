// Require express to interact with the front end
const express = require("express");
// Require path for filename paths
const path = require("path");

// Creates express server and sets initial port
const app = express();
const PORT = process.env.PORT || 8000;

// Sets express server to handle data parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Include js files
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Access files in "public" directory
app.use(express.static("public"));

// Start the server on the port
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});