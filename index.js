import express from "express";
import path from "path";
import mongoose from "mongoose";

const app = express();
const __dirname = path.resolve();

// --- MongoDB Connection ---
mongoose.connect("mongodb://127.0.0.1:27017/crud-demo", {
  
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// --- Middleware ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Mongoose Schema and Model ---
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
const Item = mongoose.model("Item", itemSchema);

// --- Routes ---

// READ: show all items
app.get("/", async (req, res) => {
  const items = await Item.find();
  res.render("index", { items });
});

// CREATE: add a new item
app.post("/add", async (req, res) => {
  if (req.body.item) {
    const newItem = new Item({ name: req.body.item });
    await newItem.save();
  }
  res.redirect("/");
});

// UPDATE: edit an item
app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  if (req.body.newValue) {
    await Item.findByIdAndUpdate(id, { name: req.body.newValue });
  }
  res.redirect("/");
});

// DELETE: remove an item
app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Item.findByIdAndDelete(id);
  res.redirect("/");
});

// --- Start Server ---
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
