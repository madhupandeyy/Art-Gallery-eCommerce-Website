var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'Art_Gallery',
    resave: true,
    saveUninitialized: true
  }));

mongoose.connect('mongodb://localhost:27017/MyBackEndDatabase');
var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/register", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    db.collection("login").findOne({ email: email }, (err, result) => {
        if (err) {
            throw err;
        }
        if (result) {
            return res.send("<script>alert('User already exists'); window.location.href='/login.html';</script>");
        } else {
            var data = {
                name: name,
                email: email,
                password: password,
            };
            db.collection("login").insertOne(data, (err, collection) => {
                if (err) {
                    throw err;
                }
                console.log("Data Inserted Successfully");
                return res.redirect("fs.html");
            });
        }
    });
});

const bcrypt = require('bcrypt');

app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
  
    db.collection("login").findOne({ email: email }, (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        // User not found, return an error message
        return res.send("<script>alert('User not found'); window.location.href='/login.html';</script>");
      } else {
        // Check if the password matches
        if (password === user.password) {
          req.session.user = email;
          return res.redirect("fs1.html");
        } else {
          return res.send("<script>alert('Incorrect password'); window.location.href='/login.html';</script>");
        }
      }
    });
  });
  
app.get("/logout", (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy();
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.set({
        "Allow-acces-Allow-Origin": '*'
    });
    return res.redirect('fs.html');
});

const server = app.listen(3065, () => {
    console.log("Listening on port 3065");
});
