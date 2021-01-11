const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  follow: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  follower: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  intro: {
    type: String,
  },
  phoneNum: {
    type: String,
  },
  gender: {
    type: String,
  },
  profileImage: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
