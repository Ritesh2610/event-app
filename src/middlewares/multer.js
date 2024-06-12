const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage:storage, limits: { fileSize: 18 * 1024 * 1024 }}); // 10 MB

module.exports = upload.fields([
  { name: 'images', maxCount: 24 },
  { name: 'selfie', maxCount: 1 }
]);