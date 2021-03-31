const express = require("express");
const multer = require("multer");

const {
  postUpload,
  getPosts,
  postDetail,
  updatePost,
} = require("../controllers/postController");

const { isAuth } = require("../middlewares/authMiddleware");

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

router.post("/", isAuth, upload.single("imageFile"), postUpload);
router.put("/:postId", upload.single("imageFile"), updatePost);
router.get("/", getPosts);
router.get("/:postId", postDetail);

module.exports = router;
