const Post = require("../models/post");

exports.postUpload = async (req, res, next) => {
  const { data } = req.body;
  try {
    // JSON.parse
    const { contents, hashtags } = JSON.parse(data);
    // 게시글 생성
    const post = await Post.create({
      contents: contents,
      hashtags: hashtags,
    });
    console.log(post);
    return res.status(201).json({ message: "Completed writing", post: post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    // Post 전체 조회
    const posts = await Post.find({});
    if (!posts) {
      return res.status(204).json({ message: "Cannot find posts" });
    }
    return res.status(200).json({ posts: posts });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
