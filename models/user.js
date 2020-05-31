var mongoose = require('mongoose');

//schema for users
var userSchema = new mongoose.Schema({
    name: String,
    id: String,
    password: String,
    postList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "postSchema"
    }]
});

var user = mongoose.model("user", userSchema);

module.exports = user;