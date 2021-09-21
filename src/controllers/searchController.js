const User = require("../models/user");
const Post = require("../models/post");

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
