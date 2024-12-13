// models/User.js
const mongoose = require('mongoose');

console.log("[USER MODEL] Initializing user schema...");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    associatedCompany: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: false,
    },
  },
  { timestamps: true }
);

console.log("[USER MODEL] User schema successfully created");

module.exports = mongoose.model('User', userSchema);

console.log("[USER MODEL] User model exported");
