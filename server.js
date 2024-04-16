// Import required modules
var Express = require("express");
const router = require("./routes/indexRouter");
const BodyParser = require("body-parser");
const cors = require("cors");
const session = require('express-session');
const path = require('path');
const settings = require('./config/appConfig.js')
const messages = require('./message/message')


// Create an instance of Express
var server = Express();
  
// Middleware to parse incoming JSON requests
server.use(BodyParser.json());

// Enable Cross-Origin Resource Sharing (CORS)
server.use(cors());
    
// Set up session middleware
server.use(session({
    secret: 'jsonFileEditor', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


// Serve static files from the 'public'  directory
server.use(Express.static(path.join(__dirname, '/public')));
server.use(Express.static(path.join(__dirname+ '/views')));

  
// Use the defined router for handling routes
server.use(router);
// Define the port to listen on, using environment variable
const Port = process.env.PORT || settings.SERVER_PORT;

// Start the server and listen on the specified port
server.listen(Port, () => {
    console.log(messages.SERVER_START, settings.SERVER_PORT);
});
