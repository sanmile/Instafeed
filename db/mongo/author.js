const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  articles: { type: [String] }
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author