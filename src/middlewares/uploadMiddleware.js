const multer = require("multer");

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

exports.upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});
