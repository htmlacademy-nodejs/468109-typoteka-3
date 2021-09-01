'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const maxSize = 1000 * 1000 * 32;
const allowedMimeTypes = new Set([`image/png`, `image/jpg`, `image/jpeg`]);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: maxSize
  },
  fileFilter: (req, file, callback) => {

    if (!file) {
      return null;
    }

    if (allowedMimeTypes.has(file.mimetype)) {
      return callback(null, true);
    }

    return callback(new Error(`Allowed mimetypes is only "${[...allowedMimeTypes].toString()}"`));
  },
});

module.exports = upload;
