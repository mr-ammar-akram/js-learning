const multer = require('multer');

// Multer storage configuration for disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Destination folder for uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);  // Unique filename
    }
});

// Multer upload instance with single file upload configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,  // 5MB file size limit
        files: 1  // Allow only one file
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp|svg/;  // Allowed file types
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(require('path').extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Please upload only image files (jpeg, jpg, png, gif, webp, svg).'));
        }
    }
});

module.exports = upload;