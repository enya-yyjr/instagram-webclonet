const mongoose = require("mongoose");

const User = require("../models/user");
const Post = require("../models/post");

exports.getOwnerPost = async (req, res, next) => {
  const {
    userId,
    params: { id },
  } = req;
  try {
    const user = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "posts",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$writer", "$$id"] } },
            },
          ],
          as: "posts",
        },
      },
      {
        $project: {
          name: 1,
          userId: 1,
          introdution: 1,
          website: 1,
          totalPost: { $size: "$posts" },
          totalFollow: { $size: "$follow" },
          totalFollower: { $size: "$follower" },
          isFollow: { $in: [new mongoose.Types.ObjectId(userId), "$follower"] },
        },
      },
    ]);
    const post = await Post.aggregate([
      { $match: { writer: new mongoose.Types.ObjectId(id) } },
      {
        $project: {
          imageUrl: 1,
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likeUsers" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    const userWithSavedPost = await User.findById(userId, {
      savedPost: 1,
    }).populate("savedPost", { imageUrl: 1, commentCount: 1, likeCount: 1 });
    const savedPost = userWithSavedPost.savedPost;
    return res.status(200).json({ ok: true, user, post, savedPost });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
