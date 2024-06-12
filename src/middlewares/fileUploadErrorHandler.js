// Middleware to handle file size limit errors
function fileUploadErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File size limit exceeded. Maximum size allowed is 10 MB.' });
    }
    // Handle other potential errors
    next(err);
}

