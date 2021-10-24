const User = require("../models/user");
const Post = require("../models/post");
const mongoose = require("mongoose");

exports.search = async (req, res, next) => {
  const { keyword } = req.query;
  try {
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is not exist" });
    }
    // 해시태그 검색
    if (keyword[0] === "#") {
      const hashtagKeyword = keyword.replace(" ", "").split("#")[1];
      const post = await Post.find(
        {
          hashtags: {
            $elemMatch: { $regex: new RegExp(hashtagKeyword, "i") },
          },
        },
        { hashtags: 1 }
      );
      const hashArray = [];
      post.forEach((el) => {
        el.hashtags.forEach((tag) => {
          if (new RegExp(hashtagKeyword, "i").test(tag)) {
            hashArray.push(tag);
          }
        });
      });
      const hashtags = hashArray.reduce((acc, cur) => {
        if (!acc[cur]) {
          acc[cur] = 0;
        }
        acc[cur] += 1;
        return acc;
      }, {});
      const array = [];
      for (let hashtag in hashtags) {
        array.push({ tagName: hashtag, postCount: hashtags[hashtag] });
      }
      return res.status(200).json({ ok: true, result: array });
    }
    // 유저 검색
    const userKeyword = keyword.replace(" ", "");
    const user = await User.find(
      {
        userId: {
          $regex: new RegExp(userKeyword, "i"),
        },
      },
      { userId: 1, introdution: 1 }
    );
    return res.status(200).json({ ok: true, user });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.showData = async (req, res, next) => {
  const {
    userId,
    query: { keyword },
  } = req;
  try {
    if (keyword[0] === "#") {
      const hashKeyword = keyword.split("#")[1];
      const posts = await Post.find(
        {
          hashtags: { $elemMatch: { $regex: new RegExp(hashKeyword, "i") } },
        },
        { imageUrl: 1, commentCount: 1, likeCount: 1 }
      );
      return res.status(200).json({ ok: true, posts });
    }
    let userKeyword = keyword;
    if (keyword[0] === "@") {
      userKeyword = keyword.split("@")[1];
    }
    // 사용자 검색
    const owner = await User.findOne({ userId: userKeyword }, { _id: 1 });
    const user = await User.aggregate([
      { $match: { userId: userKeyword } },
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
          isFollow: {
            $in: [new mongoose.Types.ObjectId(userId), "$follower"],
          },
        },
      },
    ]);
    const post = await Post.aggregate([
      { $match: { writer: owner._id } },
      {
        $project: {
          imageUrl: 1,
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likeUsers" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    // 로그인한 사용자의 정보를 조회하는 경우
    if (userId === owner._id.toString()) {
      const userWithSavedPost = await User.findOne(
        { userId: userKeyword },
        {
          savedPost: 1,
        }
      ).populate("savedPost", { imageUrl: 1, commentCount: 1, likeCount: 1 });
      const savedPost = userWithSavedPost.savedPost;
      return res.status(200).json({ ok: true, user, post, savedPost });
    } else {
      return res.status(200).json({ ok: true, user, post });
    }
    return res.status(200).json({ ok: true, user });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
