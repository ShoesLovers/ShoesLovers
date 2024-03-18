import express from 'express';
const router = express.Router();
import multer from 'multer';

// const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
let base: string;
if (process.env.NODE_ENV.trim() === 'development') {
  base = 'http://localhost:3000/';
} else {
  base = 'https://node29.cs.colman.ac.il/';
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').filter(Boolean).slice(1).join('.');
    cb(null, Date.now() + '.' + ext);
  },
});
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), function (req, res) {
  console.log('router.post(/file: ' + base + req.file.path);
  res.status(200).send({ url: base + req.file.path });
});
export = router;
