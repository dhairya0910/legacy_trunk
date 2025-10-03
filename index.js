import express from "express";
import path from "path";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";

const app = express();
const __dirname = path.resolve();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'media-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/legacy_trunk")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Schemas
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const itemSchema = new mongoose.Schema({
  text: { type: String },
  media: { type: String },
  mediaType: { type: String },
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema]
});

const Item = mongoose.model("Item", itemSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.render("index", { items });
  } catch (err) {
    console.error(err);
    res.render("index", { items: [] });
  }
});

// CREATE post
app.post("/add-media", upload.single("file"), async (req, res) => {
  try {
    const text = req.body.item || "";
    let mediaUrl = "";
    let mediaType = "";

    if (req.file) {
      console.log("File saved:", req.file.filename);
      mediaUrl = `/uploads/${req.file.filename}`;
      mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    if (!text && !mediaUrl) {
      return res.redirect("/");
    }

    const newItem = new Item({ text, media: mediaUrl, mediaType });
    await newItem.save();
    console.log("Post saved successfully");
    res.redirect("/");

  } catch (err) {
    console.error("Upload error:", err);
    res.redirect("/");
  }
});

// UPDATE post
app.post("/edit/:id", async (req, res) => {
  try {
    const { newText } = req.body;
    if (!newText) return res.redirect("/");
    await Item.findByIdAndUpdate(req.params.id, { text: newText });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// DELETE post
app.post("/delete/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item && item.media) {
      // Delete the file from local storage
      const filePath = path.join(__dirname, 'public', item.media);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// ADD comment
app.post("/comment/:id", async (req, res) => {
  try {
    const { commentText } = req.body;
    if (!commentText) return res.redirect("/");
    
    await Item.findByIdAndUpdate(req.params.id, {
      $push: { comments: { text: commentText } }
    });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// DELETE comment
app.post("/delete-comment/:itemId/:commentId", async (req, res) => {
  try {
    const { itemId, commentId } = req.params;
    await Item.findByIdAndUpdate(itemId, {
      $pull: { comments: { _id: commentId } }
    });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));