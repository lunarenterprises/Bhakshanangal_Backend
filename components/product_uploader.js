const { log } = require('console');
const multer = require('multer');
const fs=require("fs")
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // cb(null, path.join(__dirname, './uploads') + "/")
      
     let filep= process.cwd() +`/uploads/product/`
      fs.mkdirSync(filep, { recursive: true })
      cb(null, filep)
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
  });
  
  
  module.exports.upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/svg+xml") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  });