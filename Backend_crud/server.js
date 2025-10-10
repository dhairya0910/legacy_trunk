const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const PDFDocument = require("pdfkit"); 

const app = express();

// Create uploads directories if they don't exisy
const uploadsDir = path.join(__dirname, "public", "uploads");
const storiesDir = path.join(__dirname, "public", "stories");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(storiesDir)) fs.mkdirSync(storiesDir, { recursive: true });

// Multer configuration for posts
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(
      null,
      `media-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    ),
});
const uploadPost = multer({
  storage: postStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Multer configuration for stories
const storyStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storiesDir),
  filename: (req, file, cb) =>
    cb(
      null,
      `story-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    ),
});
const uploadStory = multer({
  storage: storyStorage,
  limits: { fileSize: 30 * 1024 * 1024 },
});

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/legacy_trunk")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Schemas
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const itemSchema = new mongoose.Schema({
  text: String,
  media: [
    {
      url: { type: String, required: true },
      type: { type: String, required: true }, // 'image' or 'video'
    },
  ],
  tags: [String],
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

const storySchema = new mongoose.Schema({
  media: { type: String, required: true },
  mediaType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 },
  views: [{ type: Date }],
});

const tagSchema = new mongoose.Schema({ name: String });

const Item = mongoose.model("Item", itemSchema);
const Story = mongoose.model("Story", storySchema);
const Tag = mongoose.model("Tag", tagSchema);

// ROUTES

app.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    const tags = await Tag.find();
    const stories = await Story.find().sort({ createdAt: -1 });
    res.render("index", { items, tags, stories });
  } catch (err) {
    console.error(err);
    res.render("index", { items: [], tags: [], stories: [] });
  }
});

// Add post
app.post("/add-media",isLoggedIn, uploadPost.array("files", 10), async (req, res) => {
  try {
    const text = req.body.item || "";
    const mediaFiles = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith("video/") ? "video" : "image",
    }));

    // Tags
    let tagsArr = [];
    if (req.body.tags)
      tagsArr = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
    if (req.body.tags_input) {
      const inputTags = req.body.tags_input
        .split(" ")
        .map((t) => t.replace("#", ""));
      tagsArr.push(...inputTags);
    }

    // Save unique tags in DB
    for (const tagName of tagsArr) {
      if (!(await Tag.findOne({ name: tagName })))
        await Tag.create({ name: tagName });
    }

    const newItem = new Item({
      text,
      media: mediaFiles,
      tags,
    });

    await newItem.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Add story
app.post("/add-story", uploadStory.single("storyFile"), async (req, res) => {
  try {
    if (!req.file) return res.redirect("/");
    const mediaType = req.file.mimetype.startsWith("video/")
      ? "video"
      : "image";
    await Story.create({ media: `/stories/${req.file.filename}`, mediaType });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// View story
app.get("/story/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.redirect("/");
    story.views.push(new Date());
    await story.save();
    res.render("story", { story });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Share
app.post("/share/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.json({ success: false });
    item.shares += 1;
    await item.save();
    res.json({ success: true, shares: item.shares });
  } catch {
    res.json({ success: false });
  }
});

// Edit
app.post("/edit/:id", async (req, res) => {
  try {
    const { newText } = req.body;
    if (!newText) return res.redirect("/");
    await Item.findByIdAndUpdate(req.params.id, { text: newText });
    res.redirect("/");
  } catch {
    res.redirect("/");
  }
});

// Delete post
app.post("/delete/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      item.media.forEach((file) => {
        const filePath = path.join(__dirname, "public", file.url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch {
    res.redirect("/");
  }
});

// Add comment
app.post("/comment/:id", async (req, res) => {
  try {
    const { commentText } = req.body;
    if (!commentText) return res.redirect("/");
    await Item.findByIdAndUpdate(req.params.id, {
      $push: { comments: { text: commentText } },
    });
    res.redirect("/");
  } catch {
    res.redirect("/");
  }
});

// Delete comment
app.post("/delete-comment/:itemId/:commentId", async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.itemId, {
      $pull: { comments: { _id: req.params.commentId } },
    });
    res.redirect("/");
  } catch {
    res.redirect("/");
  }
});

// Like
app.post("/like/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.json({ likes: 0 });
    item.likes += 1;
    await item.save();
    res.json({ likes: item.likes });
  } catch {
    res.json({ likes: 0 });
  }
});

// Search
app.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    const regex = new RegExp(q, "i");
    const items = await Item.find({
      $or: [{ text: regex }, { tags: regex }],
    }).sort({ createdAt: -1 });
    const tags = await Tag.find();
    const stories = await Story.find().sort({ createdAt: -1 });
    res.render("index", { items, tags, stories });
  } catch {
    res.render("index", { items: [], tags: [], stories: [] });
  }
});

// -------------------- NEW: Download PDF route --------------------
app.get("/download-pdf", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="SocialFeed_Posts.pdf"'
    );

    const doc = new PDFDocument({ autoFirstPage: false, margin: 50 });
    doc.pipe(res);

    const ensureSpace = (height = 0) => {
      const bottom = doc.page.height - doc.page.margins.bottom;
      if (doc.y + height > bottom) doc.addPage();
    };

    doc.addPage();
    doc.fontSize(24).font("Helvetica-Bold").text("Social Feed - All Posts", {
      align: "center",
    });
    doc.moveDown(1);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Export date: ${new Date().toLocaleString()}`, { align: "center" });
    doc.moveDown(2);

    for (const [index, item] of items.entries()) {
      if (index !== 0) doc.addPage();

      doc.fontSize(14).font("Helvetica-Bold").text(`Post ${index + 1}`, {
        continued: true,
      });
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("gray")
        .text(`  •  ${new Date(item.createdAt).toLocaleString()}`);
      doc.moveDown(0.5);

      if (item.text) {
        ensureSpace(60);
        doc.fontSize(12).font("Helvetica").fillColor("black");
        const textOptions = {
          width:
            doc.page.width - doc.page.margins.left - doc.page.margins.right,
        };
        doc.text(item.text, textOptions);
        doc.moveDown();
      }

      if (item.tags && item.tags.length > 0) {
        ensureSpace(20);
        doc
          .fontSize(10)
          .font("Helvetica-Oblique")
          .fillColor("black")
          .text(`Tags: ${item.tags.map((t) => "#" + t).join(" ")}`);
        doc.moveDown();
      }

      if (item.media && item.media.length > 0) {
        for (const media of item.media) {
          const filePath = path.join(__dirname, "public", media.url);

          if (media.type === "image") {
            if (fs.existsSync(filePath)) {
              ensureSpace(10);
              try {
                doc.image(filePath, {
                  fit: [doc.page.width - 100, 350],
                  align: "center",
                  valign: "center",
                });
              } catch (err) {
                doc
                  .fontSize(10)
                  .fillColor("red")
                  .text(`[Failed to embed image: ${media.url}]`);
              }
              doc.moveDown();
            } else {
              doc
                .fontSize(10)
                .fillColor("red")
                .text(`[Image not found: ${media.url}]`);
              doc.moveDown();
            }
          } else if (media.type === "video") {
            const ext = path.extname(filePath);
            const thumbPath = filePath.replace(new RegExp(`${ext}$`), ".jpg");

            if (fs.existsSync(thumbPath)) {
              ensureSpace(10);
              try {
                doc.image(thumbPath, { fit: [300, 200], align: "left" });
              } catch (err) {
                doc
                  .fontSize(10)
                  .fillColor("red")
                  .text(`[Failed to embed thumbnail: ${thumbPath}]`);
              }
            } else {
              doc
                .fontSize(10)
                .fillColor("gray")
                .text(`[Video thumbnail not found; will include link]`);
            }

            doc.moveDown(0.5);
            const videoUrl = `${req.protocol}://${req.get("host")}${media.url}`;
            doc
              .fillColor("blue")
              .fontSize(12)
              .text("▶ Watch Video", { link: videoUrl, underline: true });
            doc.fillColor("black");
            doc.moveDown();
          }
        }
      }

      ensureSpace(30);
      doc
        .fontSize(10)
        .fillColor("gray")
        .text(
          `Likes: ${item.likes || 0}   •   Shares: ${item.shares || 0}   •   Comments: ${
            item.comments ? item.comments.length : 0
          }`
        );

      doc.moveDown(1);
      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .strokeColor("#cccccc")
        .stroke();
      doc.moveDown();
    }

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Error generating PDF");
  }
});
// ---------------------------------------------------------------

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
