const express = require("express"); 
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const shortId = require("shortid");

const server = express();
const Task = require("./models/task");

const port = process.env.PORT || 7270;
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

server.set('view engine', 'ejs');
server.use(express.urlencoded({
    extended: false
}));

server.get('/', async (req, res) => {
    res.render('index');
});

server.get("/api", async (req, res) => {
    console.log("[🔽 API] /api request from " +req.hostname)
    var token = req.query.token;

    if(token != process.env.TOKEN) {
        res.json({error: "Invalid Token"})
        return;
    }

    var tasks = await Task.find();
    res.json({
        tasks: tasks
    });
    console.log("[🔼 API] Responded with tasks to client " +req.hostname)
});

server.get("/api/create", async (req, res) => {
    var name = req.query.name;
    var desc = req.query.desc;
    var personal = req.query.personal;
    var token = req.query.token;

    let dateNow = new Date(Date.now());
    let yyyy = dateNow.getFullYear();
    let mm = dateNow.getMonth()+1;
    let dd=  dateNow.getDate(); 
    var date = yyyy +"-" +mm +"-" +dd;
    
    if(token != process.env.TOKEN) {
        res.json({error: "Invalid Token"})
        return;
    }

    if(!(name && date && personal)) {
        res.json({error: "Missing Parameters"});
        return;
    }

    await Task.create({
        id: shortId.generate(),
        name: name,
        description: desc,
        personal: personal,
        date: date,
        completed: false
    });

    res.redirect("/api?token=" +token);
});

server.get("/api/remove", async (req, res) => {
    var token = req.query.token;
    var id = req.query.id;

    if(token != process.env.TOKEN) {
        res.json({error: "Invalid Token"})
        return;
    }

    var task = await Task.findOne({id: id});
    task.delete();

    res.redirect("/api?token=" +token);
})


server.get("/api/purgeall", async (req, res) => {
    var token = req.query.token;

    if(token != process.env.TOKEN) {
        res.json({error: "Invalid Token"})
        return;
    }

    var tasks = await Task.find();
    for(var task of tasks) {
        task.delete();
    }
    res.redirect("/api?token=" +token);
});

server.listen(port);
console.log("Server has started on port " +port);