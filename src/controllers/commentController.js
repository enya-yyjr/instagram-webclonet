const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const ReplyComment = require("../models/replyComment");

const moment = require("../moment");

exports.writeComment = async (req, res, next) => {
  const {
    userId,
    body: { contents },
    params: { postId },
  } = req;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not exist" });
    }
    // commentIsAllowed가 false이면 댓글 작성 금지
    if (!post.commentIsAllowed) {
      return res
        .status(404)
        .json({ message: "Comment write permission denied" });
    }
    const hashtags = contents.match(/#[0-9a-zA-Z가-힣]+/gi);
    const taggedPerson = contents.match(/@[_0-9a-zA-Z가-힣]+/gi);
    // 댓글 생성
    const comment = await Comment.create({
      postId: postId,
      writer: userId,
      hashtags: hashtags,
      taggedPerson: taggedPerson,
      contents: contents,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    // post.comments에 댓글._id추가
    post.comments.push(comment._id);
    await post.save();
    // Create 한 댓글을 Object로 변환
    const responseComment = comment.toObject();
    // 작성자 검색
    const user = await User.findById(userId, { userId: 1 });
    // Object화된 reponseComment의 writer에 user.userId를 넣음
    responseComment.writer = user.userId;
    return res.status(201).json({
      ok: true,
      message: "Comment write complete",
      comment: responseComment,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.writeReplyComment = async (req, res, next) => {
  const {
    userId,
    body: { contents },
    params: { postId, commentId },
  } = req;
  try {
    const hashtags = contents.match(/#[0-9a-zA-Z가-힣]+/gi);
    const taggedPerson = contents.match(/@[_0-9a-zA-Z가-힣]+/gi);
    const reComment = await ReplyComment.create({
      postId: postId,
      parentsId: commentId,
      writer: userId,
      hashtags: hashtags,
      taggedPerson: taggedPerson,
      contents: contents,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    const responseReComment = reComment.toObject();
    const user = await User.findById(userId, { userId: 1 });
    responseReComment.writer = user.userId;
    return res
      .status(201)
      .json({
        ok: true,
        message: "Reply Comment write complete",
        reComment: responseReComment,
      });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  const {
    params: { postId, commentId },
    query: { isReply },
  } = req;
  try {
    if (isReply === "true") {
      const { deletedCount } = await ReplyComment.deleteOne({ _id: commentId });
      if (!deletedCount) {
        return res.status(400).json({ message: "Reply comment delete fail" });
      }
      return res
        .status(200)
        .json({ ok: true, message: "Reply comment delete success" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Cannot find post" });
    }
    const { deletedCount } = await Comment.deleteOne({ _id: commentId });
    if (!deletedCount) {
      return res.status(400).json({ message: "Comment delete fail" });
    }
    post.comments.pull(commentId);
    await post.save();
    return res
      .status(200)
      .json({ ok: true, message: "Comment delete success" });
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
        reComment.like.pull(userId);
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
