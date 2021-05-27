const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  writer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contents: { type: String },
  parentsId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  createdAt: { type: String },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
