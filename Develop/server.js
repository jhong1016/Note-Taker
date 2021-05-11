// Require express to interact with the front end
const express = require("express");
// Require path for filename paths
const path = require("path");


// Creates express server and sets initial port
const app = express();
const PORT = process.env.PORT || 8000;

// Sets express server to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

// Include js files
require("./routes/api.js")(app);
require("./routes/html.js")(app);

// Start the server on the port
app.listen(PORT, function() {
    console.log(`Server listening on ${PORT}.`)
});