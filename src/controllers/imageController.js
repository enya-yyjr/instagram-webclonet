const path = require("path");

const { bucket, storageBucket } = require("../firebase");

exports.uploadImage = async (file, userId) => {
  try {
    // 이미지 업로드
    const ext = path.extname(file.originalname);
    // const fname = path.basename(file.originalname, ext);
    const filename = `image_${Date.now()}${ext}`;
    await bucket
      .file(`images/${userId}/${filename}`)
      .createWriteStream()
      .end(file.buffer);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/images%2F${userId}%2F${filename}?alt=media`;
    return { filename, imageUrl };
  } catch (error) {
    const errors = new Error("Upload error");
    throw errors;
  }
};

exports.deleteImage = async (imageName, userId) => {
  try {
    await bucket.file(`images/${userId}/${imageName}`).delete();
  } catch (error) {
    const errors = new Error("Delete image error");
    throw errors;
  }
};

exports.uploadProfileImage = async (file, userId) => {
  try {
    const ext = path.extname(file.originalname);
    const filename = `profile_${userId}_${Date.now()}${ext}`;
    await bucket
      .file(`profile/${filename}`)
      .createWriteStream()
      .end(file.buffer);
    const profileImgUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/profile%2F${filename}?alt=media`;
    return { filename, profileImgUrl };
  } catch (error) {
    const errors = new Error("Profile image change error");
    throw errors;
  }
};

exports.deleteProfileImage = async (imageName) => {
  try {
    await bucket.file(`profile/${imageName}`).delete();
  } catch (error) {
    const errors = new Error("Delete profile image error");
    throw errors;
  }
};
