const express = require("express");

const { isAuth } = require("../middlewares/authMiddleware");
const {
  writeComment,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

router.post("/", isAuth, writeComment);
router.delete("/:commentId", isAuth, deleteComment);

module.exports = router;
