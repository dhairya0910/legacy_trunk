import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {HttpsProxyAgent} from 'https-proxy-agent';

const proxyAgent = new HttpsProxyAgent('http://edcguest:edcguest@172.31.100.25:3126');


cloudinary.config({
  cloud_name:"daoen1kny",
  api_key: "668582844597566",
  api_secret: "SECRET_Key"
});

// Multer-Cloudinary storage with proper video support
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi", "mkv", "webm"],
    resource_type: "auto", // This is crucial for handling both images and videos
  },
});



export { cloudinary, storage };
