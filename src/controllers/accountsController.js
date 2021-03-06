const bcrypt = require("bcrypt");
const User = require("../models/user");
const { editValidate } = require("../middlewares/authMiddleware");
const { passwordValidate } = require("../middlewares/authMiddleware");
const {
  uploadProfileImage,
  deleteProfileImage,
} = require("../controllers/imageController");

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
  try {
    const existEmail = await User.exists({
      email: email,
      _id: { $ne: req.userId },
    });
    if (existEmail) {
      return res.status(400).json({ error: "이메일이 존재합니다" });
    }
    const { error } = editValidate({ userId, email });
    if (error) return res.status(400).json(error.details[0].message);
    const reqex = /^[\w][a-z0-9_.]{3,27}[^_][\w]$/;
    const result = userId.match(reqex);
    if (result === null) {
      return res
        .status(400)
        .json({ error: "소문자, 숫자, 밑줄 및 마침표만 사용할 수 있습니다" });
    }
    const existId = await User.exists({
      userId: userId,
      _id: { $ne: req.userId },
    });
    if (existId) {
      return res.status(400).json({ error: "아이디가 존재합니다" });
    }
    await User.findByIdAndUpdate(req.userId, {
      name,
      userId,
      website,
      introdution,
      email,
      phoneNum,
      gender,
    });
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

// 프로필 이미지 변경
exports.changeProfileImg = async (req, res, next) => {
  const { userId, file } = req;
  try {
    if (!file) {
      return res.status(401).json({ message: "Check the file format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User cannot find" });
    }
    if (!user.profileImage) {
      const { filename, profileImgUrl } = await uploadProfileImage(
        file,
        userId
      );
      user.profileImageName = filename;
      user.profileImage = profileImgUrl;
      await user.save();
      return res
        .status(200)
        .json({ ok: true, message: "Profile upload success" });
    }
    await deleteProfileImage(user.profileImageName);
    const { filename, profileImgUrl } = await uploadProfileImage(file, userId);
    user.profileImageName = filename;
    user.profileImage = profileImgUrl;
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "Profile update success" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// 프로필 이미지 삭제
exports.deleteProfileImg = async (req, res, next) => {
  const { userId } = req;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User cannot find" });
    }
    await deleteProfileImage(user.profileImageName);
    user.profileImageName = null;
    user.profileImage = null;
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "Profile delete success" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
