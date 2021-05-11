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
      .json({ message: "Comment write complete", comment: comment });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
