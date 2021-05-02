const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");

const storageBucket = "insta-clone-storage-763f2.appspot.com";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: storageBucket,
});

const bucket = admin.storage().bucket();

module.exports = { bucket, storageBucket };
