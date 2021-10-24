const express = require("express");

const { isAuth } = require("../middlewares/authMiddleware");
const { search, showData } = require("../controllers/searchController");

const router = express.Router();

router.get("/search", isAuth, search);
router.get("/searchResult", isAuth, showData);

module.exports = router;
