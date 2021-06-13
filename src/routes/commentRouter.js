const express = require("express");

const { isAuth } = require("../middlewares/authMiddleware");
const {
  writeComment,
  deleteComment,
  commentLikeUnlike,
} = require("../controllers/commentController");

const router = express.Router();

router.post("/", isAuth, writeComment);
// router.delete("/:postId/:commentId", isAuth, deleteComment);
router.delete("/", isAuth, deleteComment);
router.put("/:commentId/like", isAuth, commentLikeUnlike);

module.exports = router;
