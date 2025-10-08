const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./config/passport");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/userModel");
const Family = require("./models/familyModel");
const sendMail = require("./config/mailer");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/MessageModel");

const app = express();
const server = http.createServer(app);

// Initialize socket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// App configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/legacy_trunk");

// Initialize session and passport
app.use(session({ secret: "secret_key", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Google authentication route
const googleAuth = passport.authenticate("google", { failureRedirect: "/" });

// JWT authentication middleware
function isLoggedIn(req, res, next) {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.redirect("/signup");
    req.user = { _id: token };
    next();
  } catch {
    return res.redirect("/signup");
  }
}

// Generate unique family ID
function generateFamilyId() {
  return `#${Math.floor(10000 + Math.random() * 90000)}`;
}

// Google login routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", googleAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Set authentication cookie
    res.cookie("authToken", userId, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Auto join pending invited family
    const pendingFamily = await Family.findOne({
      "invites.email": user.email,
      "invites.status": "pending",
    });

    if (pendingFamily) {
      const invite = pendingFamily.invites.find(i => i.email === user.email);
      if (!pendingFamily.members.includes(user._id)) {
        pendingFamily.members.push(user._id);
        invite.status = "accepted";
        await pendingFamily.save();
        user.family_id = pendingFamily._id;
        await user.save();
      }
    }

    // Redirect user based on profile
    if (!user.username || !user.age) return res.redirect("http://localhost:3000/profile");
    if (!user.family_id) return res.redirect("http://localhost:3000/family-select");
    return res.redirect("http://localhost:3000/dashboard");
  } catch {
    res.status(500).send("Server error");
  }
});

// Dashboard route
app.post("/", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const adminFamilies = await Family.find({ admin: req.user._id });
    const family = await Family.findById(user.family_id);
    res.json({
      username: user.username,
      isAdmin: adminFamilies.length > 0,
      adminFamilies,
      family_name: family ? family.family_name : "",
      _id: user._id,
    });
  } catch {
    res.status(500).send("Server error");
  }
});

// Signup route
app.get("/signup", (req, res) => res.render("signup"));

// Complete profile route
app.post("/complete-profile", isLoggedIn, async (req, res) => {
  try {
    const { username, age } = req.body;
    const userId = req.user._id;
    if (!userId) return res.json({ route: "/family-select" });

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId.toString())
      return res.json({ error: "Username already taken." });

    const updatedUser = await User.findByIdAndUpdate(userId, { username, age }, { new: true });
    if (!updatedUser) return res.json({ route: "/signup" });
    res.json({ route: "/family-select" });
  } catch {
    res.json({ msg: "Profile update error." });
  }
});

// Join family route
app.get("/join-family", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const families = await Family.find({}).populate("admin");
    res.render("joinFamily.ejs", { username: user.username, families, currentUserId: req.user._id });
  } catch {
    res.status(500).send("Server error");
  }
});

// Create family route
app.get("/create-family", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const existingFamily = await Family.findOne({ admin: userId });
  if (existingFamily) return res.status(400).send("Already an admin of another family.");
  const user = await User.findById(userId);
  res.render("createFamily.ejs", { username: user.username, family_id: generateFamilyId() });
});

// Handle family creation
app.post("/create-family", isLoggedIn, async (req, res) => {
  try {
    const { family_id, family_name } = req.body;
    const userId = req.user._id;

    const existingFamily = await Family.findOne({ family_id });
    if (existingFamily) return res.status(400).send("Family ID already taken.");

    const family = new Family({
      admin: userId,
      family_id,
      family_name,
      members: [userId],
    });

    await family.save();
    await User.findByIdAndUpdate(userId, { family_id: family._id });
    res.json({ route: "/dashboard" });
  } catch {
    res.status(500).send("Error creating family.");
  }
});

// Invite a member via email
app.post("/join-family/invite", isLoggedIn, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findById(req.user._id);
    const family = await Family.findById(user.family_id);
    if (!family) return res.status(404).send("Family not found");
    if (family.admin.toString() !== req.user._id.toString()) return res.status(403).send("Not authorized");

    const token = crypto.randomBytes(20).toString("hex");
    family.invites.push({ email, token });
    await family.save();

    const inviteLink = `http://localhost:3128/join-family/${family._id}/invite/${token}`;
    await sendMail(email, "Family Invitation", `Join ${family.family_name} <a href="${inviteLink}">here</a>`);
    res.json({ msg: "Invitation sent successfully" });
  } catch {
    res.status(500).send("Server error");
  }
});

// Send join request
app.post("/join-family/send-request", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const { family_id, family_username } = req.body;
    const admin = await User.findOne({ email: family_username });
    const user = await User.findById(userId);

    const family = await Family.findOne({
      $or: [{ family_id: family_id?.trim() }, { admin: admin?._id?.toString() }],
    }).populate("admin");

    if (!family) return res.status(404).json({ message: "Family not found" });
    if (family.members.some(m => m.toString() === userId.toString()))
      return res.status(400).json({ message: "Already a member" });

    const existingRequest = family.joinRequests.find(
      r => r.userId.toString() === userId.toString() && r.status === "pending"
    );
    if (existingRequest)
      return res.status(400).json({ message: "Pending request already exists" });

    family.joinRequests.push({ userId, status: "pending" });
    await family.save();

    await sendMail(
      family.admin.email,
      "New Family Join Request",
      `${user.username} requested to join ${family.family_name}`
    );

    res.status(200).json({ message: "Join request sent successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Get family members
app.post("/family/members", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const family = await Family.findById(user.family_id);
    const members = await User.find({ _id: { $in: family.members } }, { name: 1 });
    const result = members.map(m => ({ id: m._id.toString(), name: m.name }));
    res.json({ members: result });
  } catch {
    res.json({ members: [] });
  }
});

// Socket connection
io.on("connection", socket => {
  console.log("User connected", socket.id);

  socket.on("join", userId => socket.join(userId));

  socket.on("send_message", async ({ sender, receiver, text, time }) => {
    const message = await Message.create({ sender, receiver, text, createdAt: time });
    io.to(receiver).emit("receive_message", message);
    io.to(sender).emit("receive_message", message);
  });

  socket.on("disconnect", () => console.log("User disconnected", socket.id));
});

// Get chat messages between two users
app.post("/messages", isLoggedIn, async (req, res) => {
  const { sender, receiver } = req.body;
  const messages = await Message.find({
    $or: [{ sender, receiver }, { sender: receiver, receiver: sender }],
  }).sort({ createdAt: 1 });
  res.json({ messages });
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/signup");
  });
});

// Start server
const PORT = process.env.PORT || 3128;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
