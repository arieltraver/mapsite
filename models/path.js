// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defines the Post schema
const PathSchema = new Schema({
  ips: { type: [String], required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  coords: {
    lats: {type: [Number]},
    longs: {type: [Number]}
  }
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