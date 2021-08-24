const mongoose = require("mongoose");

const Comment = require("./comment");
const ReplyComment = require("./replyComment");

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
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: String, required: true },
  commentCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  commentIsAllowed: { type: Boolean, default: true },
});

postSchema.pre("save", async function (next) {
  this.commentCount = this.comments.length;
  this.likeCount = this.likeUsers.length;
  next();
});

postSchema.pre("deleteOne", async function (next) {
  const { _id } = this.getFilter();
  await Comment.deleteMany({ postId: _id });
  await ReplyComment.deleteMany({ postId: _id });
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
