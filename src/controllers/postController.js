const Post = require("../models/post");

exports.postUpload = async (req, res, next) => {
  try {
    console.log(req.body);
    return res.status(201);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
