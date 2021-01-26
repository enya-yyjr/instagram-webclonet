const express = require("express");

const { postUpload } = require("../controllers/postController");

const router = express.Router();

router.post("/upload", postUpload);

module.exports = router;
