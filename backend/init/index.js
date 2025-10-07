const mongoose = require('mongoose');
const familyModel = require('../models/familyModel.js');
const { data } = require('./familyData.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/legacy_trunk";

async function initDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected");

    await familyModel.deleteMany({});
    await familyModel.insertMany(data);

    console.log("Data Saved");
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

initDB();
