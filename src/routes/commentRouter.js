const express = require("express");

const { isAuth } = require("../middlewares/authMiddleware");
const {
  writeComment,
  deleteComment,
  commentLikeUnlike,
} = require("../controllers/commentController");

const router = express.Router();

router.post("/", isAuth, writeComment);
router.delete("/:commentId", isAuth, deleteComment);
router.put("/:commentId/like", isAuth, commentLikeUnlike);

module.exports = router;
