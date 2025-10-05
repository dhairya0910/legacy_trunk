const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  providerId: String,
  provider: String,
  name: String,
  email: String,
  photo: String,
  family_id:  { type: mongoose.Schema.Types.ObjectId, ref: "Family" },
  username: { type: String, unique: true,trim: true},
  createdAt: { type: Date, default: Date.now },
  age:Number
});

module.exports = mongoose.model("User", userSchema);
