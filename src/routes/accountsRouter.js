const express = require("express");
const { edit, userinfo } = require("../controllers/accountsController");
const { isAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.put("/edit", isAuth, edit);
router.get("/edit", isAuth, userinfo);

module.exports = router;
