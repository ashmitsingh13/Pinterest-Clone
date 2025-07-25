const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  image:{
    type:String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array, // Reference to User IDs
    ref: 'User',
    default: []
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
