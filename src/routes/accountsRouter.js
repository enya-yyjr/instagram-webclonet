const express = require("express");
const {
  edit,
  userinfo,
  passwordChange,
} = require("../controllers/accountsController");
const { isAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.put("/edit", isAuth, edit);
router.get("/edit", isAuth, userinfo);
router.put("/password", isAuth, passwordChange);

module.exports = router;
