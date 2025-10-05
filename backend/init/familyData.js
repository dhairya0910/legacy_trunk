// familyData.js
const mongoose = require("mongoose");

// Dummy ObjectIds for members (just placeholders for seeding)
const dummyUserIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId()
];

const data = [
  { admin: "Ramesh Kumar", family_id: "#10001", family_name: "Sharma Family", members: [dummyUserIds[0], dummyUserIds[1]] },
  { admin: "Sunita Singh", family_id: "#10002", family_name: "Singh Family", members: [dummyUserIds[2]] },
  { admin: "Amit Patel", family_id: "#10003", family_name: "Patel Parivar", members: [dummyUserIds[3]] },
  { admin: "Priya Mehta", family_id: "#10004", family_name: "Mehta Kutumb", members: [dummyUserIds[4]] },
  { admin: "Vikram Joshi", family_id: "#10005", family_name: "Joshi Family", members: [dummyUserIds[0]] },
  { admin: "Kavita Reddy", family_id: "#10006", family_name: "Reddy Family", members: [dummyUserIds[1]] },
  { admin: "Rajesh Sharma", family_id: "#10007", family_name: "Sharma Parivar", members: [dummyUserIds[2]] },
  { admin: "Sneha Gupta", family_id: "#10008", family_name: "Gupta Family", members: [dummyUserIds[3]] },
  { admin: "Anil Verma", family_id: "#10009", family_name: "Verma Kutumb", members: [dummyUserIds[4]] },
  { admin: "Sunil Chauhan", family_id: "#10010", family_name: "Chauhan Family", members: [dummyUserIds[0]] },
  { admin: "Meena Iyer", family_id: "#10011", family_name: "Iyer Family", members: [dummyUserIds[1]] },
  { admin: "Rohan Kapoor", family_id: "#10012", family_name: "Kapoor Kutumb", members: [dummyUserIds[2]] },
  { admin: "Anjali Nair", family_id: "#10013", family_name: "Nair Family", members: [dummyUserIds[3]] },
  { admin: "Suresh Reddy", family_id: "#10014", family_name: "Reddy Parivar", members: [dummyUserIds[4]] },
  { admin: "Pooja Bansal", family_id: "#10015", family_name: "Bansal Family", members: [dummyUserIds[0], dummyUserIds[1]] },
];

module.exports = { data };
