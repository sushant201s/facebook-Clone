var express = require('express');
var app = express();
var post = require('./models/post');
var user = require('./models/user');
var seedToDB = require('./seeds');
var comment = require('./models/comment');

seedToDB();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

const mongoose = require('mongoose');
//connect to db
mongoose.connect('mongodb://localhost/usersdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//function to create a new user and save it to DB
function createUser(newUser) {
    user.create({
        id: newUser.id,
        name: newUser.name,
        password: newUser.password
    }, function (error) {
        if (!error)
            console.log("created user with id " + newUser.name);
        else
            console.log("error while creating new user with id " + newUser.name);
    });
}


//function to return the post array from the DB
function getPosts(res) {
    post.find({}, function (error, posts) {
        if (!error) {
            //if no error render the fb page
            res.render("reddit", {
                postArray: posts,
                username: username
            });
        } else
            console.log("error getting posts from database");
    });
}

app.set("view engine", "ejs");
var username;

//route the home page
app.get("/", function (req, res) {
    res.render("home");
});

//route when user logged into reddit
app.get("/reddit", function (req, res) {
    //call get posts to render the fb page
    getPosts(res);
});

//route to a particular post
app.get("/reddit/:id", function (req, res) {
    //find the post with the specified id

    post.findById(req.params.id).populate('commentList').exec(
        function (error, postToShow) {
            console.log(req.params.id);
            if (!error) {
                //render the show post template
                console.log(postToShow);
                res.render("show", {
                    post: postToShow
                });
            } else
                console.log("error occurured");

        });
});

//route to add a comment
app.post("/reddit/:id/comment/add", function (req, res) {
    //add comment to the post with given id
    post.findById(req.params.id, function (err, postFound) {
        if (!err) {
            createComment({
                description: req.body.commentToAdd,
                author: "Sushant"
            }, postFound, res);
        } else
            console.log("failed to add comment");
    });
});

//function to create a comment 
function createComment(commentToCreate, postToLinkComment, res) {
    comment.create({
        description: commentToCreate.description,
        author: commentToCreate.userName
    }, function (err, createdComment) {
        if (!err) {
            console.log("comment created by " + commentToCreate.author);
            //link comment to the post
            postToLinkComment.commentList.push(createdComment);
            postToLinkComment.save(function (err, savedPost) {
                if (!err) {
                    res.redirect("/reddit/" + postToLinkComment.id);
                } else
                    console.log("post not saved with comment");
            });

        } else
            console.log("comment creation by " + commentToCreate.author + " failed");
    });
}



//login route
app.post("/login", function (req, res) {
    //check if credentials are correct and exists in DB
    user.find({
        id: req.body.id,
        password: req.body.password
    }, function (error, userfound) {
        //check if we get a blank object
        if (userfound.length === 0) {
            //redirect to the same page 
            res.redirect("/");
        } else {
            //set the username and redirect to the facebook page
            username = req.body.id;
            res.redirect("/reddit");
        }
    });
});

//registration route
app.post("/register", function (req, res) {
    //save the details to DB
    var newUserToSave = {
        id: req.body.id,
        name: req.body.name,
        password: req.body.password
    };
    createUser(newUserToSave);
    //set the username and redirect to the facebook page
    username = req.body.id;
    res.redirect("/reddit");
});

//profile page
app.get("/profile", function (req, res) {

});

app.listen(3000, function () {
    console.log("server started on 3000");
});