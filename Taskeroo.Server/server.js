const express = require("express"); 
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const server = express();

const port = process.env.PORT || 7270;

server.set('view engine', 'ejs');
server.use(express.urlencoded({
    extended: false
}));

server.get('/', async (req, res) => {
    res.render('index');
});




server.listen(port);
console.log("Server has started on port " +port);