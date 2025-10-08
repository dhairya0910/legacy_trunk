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
const jwt = require("jsonwebtoken");
const { userInfo } = require("os");

const app = express();

// Set view engine to EJS and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Enable CORS for frontend interaction
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/legacy_trunk");

// Session and Passport initialization
app.use(
  session({ secret: "secret_key", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

// Google authentication route setup
const googleAuth = passport.authenticate("google", { failureRedirect: "/" });

// Authentication middleware using JWT stored in cookies
function isLoggedIn(req, res, next) {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.redirect("/signup");
    const userId = token;
    req.user = { _id: userId };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.redirect("/signup");
  }
}

// Helper function to generate unique Family ID
function generateFamilyId() {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `#${randomNumber}`;
}

// Google authentication route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google authentication callback and user processing
app.get("/auth/google/callback", googleAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Store user ID as token in cookie
    res.cookie("authToken", req.user._id, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Auto-join family if there's a pending invite for the user
    const pendingFamily = await Family.findOne({
      "invites.email": user.email,
      "invites.status": "pending",
    });
    if (pendingFamily) {
      const invite = pendingFamily.invites.find(
        (i) => i.email === user.email && i.status === "pending"
      );
      if (!pendingFamily.members.includes(user._id)) {
        pendingFamily.members.push(user._id);
        invite.status = "accepted";
        await pendingFamily.save();
        user.family_id = pendingFamily._id;
        await user.save();
      }
    }

    // Redirect user based on profile completion
    if (!user.username || !user.age)
      return res.redirect("http://localhost:3000/profile");
    if (!user.family_id)
      return res.redirect("http://localhost:3000/family-select");
    return res.redirect("http://localhost:3000/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Dashboard route that fetches user and family details
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
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Signup page rendering route
app.get("/signup", (req, res) => res.render("signup"));

// Profile completion route
app.post("/complete-profile", isLoggedIn, async (req, res) => {
  try {
    const { username, age } = req.body;
    const userId = req.user._id;

    if (!userId) return res.json({ route: "/family-select" });

    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      return res.json({
        error: "Username already taken, please choose another.",
      });
    }

    // Update user profile information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, age },
      { new: true }
    );
    if (!updatedUser) return res.json({ route: "/signup" });
    res.json({ route: "/family-select" });
  } catch (err) {
    console.error(err);
    res.json({ msg: "Error in connecting, we will get back to you." });
  }
});

// Join existing family page route
app.get("/join-family", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const families = await Family.find({}).populate("admin");
    res.render("joinFamily.ejs", {
      username: user.username,
      families,
      currentUserId: req.user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Create a new family route
app.get("/create-family", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const existingFamily = await Family.findOne({ admin: userId });
  if (existingFamily)
    return res.status(400).send("You are already an admin of another family.");

  const user = await User.findById(userId);
  const family_id = generateFamilyId();
  res.render("createFamily.ejs", { username: user.username, family_id });
});

// Handle new family creation
app.post("/create-family", isLoggedIn, async (req, res) => {
  try {
    const { family_id, family_name } = req.body;
    const userId = req.user._id;

    // Prevent duplicate family IDs
    const existingFamily = await Family.findOne({ family_id });
    if (existingFamily) return res.status(400).send("Family ID already taken.");

    // Save new family and assign to user
    const family = new Family({
      admin: userId,
      family_id,
      family_name,
      members: [userId],
    });

    await family.save();
    await User.findByIdAndUpdate(userId, { family_id: family._id });

    res.json({ route: "/dashboard" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating family.");
  }
});

app.post("/join-family/invite", isLoggedIn, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findById(req.user._id);
    const familyId = user.family_id;
    console.log(email);
    const family = await Family.findById(familyId);

    if (!family) return res.status(404).send("Family not found");
    if (family.admin.toString() !== req.user._id.toString())
      return res.status(403).send("Not authorized");

    // 1. Generate a unique token for the invitation link
    const token = crypto.randomBytes(20).toString("hex");

    // 2. Save the invite in family.invites
    family.invites.push({ email, token });
    await family.save();

    // 3. Send invitation email
    const inviteLink = `http://localhost:3128/join-family/${familyId}/invite/${token}`;
    await sendMail(
      email,
      "You're invited to join a family 🎉",
      `<p>Hi there,</p>
       <p>You have been invited to join the family <b>${family.family_name}</b>.</p>
       <p>Click <a href="${inviteLink}">here</a> to sign in and join automatically!</p>`
    );

    console.log("Invitation sent successfully!");
    res.json({ msg: "succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//Sending a joining request
// Send join request
app.post("/join-family/send-request", isLoggedIn, async (req, res) => {
  try {
    // Extract logged-in user ID
    const userId = req.user._id;
    console.log("User ID:", userId);

    // Extract family details from request
    const { family_id, family_username } = req.body;
    console.log("Family Request Body:", req.body);

    // Find admin user by email
    const admin = await User.findOne({ email: family_username });
    console.log("Admin Found:", admin ? admin.email : "Not Found");

    // Fetch logged-in user data
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User Data:", user.username);

    // Find target family using family ID or admin reference
    const family = await Family.findOne({
      $or: [
        { family_id: family_id?.trim() },
        { admin: admin?._id?.toString() },
      ],
    }).populate("admin");

    if (!family) {
      console.log("Family not found");
      return res.status(404).json({ message: "Family not found" });
    }
    console.log("Family Found:", family.family_name);

    // Prevent duplicate membership
    console.log("Current Family Members:", family.members);
    if (family.members.some((m) => m.toString() === userId.toString())) {
      console.log("User already a member of this family");
      return res.status(400).json({ message: "You are already a member" });
    }

    // Prevent duplicate pending requests
    const existingRequest = family.joinRequests.find(
      (r) => r.userId.toString() === userId.toString() && r.status === "pending"
    );
    if (existingRequest) {
      console.log("Pending join request already exists");
      return res
        .status(400)
        .json({ message: "You already have a pending request" });
    }

    // Add new join request
    family.joinRequests.push({ userId, status: "pending" });
    await family.save();
    console.log("Join request added successfully");

    // Send email to admin notifying new request
    try {
      await sendMail(
        family.admin.email,
        "New Family Join Request 🚀",
        `
          <p>Hi ${family.admin.username},</p>
          <p><b>${user.username}</b> has requested to join your family <b>${family.family_name}</b>.</p>
          <p>Visit your dashboard to review the request.</p>
        `
      );
      console.log("Email sent successfully to admin");
    } catch (emailErr) {
      console.log("Email sending failed:", emailErr.message);
    }

    // Successful response
    console.log("Join request process completed successfully");
    return res.status(200).json({ message: "Join request sent successfully" });
  } catch (err) {
    console.log("Server error during join request:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

//SHow requests
app.post("/join-family/requests", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const familyId = user.family_id;
    // Find family by _id
    const family = await Family.findById(familyId);
    if (!family) return res.status(404).send("Family not found");
    // Only admin can view requests
    if (family.admin.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized");
    }

    // Get pending requests
    const pendingRequests = await Promise.all(
      family.joinRequests
        .filter((r) => r.status === "pending")
        .map(async (reqObj) => {
          const reqUser = await User.findById(reqObj.userId);
          return {
            name: reqUser?.name || "Unknown",
            createdAt: reqObj.createdAt,
            userId: reqObj.userId,
            familyId: family._id,
          };
        })
    );

    res.json({ family, pendingRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Approve or reject
app.post(
  "/join-family/requests/:familyId/:requestId/approve",
  isLoggedIn,
  async (req, res) => {
    try {
      const { familyId, requestId } = req.params;
      console.log("Approve Params:", req.params);

      // 1. Find the family
      const family = await Family.findById(familyId);
      if (!family) return res.status(404).send("Family not found");

      // 2. Check admin authorization
      if (family.admin.toString() !== req.user._id.toString()) {
        return res.status(403).send("Not authorized");
      }

      // 3. Find the specific request
      const request = family.joinRequests.find(
        (r) => r.userId.toString() === requestId.toString()
      );

      if (!request) return res.status(404).send("Request not found");

      // 4. Fetch the user who sent the request
      const user = await User.findById(request.userId);
      if (!user) return res.status(404).send("Requesting user not found");
      // 5. Approve the request
      request.status = "approved";
      family.members.push(request.userId);
      await family.save();

      // 6. Update user's family_id in User collection
      await User.findByIdAndUpdate(request.userId, { family_id: family._id });

      // 7. Send email to the requesting user
      await sendMail(
        user.email,
        "Your Family Request was Accepted 🎉",
        `<p>Hi ${user.name || "there"},</p>
       <p>Your request to join the family <b>${
         family.family_name
       }</b> has been accepted!</p>
       <p>Welcome to the family 💫</p>`
      );

      res.redirect(`/join-family/${family._id}/requests`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// Reject a family join request
app.post(
  "/join-family/requests/:familyId/:requestId/reject",
  isLoggedIn,
  async (req, res) => {
    try {
      const { familyId, requestId } = req.params;
      console.log("Reject Params:", req.params);

      // 1. Find the family
      const family = await Family.findById(familyId);
      if (!family) return res.status(404).json({ message: "Family not found" });

      // 2. Check admin authorization
      if (family.admin.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // 3. Find the join request by userId
      const request = family.joinRequests.find(
        (r) => r.userId.toString() === requestId.toString()
      );
      if (!request)
        return res.status(404).json({ message: "Request not found" });

      // 4. Fetch the user who sent the request
      const user = await User.findById(request.userId);
      if (!user)
        return res.status(404).json({ message: "Requesting user not found" });

      // 5. Reject the request
      request.status = "rejected";
      await family.save();

      // 6. Send rejection email to the requesting user
      await sendMail(
        user.email,
        "Your Family Join Request Was Rejected ❌",
        `<p>Hi ${user.name || "there"},</p>
       <p>We're sorry to inform you that your request to join the family 
       <b>${family.family_name}</b> was <b>rejected</b>.</p>
       <p>You may reach out to the family admin for more details.</p>`
      );

      // 7. Redirect or send success response
      res.redirect(`/join-family/${family._id}/requests`);
    } catch (err) {
      console.error("Reject request error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Logout route to destroy session and clear cookies
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.clearCookie("connect.sid");
    res.redirect("/signup");
  });
});

//Resctrucuture code from here

//Inviting a member to a family

app.get("/join-family/:familyId/invite", isLoggedIn, async (req, res) => {
  const family = await Family.findById(req.params.familyId);
  if (!family) return res.status(404).send("Family not found");

  // Only admin can see this page
  if (family.admin.toString() !== req.user._id.toString())
    return res.status(403).send("Not authorized");

  res.render("invite", { family });
});

//Handling signup and auto joinig family

app.post("/join-family/:familyId/invite/complete-signup", async (req, res) => {
  try {
    const { token, username, email, password } = req.body;

    // 1. Find the family invite
    const family = await Family.findOne({ "invites.token": token });
    if (!family) return res.status(404).send("Invalid invite");

    const invite = family.invites.find((i) => i.token === token);
    if (invite.status !== "pending") return res.send("Invite already used");

    // 2. Create the user if not exists
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username,
        email,
        password,
        family_id: family._id,
      });
    } else {
      // If user exists, just update family_id
      user.family_id = family._id;
      await user.save();
    }

    // 3. Add user to family members
    family.members.push(user._id);
    invite.status = "accepted";
    await family.save();

    // 4. Auto-login the user (optional)
    req.login(user, (err) => {
      if (err) throw err;
      res.redirect("/"); // redirect after login
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//fetching the family members
app.post("/family/members", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const family = await Family.findById(user.family_id);
  try {
    const members = await User.find(
      { _id: { $in: family.members } }, // match all IDs in array
      { name: 1 } // project only the name field
    );
    const result = members.map((member) => ({
      id: member._id.toString(), // convert ObjectId to string
      name: member.name,
    }));

    res.json({ members: result });
  } catch (error) {
    res.json({ members: [] });
  }
});

// Start server on port 3128
app.listen(3128, () => console.log("Server running on http://localhost:3128"));
