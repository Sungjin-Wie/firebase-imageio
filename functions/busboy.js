var express = require("express");
var router = express.Router();

const admin = require("firebase-admin");
const dateFormat = require("dateformat");
const path = require("path");
const os = require("os");
const fs = require("fs");
const Busboy = require("busboy");
const stream = require("stream");

var serviceAccount = require("./auth.json");

const firebaseAdmin = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-4-c4862.firebaseio.com",
    storageBucket: "gs://fir-4-c4862.appspot.com"
  },
  "storage"
);

router.get("/upload", (req, res, next) => {
  res.render("upload");
  console.log("upload page with busboy");
  return;
});

router.post("/photo", function(req, res, next) {
  const busboy = new Busboy({ headers: req.headers });

  let uploads = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(
      `File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`
    );
    const filepath = path.join(os.tmpdir(), filename);
    uploads[filename] = { file: filepath };
    console.log(`Saving '${filename}' to ${filepath}`);
    imageTobeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageTobeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageTobeUploaded.mimeType
          }
        }
      })
      .then(() => {
        return res.render("photo");
      })
      .catch(err => {
        console.error(err);
        return res.status(400).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
});

router.get("/download", function(req, res, next) {
  var imgName = req.query.imgName;
  var file = firebaseAdmin
    .storage()
    .bucket()
    .file(imgName);
  const config = { action: "read", expires: "03-17-2030" };
  file.getSignedUrl(config, (err, url) => {
    if (err) {
      console.log(err);
    }
    console.log(url);
    res.render("download", { image: url });
    return;
  });
});

module.exports = router;
