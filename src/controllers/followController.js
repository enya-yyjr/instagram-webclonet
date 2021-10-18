const User = require("../models/user");

// 나를 follow 하는 사람 (follower)List
exports.getfollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("follower", {
      name: 1,
      userId: 1,
    });
    res.json({ user: user.follower });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};

// 내가 follow 하는 사람 (following)List
exports.getfollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("follow", {
      name: 1,
      userId: 1,
    });
    res.json({ user: user.follow });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};

// 내가 상대방을 follow 하기, 취소
exports.follow = async (req, res) => {
  try {
    const myId = await User.findById(req.userId);
    const user = await User.findById(req.params.id);
    if (
      !user.follower.includes(req.userId) &&
      !myId.follow.includes(req.params.id)
    ) {
      myId.follow.push(req.params.id);
      await myId.save();
      user.follower.push(req.userId);
      await user.save();
    } else {
      myId.follow.pull(req.params.id);
      await myId.save();
      user.follower.pull(req.userId);
      await user.save();
    }
    return res.json({ ok: true });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};
