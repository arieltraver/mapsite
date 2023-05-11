// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defines the Post schema
const PathSchema = new Schema({
  author: {type: String, required: true},
  userID: {type: String, required: true},
  ips: [
    {
      ip: {type: String, required: true },
      lat: {type: Number},
      lon: {type: Number}
    }
  ],
  notes: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

// Sets the createdAt parameter equal to the current time
PathSchema.pre('save', (next) => {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

// Exports the PostSchema for use elsewhere.
module.exports = mongoose.model('Path', PathSchema);