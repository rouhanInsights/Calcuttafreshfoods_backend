const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");

dotenv.config();

const s3 = new S3Client({
  region: "ap-south-1", // ⚠️ make sure this is correct for your bucket
  endpoint: process.env.AWS_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  forcePathStyle: true,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const filename = `profile-images/${Date.now()}_${file.originalname}`;
      cb(null, filename);
    },
  }),
});

const uploadProfileImage = (req, res) => {
  if (!req.file || !req.file.location) {
    return res.status(400).json({ error: "File upload failed" });
  }

  res.json({ imageUrl: req.file.location });
};

module.exports = { upload, uploadProfileImage };
