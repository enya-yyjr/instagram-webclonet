const path = require("path");

const { bucket, storageBucket } = require("../firebase");

exports.uploadImage = async (file, userId) => {
  try {
    // 이미지 업로드
    const ext = path.extname(file.originalname);
    const fname = path.basename(file.originalname, ext);
    const filename = `${userId}_${Date.now()}_${fname}${ext}`;
    await bucket
      .file(`images/${filename}`)
      .createWriteStream()
      .end(file.buffer);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/images%2F${filename}?alt=media`;
    return { filename, imageUrl };
  } catch (error) {
    const errors = new Error("Upload error");
    throw errors;
  }
};

exports.deleteImage = async (imageName) => {
  try {
    await bucket.file(`images/${imageName}`).delete();
  } catch (error) {
    const errors = new Error("Delete image error");
    throw errors;
  }
};
