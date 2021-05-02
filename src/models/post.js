const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: { type: String },
  imageUrl: { type: String, default: null },
  contents: { type: String, required: true },
  hashtags: [{ type: String }],
  likeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: String, required: true },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
