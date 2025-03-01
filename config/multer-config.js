const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory (Buffer)

const upload = multer({
    storage: storage // 5MB limit
});

module.exports = upload;