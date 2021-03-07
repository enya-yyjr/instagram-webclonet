const express = require("express");
const multer = require("multer");

const {
  postUpload,
  getPosts,
  postDetail,
} = require("../controllers/postController");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

const router = express.Router();

router.post("/upload", upload.single("imageFile"), postUpload);
router.get("/", getPosts);
router.get("/:postId", postDetail);

module.exports = router;
