const Comment = require("../models/comment");

const moment = require("../moment");

exports.writeComment = async (req, res, next) => {
  const {
    userId,
    body: { contents },
  } = req;
  try {
    await Comment.create({
      writer: userId,
      contents: contents,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return res.status(201).json({ message: "Comment write complete" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
