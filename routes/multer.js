const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads') // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const uniquename = uuidv4();
    cb(null, uniquename+path.extname(file.originalname)); // Use uuid to create a unique filename
  }
})

const upload = multer({ storage: storage })
module.exports = upload;