const mongoose = require("mongoose");

const Post = require("../models/post");
const Comment = require("../models/comment");
const moment = require("../moment");
// const { uploadImage, deleteImage } = require("./imageController");

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
    return res
      .status(201)
      .json({ ok: true, message: "Completed writing", post: post });
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
      return res.status(400).json({ message: "Not exist post" });
    }
    // 이미지 수정
    // await deleteImage(post.filename, userId);
    // const { filename, imageUrl } = await uploadImage(file, userId);
    // 게시글 수정
    // post.filename = filename;
    // post.imageUrl = imageUrl;
    post.contents = contents;
    post.hashtags = hashtags;
    await post.save();
    return res.status(200).json({ ok: true, message: "Update complete" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const {
    params: { postId },
    userId,
  } = req;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Not exist post" });
    }
    // await deleteImage(post.filename, userId);
    await Post.deleteOne({ _id: postId });
    return res.status(200).json({ ok: true, message: "Delete complete" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  const { userId } = req;
  try {
    // Post 전체 조회
    // const posts = await Post.find({})
    //   .populate("writer", { userId: 1 })
    //   .populate("comments");
    const posts = await Post.aggregate([
      {
        $project: {
          writer: 1,
          imageUrl: 1,
          contents: 1,
          hashtags: 1,
          likeUsers: 1,
          createdAt: 1,
          commentCount: 1,
          likeCount: 1,
          isLike: {
            $in: [new mongoose.Types.ObjectId(userId), "$likeUsers"],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          // localField: "writer",
          // foreignField: "_id",
          let: { writer: "$writer" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$_id", "$$writer"] } },
            },
            {
              $project: {
                password: 0,
                like: 0,
                follow: 0,
                follower: 0,
                __v: 0,
              },
            },
          ],
          as: "writer",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$postId", "$$id"] } } },
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "users",
                let: { writer: "$writer" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$writer"] } } },
                  {
                    $project: {
                      password: 0,
                      like: 0,
                      follow: 0,
                      follower: 0,
                      __v: 0,
                    },
                  },
                ],
                as: "writer",
              },
            },
            { $sort: { createdAt: -1 } },
          ],
          as: "comments",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    if (!posts) {
      return res.status(400).json({ message: "Cannot find posts" });
    }
    return res.status(200).json({ ok: true, posts: posts });
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
    const post = await Post.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(postId) },
      },
      {
        $lookup: {
          from: "users",
          // localField: "writer",
          // foreignField: "_id",
          let: { writer: "$writer" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$writer"] } } },
            {
              $project: {
                password: 0,
                like: 0,
                follow: 0,
                follower: 0,
                __v: 0,
              },
            },
          ],
          as: "writer",
        },
      },
      {
        $lookup: {
          from: "comments",
          // localField: "_id",
          // foreignField: "postId",
          let: { id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$postId", "$$id"] } } },
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "users",
                let: { writer: "$writer" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$writer"] } } },
                  {
                    $project: {
                      password: 0,
                      like: 0,
                      follow: 0,
                      follower: 0,
                      __v: 0,
                    },
                  },
                ],
                as: "writer",
              },
            },
            {
              $lookup: {
                from: "replycomments",
                // localField: "_id",
                // foreignField: "parentsId",
                let: { id: "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$parentsId", "$$id"] } } },
                  {
                    $lookup: {
                      from: "users",
                      let: { writer: "$writer" },
                      pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$writer"] } } },
                        {
                          $project: {
                            password: 0,
                            like: 0,
                            follow: 0,
                            follower: 0,
                            __v: 0,
                          },
                        },
                      ],
                      as: "writer",
                    },
                  },
                  { $sort: { createdAt: -1 } },
                ],
                as: "childComments",
              },
            },
            { $sort: { createdAt: -1 } },
          ],
          as: "comments",
        },
      },
    ]);
    if (!post) {
      return res.status(400).json({ message: "Cannot find post" });
    }
    return res.status(200).json({ ok: true, post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postLikeUnlike = async (req, res, next) => {
  const {
    userId,
    params: { postId },
  } = req;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Cannot find post" });
    }
    // 이미 좋아요를 누른 경우
    if (post.likeUsers.includes(userId)) {
      post.likeUsers.pull(userId);
      await post.save();
      return res.status(200).json({ ok: true, message: "Unlike success" });
    }
    // 좋아요를 누르지 않은 경우
    post.likeUsers.push(userId);
    await post.save();
    return res.status(200).json({ ok: true, message: "Like success" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = "Post like/unlike failed";
    }
    next(error);
  }
};
