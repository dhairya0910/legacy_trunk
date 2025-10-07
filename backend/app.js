const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./config/passport");
const mongoose = require("mongoose");
const path= require ('path')
const User=require('./models/userModel')
const Family=require('./models/familyModel')
const sendMail = require("./config/mailer");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();


//middlewares
app.set('view engine','ejs')
app.set('views',path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true}));
mongoose.connect("mongodb://127.0.0.1:27017/legacy_trunk");
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  credentials: true, // allow session cookie from browser to pass through
}));

app.use(session({
  secret: "secret_key",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//Middlewares
const googleAuth = passport.authenticate("google", { failureRedirect: "/" });
//Logged in middleware
function isLoggedIn(req, res, next) {
 try {
    // Extract JWT from cookies
    const token = req.cookies?.authToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
   
    req.user._id = token;

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
}
//Function for generating random family_id
function generateFamilyId() {
  // Generate a random number between 10000 and 99999
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `#${randomNumber}`;
}

// Routes
//AUTHORIZATION ROUTES:~
// Google
// Google callback route
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));
app.get(
  "/auth/google/callback",
  googleAuth,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      res.cookie("authToken", req.user._id, {
    httpOnly: true, // cannot be accessed by JS
    secure: false, // true if using HTTPS
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

      // 1️⃣ Check for pending invite matching user's Google email
      const pendingFamily = await Family.findOne({
        "invites.email": user.email,
        "invites.status": "pending"
      });

      if (pendingFamily) {
        const invite = pendingFamily.invites.find(
          i => i.email === user.email && i.status === "pending"
        );

        // Add user to family if not already a member
        if (!pendingFamily.members.includes(user._id)) {
          pendingFamily.members.push(user._id);
          invite.status = "accepted";
          await pendingFamily.save();

          // Update user's family_id
          user.family_id = pendingFamily._id;
          await user.save();
        }
      }

      // 2️⃣ Continue your existing redirect logic
      if (!user.username || !user.age) {
        return res.redirect("http://localhost:3000/profile");
      } else if (!user.family_id) {
        return res.redirect('http://localhost:3000/family-select');
      } else {
        return res.redirect('http://localhost:3000/dashboard');
      }

    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);








app.post("/", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;

    const adminFamilies = await Family.find({ admin: userId });

    const isAdmin = adminFamilies.length > 0;

    res.json({
      username: req.user.username,
      isAdmin,
      adminFamilies 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


app.get('/signup',(req,res)=>{
    res.render("signup")
})

// app.get ('/complete-profile',isLoggedIn,(req,res)=>{
//   res.render('completeProfile.ejs');
// })

app.post('/complete-profile', isLoggedIn, async (req, res) => {
  try {

    const { username, age } = req.body;
    const userId = req.user._id;

    // 1. Check if the user exists
    if (!userId) {
      // return res.redirect('http://localhost:3000/family-select');
      return res.json({"route":'/family-select'});
    }

    // 2. Check if username is already taken by another user
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      // If username is used by someone else, show alert
      
      return res.json({ 
        error: "Username already taken, please choose another." 
      });
    }

    // 3. Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, age },
      { new: true } // return updated document
    );

    if (!updatedUser) {
      return res.json({"route":'/signup'});
      // return res.redirect('http://localhost:3000');
    }

    res.json({"route":'/family-select'});
  } catch (err) {
    console.error(err);
    res.json({"msg":'Error in connecting, we will get back to you.'});
  }
});




app.get('/join-family', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const families = await Family.find({}).populate("admin");

    const user = await User.findById(userId);
    const username = user ? user.username : "";

    res.render('joinFamily.ejs', {
      username,
      families,
      currentUserId: userId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


//Sending a joining request
// Send join request
app.post("/join-family/:id/send-request", async (req, res) => {
  try {
    const userId = req.user._id;
    const familyId = req.params.id; // this is the MongoDB ObjectId

    // Find family by MongoDB _id
    const family = await Family.findById(familyId).populate("admin");
    const user=await User.findById(userId);
    if (!family || !user) {
      return res.status(404).send("Family or user not found");
    }
    // Already a member?
    if (family.members.some(m => m.toString() === userId.toString())) {
      return res.status(400).send("You are already a member");
    }

    // Already requested?
    if (family.joinRequests.some(r => r.userId.toString() === userId.toString() && r.status === "pending")) {
      return res.status(400).send("You already have a pending request");
    }

    // Add request
    family.joinRequests.push({ userId });
    await family.save();
    //Sending mail to admin
   try {
  await sendMail(
    family.admin.email,
    "New Family Join Request Received 🚀",
    `
      <p>Hi ${family.admin.username},</p>
      <p><b>${user.username}</b> has requested to join your family <b>${family.family_name}</b>.</p>
      <p>Login to your dashboard to <a href="localhost:3128/join-family/${familyId}/requests">approve or reject</a> the request.</p>
    `
  );
  console.log("📧 Email function executed successfully");
} catch (emailErr) {
  console.error("❌ Email sending failed:", emailErr);
}

    res.redirect("/join-family");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//Inviting a member to a family

app.get("/join-family/:familyId/invite", isLoggedIn, async (req, res) => {
  const family = await Family.findById(req.params.familyId);
  if (!family) return res.status(404).send("Family not found");

  // Only admin can see this page
  if (family.admin.toString() !== req.user._id.toString())
    return res.status(403).send("Not authorized");

  res.render("invite", { family });
});


app.get("/join-family/:familyId/invite/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Find the family invite with this token
    const family = await Family.findOne({ "invites.token": token });
    if (!family) return res.status(404).send("Invalid or expired invite");

    const invite = family.invites.find(i => i.token === token);
    if (invite.status !== "pending") return res.send("Invite already used");

    // 2. Render a signup/signin page with token hidden
    res.render("signup", { token, familyName: family.family_name });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


app.post("/join-family/:familyId/invite", isLoggedIn, async (req, res) => {
  try {
    const { email } = req.body;
    const { familyId } = req.params;

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

    res.send("Invitation sent successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});



//Handling signup and auto joinig family

app.post("/join-family/:familyId/invite/complete-signup", async (req, res) => {
  try {
    const { token, username, email, password } = req.body;

    // 1. Find the family invite
    const family = await Family.findOne({ "invites.token": token });
    if (!family) return res.status(404).send("Invalid invite");

    const invite = family.invites.find(i => i.token === token);
    if (invite.status !== "pending") return res.send("Invite already used");

    // 2. Create the user if not exists
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ username, email, password, family_id: family._id });
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
    req.login(user, err => {
      if (err) throw err;
      res.redirect("/"); // redirect after login
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});





//SHow requests
app.get("/join-family/:familyId/requests", isLoggedIn, async (req, res) => {
  try {
    const familyId = req.params.familyId;

    // Find family by _id
    const family = await Family.findById(familyId).populate("joinRequests.userId");
    if (!family) return res.status(404).send("Family not found");

    // Only admin can view requests
    if (family.admin.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized");
    }

    // Get pending requests
    const pendingRequests = family.joinRequests.filter(r => r.status === "pending");

    res.render("showRequests.ejs", { family, pendingRequests });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// Approve or reject
app.post("/join-family/:familyId/requests/:requestId/approve", isLoggedIn, async (req, res) => {
  try {
    const { familyId, requestId } = req.params;

    // 1. Find the family
    const family = await Family.findById(familyId);
    if (!family) return res.status(404).send("Family not found");

    // 2. Check admin authorization
    if (family.admin.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized");
    }

    // 3. Find the specific request
    const request = family.joinRequests.id(requestId);
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
      `<p>Hi ${user.username || "there"},</p>
       <p>Your request to join the family <b>${family.family_name}</b> has been accepted!</p>
       <p>Welcome to the family 💫</p>`
    );

    res.redirect(`/join-family/${family._id}/requests`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


app.post("/join-family/:familyId/requests/:requestId/reject", isLoggedIn, async (req, res) => {
  try {
    const { familyId, requestId } = req.params;
    const family = await Family.findById(familyId);
    if (!family) return res.status(404).send("Family not found");

    if (family.admin.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized");
    }

    const request = family.joinRequests.id(requestId);
    if (!request) return res.status(404).send("Request not found");

    request.status = "rejected";
    await family.save();

    res.redirect(`/join-family/${family._id}/requests`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});




app.get("/create-family",isLoggedIn,async (req,res)=>{
  const userId = req.user._id; 
   const existingFamily = await Family.findOne({ admin: userId });
 if (existingFamily) {
      return res.status(400).send("You are already an admin of another family.");
    }
  
  const user=await User.findById(userId);
 const username = user ? user.username : "";
 const family_id=generateFamilyId();
  res.render('createFamily.ejs',{username,family_id})
})

app.post("/create-family",isLoggedIn, async (req, res) => {
  try {
    const { family_id ,family_name} = req.body;
    const userId = req.user._id;  
    // Check if family_id already exists
    const existingFamily = await Family.findOne({ "family_id":family_id });
    if (existingFamily) {
      return res.status(400).send("Family ID already taken.");
    }
   
    const family = new Family({
      admin: userId,
      family_id,
      family_name,
      members: [userId]
    });

    await family.save();

    // Update user's family_id
    await User.findByIdAndUpdate(userId, { family_id:family._id });
//console.log(family)
    res.json({"route":"/dashboard"}); // or wherever
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating family.");
  }
});



    

// Facebook (I am keeping it for google only for now)

// app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
// app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }),
//   (req, res) => res.send(`Welcome ${req.user.name}!`)
// );

// // Instagram
// app.get("/auth/instagram", passport.authenticate("instagram"));
// app.get("/auth/instagram/callback", passport.authenticate("instagram", { failureRedirect: "/" }),
//   (req, res) => res.send(`Welcome ${req.user.name}!`)
// );



app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid"); 
    res.redirect("/singup");
  });
});



app.listen(3128, () => console.log("Server running on http://localhost:3128"));

