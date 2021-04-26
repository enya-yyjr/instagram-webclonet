const Post = require("../models/post");
const moment = require("../moment");
const { uploadImage, deleteImage } = require("./imageController");

exports.postUpload = async (req, res, next) => {
  const {
    body: { data },
    file,
    userId,
  } = req;
  try {
    // 이미지 파일이 없는 경우
    // if (!file) {
    //   return res.status(401).json({ message: "Check the file format" });
    // }
    // 이미지 업로드
    // const { filename, imageUrl } = await uploadImage(file, userId);
    // JSON.parse
    const { contents, hashtags } = JSON.parse(data);
    // 게시글 생성
    const post = await Post.create({
      writer: userId,
      // filename: filename,
      // imageUrl: imageUrl,
      contents: contents,
      hashtags: hashtags,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
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

exports.updatePost = async (req, res, next) => {
  const {
    file,
    body: { data },
    params: { postId },
    userId,
  } = req;
  try {
    const { contents, hashtags } = JSON.parse(data);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Not exist post" });
    }
    // 이미지 수정
    // await deleteImage(post.filename);
    // const { filename, imageUrl } = await uploadImage(file, userId);
    // 게시글 수정
    // post.filename = filename;
    // post.imageUrl = imageUrl;
    post.contents = contents;
    post.hashtags = hashtags;
    await post.save();
    return res.status(200).json({ message: "Update complete" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Not exist post" });
    }
    // await deleteImage(post.filename);
    await Post.deleteOne({ _id: postId });
    return res.status(200).json({ message: "Delete complete" });
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
    const posts = await Post.find({}).populate("writer", { userId: 1 });
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
    const post = await Post.findById(postId).populate("writer", { userId: 1 });
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
