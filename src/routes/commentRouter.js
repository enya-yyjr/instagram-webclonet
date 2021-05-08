const express = require("express");

const { isAuth } = require("../middlewares/authMiddleware");
const { writeComment } = require("../controllers/commentController");

const router = express.Router();

router.post("/", isAuth, writeComment);

module.exports = router;
