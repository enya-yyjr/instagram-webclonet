const Post = require("../models/post");
const Comment = require("../models/comment");
const ReplyComment = require("../models/replyComment");

const moment = require("../moment");

exports.writeComment = async (req, res, next) => {
  const {
    userId,
    body: { postId, commentId, taggedPerson, contents },
  } = req;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not exist" });
    }
    // 대댓글
    if (commentId && taggedPerson) {
      const reComment = await ReplyComment.create({
        postId: postId,
        writer: userId,
        parentsId: commentId,
        taggedPerson: "@" + taggedPerson,
        contents: contents,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      const parentsComment = await Comment.findById(commentId);
      parentsComment.childCommentId.push(reComment._id);
      await parentsComment.save();
      return res
        .status(201)
        .json({ ok: true, message: "Comment write complete", reComment });
    }
    // 댓글
    const comment = await Comment.create({
      postId: postId,
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
      return res.status(400).json({ message: "Cannot find post" });
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

exports.commentLikeUnlike = async (req, res, next) => {
  const {
    userId,
    params: { commentId },
  } = req;
  try {
    const comment = await Comment.findById(commentId);
    // 댓글 데이터가 없으면 대댓글에서 검색
    if (!comment) {
      const reComment = await ReplyComment.findById(commentId);
      // 대댓글 데이터가 없는 경우
      if (!reComment) {
        return res.status(400).json({ message: "Cannot find comment" });
      }
      // 대댓글 데이터가 있는 경우 좋아요 삭제
      if (reComment.like.includes(userId)) {
        reComment.like.splice(reComment.like.indexOf(userId), 1);
        await reComment.save();
        return res
          .status(200)
          .json({ ok: true, message: "Reply comment unlike success" });
      }
      // 좋아요를 누르지 않은 경우
      reComment.like.push(userId);
      await reComment.save();
      return res
        .status(200)
        .json({ ok: true, message: "Reply comment like success" });
    }
    // 이미 댓글의 좋아요를 누른 경우 좋아요 취소
    if (comment.like.includes(userId)) {
      comment.like.splice(comment.like.indexOf(userId), 1);
      await comment.save();
      return res
        .status(200)
        .json({ ok: true, message: "Comment unlike success" });
    }
    // 좋아요를 누르지 않은 경우
    comment.like.push(userId);
    await comment.save();
    return res.status(200).json({ ok: true, message: "Comment like success" });
  } catch (error) {
    if (!error.statusCode) {
      error.message = "Like/Unlike failed";
      error.statusCode = 500;
    }
    next(error);
  }
};
