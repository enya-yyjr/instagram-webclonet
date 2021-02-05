const express = require("express");

const { postUpload, getPosts } = require("../controllers/postController");

const router = express.Router();

router.post("/upload", postUpload);
router.get("/", getPosts);

module.exports = router;
