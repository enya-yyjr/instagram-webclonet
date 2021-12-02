const express = require("express");

const { isAuth } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");
const {
  postUpload,
  getPosts,
  postDetail,
  updatePost,
  deletePost,
  postLikeUnlike,
  savePost,
  showPostLikeUser,
} = require("../controllers/postController");

const router = express.Router();

router.post("/", isAuth, upload.single("imageFile"), postUpload);
router.put("/:postId", isAuth, upload.single("imageFile"), updatePost);
router.delete("/:postId", isAuth, deletePost);
router.get("/", isAuth, getPosts);
router.get("/:postId", isAuth, postDetail);
router.put("/:postId/like", isAuth, postLikeUnlike);
router.put("/:postId/save", isAuth, savePost);
router.get("/:postId/likeUsers", showPostLikeUser);

module.exports = router;
