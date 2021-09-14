const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, require: true },
  role : { type: String }
});

const User = mongoose.model('Users', userSchema)

module.exports = User