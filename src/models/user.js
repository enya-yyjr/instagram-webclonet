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
  introdution: {
    type: String,
  },
  website: {
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
});

module.exports = mongoose.model("User", userSchema);
