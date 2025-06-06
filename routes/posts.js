const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
    trim: true
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
