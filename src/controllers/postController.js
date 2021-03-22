const Post = require("../models/post");

const moment = require("../moment");

exports.postUpload = async (req, res, next) => {
  const {
    body: { data },
    file,
    userId,
  } = req;
  try {
    // 이미지 파일이 없는 경우 (현재는 사용하지 않음. 추후 주석 해제)
    // if (!file) {
    //   return res.status(401).json({ message: "Check the file format" });
    // }
    // JSON.parse
    const { contents, hashtags } = JSON.parse(data);
    // 게시글 생성
    const post = await Post.create({
      writer: userId,
      contents: contents,
      hashtags: hashtags,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
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
    const posts = await Post.find({}).populate("writer", {
      name: 1,
    });
    if (!posts) {
      return res.status(404).json({ message: "Cannot find posts" });
    }
    return res.status(200).json({ posts: posts });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postDetail = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Cannot find post" });
    }
    return res.status(200).json({ post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
