const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  writer: { type: String },
  contents: { type: String },
  createdAt: { type: String },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
