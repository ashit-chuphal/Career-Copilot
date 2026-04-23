import multer from "multer";
import fs from "fs";

const dir = "uploads";

if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, dir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export default multer({ storage });