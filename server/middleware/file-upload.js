const multer = require('multer');
const uuid = require('uuid');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images')
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            console.log(ext)
            cb(null, uuid.v4() + '.' + ext)
        },
    }),
    fileFilter: (req, file, cb) => {
        const isVlaid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isVlaid ? null : new Error('Invalid mime type!')
        cb(error, isVlaid);
    },
});

module.exports = fileUpload;