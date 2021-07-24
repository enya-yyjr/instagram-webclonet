const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userValidate } = require("../middlewares/authMiddleware");

const User = require("../models/user");

exports.signup = async (req, res) => {
  const { error } = userValidate(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  const { email, name, userId, password } = req.body;
  const existEmail = await User.findOne({ email });
  const existUserId = await User.findOne({ userId });
  try {
    if (existEmail) {
      return res.status(400).json({ error: "이메일이 존재합니다" });
    } else if (existUserId) {
      return res.status(400).json({ error: "아이디가 존재합니다" });
    }
    const hashPw = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      userId,
      password: hashPw,
    });
    res.json({ ok: true, message: "회원가입 성공" });
    await user.save();
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  const { id, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ userId: id }, { email: id }],
    });
    if (!user) {
      return res.status(400).json({ error: "사용자가 존재하지 않습니다" });
    }
    const hashedpassword = await bcrypt.compare(password, user.password);
    if (!hashedpassword) {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다" });
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_KEY,
      {
        expiresIn: "30d",
      }
    );
    return res.json({ token, ok: true, message: "로그인 성공" });
  } catch (err) {
    console.log(err);
  }
};
