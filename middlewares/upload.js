import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowed.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Format non supporté. Utilisez jpeg, jpg, png ou webp'), false);
    }
};

export const upload = multer({ storage: storage , fileFilter: fileFilter, limits: { fileSize: 5 * 1024 * 1024 }});