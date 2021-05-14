const express = require("express");

const { isAuth } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");
const {
  postUpload,
  getPosts,
  postDetail,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

router.post("/", isAuth, upload.single("imageFile"), postUpload);
router.put("/:postId", isAuth, upload.single("imageFile"), updatePost);
router.delete("/:postId", isAuth, deletePost);
router.get("/", getPosts);
router.get("/:postId", postDetail);

module.exports = router;
