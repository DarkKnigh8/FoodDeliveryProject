const multer = require('multer');
const path = require('path');
const fs = require('fs');

const makeStorage = (subfolder) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../public/uploads', subfolder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

exports.restaurantImageUpload = multer({ storage: makeStorage('restaurants') });
exports.menuImageUpload = multer({ storage: makeStorage('menu') });
