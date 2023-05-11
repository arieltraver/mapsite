// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defines the Post schema
const PostSchema = new Schema({
  ip: { type: String, required: true },
  notes: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lat: {type: Number, required: false},
  lon: {type: Number, required: false}
});

// Sets the createdAt parameter equal to the current time
PostSchema.pre('save', (next) => {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

// Exports the PostSchema for use elsewhere.
module.exports = mongoose.model('Post', PostSchema);