const mongoose = require("mongoose");

const replyCommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId },
  writer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  taggedPerson: { type: String },
  contents: { type: String },
  parentsId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  createdAt: { type: String },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const ReplyComment = mongoose.model("ReplyComment", replyCommentSchema);

module.exports = ReplyComment;
