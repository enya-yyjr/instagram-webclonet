const Comment = require("../models/comment");
const Post = require("../models/post");

const moment = require("../moment");

exports.writeComment = async (req, res, next) => {
  const {
    userId,
    body: { postId, contents },
  } = req;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not exist" });
    }
    const comment = await Comment.create({
      writer: userId,
      contents: contents,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    post.comments.push(comment._id);
    await post.save();
    return res
      .status(201)
      .json({ ok: true, message: "Comment write complete", comment: comment });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  const {
    userId,
    body: { postId },
    params: { commentId },
  } = req;
  try {
    // Post의 comments 배열에서 comment삭제
    const post = await Post.findOne({ _id: postId, writer: userId });
    if (!post) {
      return res.status(403).json({ message: "Cannot find post" });
    }
    post.comments.splice(post.comments.indexOf(commentId), 1);
    await post.save();
    // Comment 삭제
    await Comment.findByIdAndDelete(commentId);
    return res
      .status(200)
      .json({ ok: true, message: "Comment delete complete" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
