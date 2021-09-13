const express = require("express");

const { getOwnerPost, getSavedPost } = require("../controllers/userController");
const { isAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/post/:id", isAuth, getOwnerPost);
router.get("/saved", isAuth, getSavedPost);

module.exports = router;
