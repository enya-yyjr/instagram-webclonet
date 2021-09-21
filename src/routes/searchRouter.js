const express = require("express");

const { isAuth } = require("../middlewares/authMiddleware");
const { search } = require("../controllers/searchController");

const router = express.Router();

router.get("/search", isAuth, search);

module.exports = router;
