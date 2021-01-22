const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  imageUrl: { type: String, default: null },
  contents: { type: String, required: true },
  hashtags: [{ type: String }],
  likeUsers: [{ type: String }],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
