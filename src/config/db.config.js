// utils/db.js
const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect('mongodb+srv://riteshpandey7356:Rpandey%40914@atlascluster.vekrdvj.mongodb.net/?retryWrites=true&w=majority/test');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = { connect };
