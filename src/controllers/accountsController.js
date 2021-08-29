const bcrypt = require("bcrypt");
const User = require("../models/user");
const { editValidate } = require("../middlewares/authMiddleware");
const { passwordValidate } = require("../middlewares/authMiddleware");

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

// 유저 프로필 편집
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

// 비밀번호 변경
exports.passwordChange = async (req, res, next) => {
  const { prevPwd, newPwd, newPwdCheck } = req.body;
  const user = await User.findById(req.userId);
  const { error } = passwordValidate({ newPwd, newPwdCheck });
  if (error) return res.status(400).json(error.details[0].message);
  try {
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, error: "사용자를 찾을 수 없습니다" });
    }
    // 입력한 이전 비밀번호와 DB에 있는 비밀번호 비교
    const equalPassword = await bcrypt.compare(prevPwd, user.password);
    if (!equalPassword) {
      return res
        .status(404)
        .json({ ok: false, error: "비밀번호가 일치하지 않습니다" });
    }
    // 새 비밀번호 두가지 비교
    if (newPwd !== newPwdCheck) {
      return res.status(404).json({
        ok: false,
        error: "새 비밀번호가 일치하지 않습니다",
      });
    }
    // 비밀번호 hash
    const newPassword = await bcrypt.hash(newPwd, 12);
    user.password = newPassword;
    await user.save();
    return res.json({ ok: true, message: "비밀번호 변경 완료" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
