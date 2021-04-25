const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const fs = require("fs");
const router = require("express").Router();

/***
 * this definition of the path to upload images
 */
const filePath = "upload";
if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath);
}

/***
 * this definition the path end name of the uploaded file
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${new Date().toISOString().replace(/:/g, "-")}-${originalname}`);
  },
});

/***
 * this definition the kind of file what can be uploaded
 */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/***
 * this definitions the function what we use the path to upload end the size of the file end the filter of the file types
 */
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

/***
 * this definitions if the upload request has been one file (to definitions use "file") or the upload request has been array of files (to definitions use "array")
 */
const type = upload.single("one-file");

/***
 * this route is to upload new file
 */
router.post("/new-file", authMiddleware, type, (req, res) => {
  try {
    if (req.file) {
      return res.json({ status: "you or good", path: req.file.path });
    }
    return res.status(400).send(`error file is = ${req.file}`);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
