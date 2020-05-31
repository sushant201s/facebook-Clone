//this file  is used to create some random posts and comments with those posts

var mongoose = require('mongoose');
var post = require('./models/post');
var comment = require('./models/comment');

//drop all existing posts
post.remove({}, function (err) {
    if (!err)
        console.log("Removed all posts from DB");
    else
        console.log("failed to remove all posts");
})
//drop all existing comments
comment.remove({}, function (err) {
    if (!err)
        console.log("Removed all comments from DB");
    else
        console.log("failed to remove all comments");
});

//using faker to generate some data
var faker = require('faker');
//random images
const coolImages = require("cool-images");

// //function to return a random post
function randomPost() {
    return {
        person: faker.internet.userName(),
        imageUrl: coolImages.one(300, 400),
        description: faker.company.catchPhraseDescriptor()
    };
}

//function to return a random comment
function randomComment() {
    return {
        description: faker.lorem.sentence(),
        author: faker.internet.userName()
    };
}

//function to create a new post and save it to DB
function createPost(postToCreate) {
    post.create({
        person: postToCreate.person,
        description: postToCreate.description,
        imageUrl: postToCreate.imageUrl
    }, function (error, createdPost) {
        if (!error) {
            console.log("post successfully created by " + postToCreate.person);
            //create a comment and add it to post
            createComment(randomComment(), createdPost);
        } else
            console.log("post creation by " + postToCreate.person + " failed");
    });
}

//function to create a comment 
function createComment(commentToCreate, postToLinkComment) {
    comment.create({
        description: commentToCreate.description,
        author: commentToCreate.userName
    }, function (err, createdComment) {
        if (!err) {
            console.log("comment created by " + commentToCreate.author);
            //link comment to the post
            postToLinkComment.commentList.push(createdComment);
            postToLinkComment.save(function (err, savedPost) {
                if (!err)
                    console.log(savedPost);
                else
                    console.log("post not saved with comment");
            });

        } else
            console.log("comment creation by " + commentToCreate.author + " failed");
    });
}

function seedToDB() {
    createPost(randomPost());
}

module.exports = seedToDB;