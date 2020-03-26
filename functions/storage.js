// var express = require("express");
// var router = express.Router();

// const admin = require("firebase-admin");
// const dateFormat = require("dateformat");
// const multer = require("multer");
// const stream = require("stream");

// var serviceAccount = require('../auth.json');

// const firebaseAdmin = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://fir-4-c4862.firebaseio.com",
//   storageBucket: "gs://fir-4-c4862.appspot.com"
// }, "storage");

// var upload = multer({ storage: multer.memoryStorage() });

// router.get("/upload", (req, res, next) => {
//   res.render("upload");
//   return;
// });

// router.post("/photo", upload.single("photo"), function(req, res, next) {
//   var image = req.file;
//   var bufferStream = new stream.PassThrough();
//   bufferStream.end(new Buffer.from(image.buffer, "ascii"));
//   var fileName = image.originalname;
//   let file = firebaseAdmin
//     .storage()
//     .bucket()
//     .file(fileName);
//   bufferStream
//     .pipe(file.createWriteStream({ metadata: { contentType: image.mimetype } }))
//     .on("error", eer => {
//       console.log(err);
//     })
//     .on("finish", () => {
//       console.log(fileName + " finish");
//       res.redirect("download?imgName=" + image.originalname);
//       return;
//     });
// });

// router.get("/download", function(req, res, next) {
//   var imgName = req.query.imgName;
//   var file = firebaseAdmin
//     .storage()
//     .bucket()
//     .file(imgName);
//   const config = { action: "read", expires: "03-17-2030" };
//   file.getSignedUrl(config, (err, url) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(url);
//     res.render("download", { image: url });
//     return;
//   });
// });

// module.exports = router;
