var mongoose = require('mongoose');

//schema for posts
var postSchema = new mongoose.Schema({
    person: String,
    description: String,
    imageUrl: String,
    commentList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }]
});
var post = mongoose.model('post', postSchema);

module.exports = post;