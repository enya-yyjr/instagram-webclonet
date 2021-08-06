const User = require("../models/user");
const { editValidate } = require("../middlewares/authMiddleware");

// 프론트로 유저정보 보내줌.
exports.userinfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId, {
      like: 0,
      follow: 0,
      follower: 0,
      __v: 0,
      password: 0,
    });
    if (!user) {
      return res.json({ error: "유저정보 없음" });
    }
    return res.json({ user, ok: true });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  const { name, userId, website, introdution, email, phoneNum, gender } =
    req.body;
  const existEmail = await User.findOne({ email });
  const existUserId = await User.findOne({ userId });
  const { error } = editValidate({ userId, email });
  if (error) return res.status(400).json(error.details[0].message);
  const reqex = /^[\w][a-z0-9_.]{3,27}[^_][\w]$/;
  const result = userId.match(reqex);
  if (result === null) {
    return res
      .status(400)
      .json({ error: "소문자, 숫자, 밑줄 및 마침표만 사용할 수 있습니다" });
  }
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.json({ error: "유저정보 없음" });
    }
    if (existEmail) {
      return res.status(400).json({ error: "이메일이 존재합니다" });
    } else if (existUserId) {
      return res.status(400).json({ error: "아이디가 존재합니다" });
    }
    user.name = name;
    user.userId = userId;
    user.website = website;
    user.introdution = introdution;
    user.email = email;
    user.phoneNum = phoneNum;
    user.gender = gender;
    await user.save();
    return res.json({ ok: true });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
