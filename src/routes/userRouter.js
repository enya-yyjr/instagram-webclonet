const express = require("express");

const { getOwnerPost } = require("../controllers/userController");
const { isAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/post/:id", isAuth, getOwnerPost);

module.exports = router;
