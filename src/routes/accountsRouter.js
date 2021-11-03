const express = require("express");

const { isAuth } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");
const {
  edit,
  userinfo,
  passwordChange,
  changeProfileImg,
} = require("../controllers/accountsController");

const router = express.Router();

router.put("/edit", isAuth, edit);
router.get("/edit", isAuth, userinfo);
router.put("/password", isAuth, passwordChange);
router.put(
  "/profileImg",
  isAuth,
  upload.single("profileImage"),
  changeProfileImg
);

module.exports = router;
