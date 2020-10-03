const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

var MongoClient = require('mongodb').MongoClient;

const dbConfig = require('./config/database.config');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, { useNewUrlParser: true });
var nameSchema = new mongoose.Schema({
    name: String,
    age: Number,
});
var ages = mongoose.model('ages', nameSchema);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/insert', function(req, res) {
    console.log(req.body);
    var myData = new ages(req.body);
        myData.save()
            .then(item => {
                res.send('Age saved to database');
            })
            .catch(err => {
                res.status(400).send('Unable to save to database');
            });
});

app.get('/all', function(req, res) {
    MongoClient.connect(dbConfig.url, function(err, db) {
        useNewUrlParser: true
        if (err) throw err;
        var dbo = db.db('dogs');
        dbo.collection('ages').find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});

app.post('delete', function(req, res) {
    MongoClient.connect(dbConfig.url, function(err, db) {
        if (err) throw err;
        var dbo = db.db('dogs');
        var myquery = { title: req.body.title };
        dbo.collection('dogs').deleteOne(myquery, function(err, obj) {
            if (err) throw err;
            res.send('deleted');
            db.close();
        });
    });
});

app.get('/titles', function(req, res) {
    MongoClient.connect(dbConfig.url, function(err, db) {
        useNewUrlParser: true
        if (err) throw err;
        var dbo = db.db('dogs');
        var mysort = { title: -1 };
        dbo.collection('ages').find({}, { projection: { _id: 0, title: 1 } }).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});

app.post('/updatecontent', function(req, res) {
    MongoClient.connect(dbConfig.url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("avengers");
        var myquery = { title: req.body.title };
        var newvalues = { $set: {tile: req.body.title,content: req.body.content} };
        dbo.collection("weapons").updateOne(myquery, newvalues, function(err, result) {
            if (err) throw err;
            res.send("1 document updated with title: "+req.body.title);
            db.close();
        });
    });
});

app.post('/updatetitle', function(req, res) {
    MongoClient.connect(dbConfig.url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("avengers");
        var myquery = { title: req.body.title };
        var newvalues = { $set: {title: req.body.newtitle} };
        dbo.collection("weapons").updateOne(myquery, newvalues, function(err, result) {
            if (err) throw err;
            res.send("1 document updated with title: "+req.body.title);
            db.close();
        });
    });
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to the application."});
});

// listen for requests
app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});
