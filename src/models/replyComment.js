const mongoose = require("mongoose");

const replyCommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId },
  parentsId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  writer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contents: { type: String },
  taggedPerson: [{ type: String }],
  hashtags: [{ type: String }],
  createdAt: { type: String },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const ReplyComment = mongoose.model("ReplyComment", replyCommentSchema);

module.exports = ReplyComment;
