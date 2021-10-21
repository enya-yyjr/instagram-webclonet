const express = require("express");

const { getOwnerPost } = require("../controllers/userController");
const { isAuth } = require("../middlewares/authMiddleware");
const {
  getfollowers,
  getfollowing,
  follow,
} = require("../controllers/followController");

const router = express.Router();

router.get("/:id", isAuth, getOwnerPost);

router.get("/followers/:id", getfollowers);
router.get("/following/:id", getfollowing);
router.put("/follow/:id", isAuth, follow);

module.exports = router;
