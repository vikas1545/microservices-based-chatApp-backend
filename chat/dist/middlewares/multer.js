import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "chat-images",
        allowed_formats: ["jpeg", "jpg", "png", "gif", "webp"],
        transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quility: "auto" },
        ],
    },
});
export const upload = multer({
    storage,
    limits: {
        fieldSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("/image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("only image allowed "));
        }
    },
});
