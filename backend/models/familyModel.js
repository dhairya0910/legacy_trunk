const mongoose = require("mongoose");
const User= require('./userModel')
const familySchema = new mongoose.Schema({
  admin:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},
  family_key: { type: String,  unique:true},
  family_name:{type:String},
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
   joinRequests: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  invites: [
  {
    email: String,          // email of invited user
    token: String,          // unique token for signup link
    status: { type: String, default: "pending" }, // pending, accepted
    createdAt: { type: Date, default: Date.now }
  }
]

});

module.exports = mongoose.model("Family", familySchema);
