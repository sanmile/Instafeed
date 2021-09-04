const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  keywords:{ type: [String]},
  modifiedAt: { type: Date, required: true },
  publishedAt: { type: Date, required: false },
  authorId: { type: String, required: true },
  readMins: { type: Number, required: true },
  source: { type: String, required: true }
})

const Article = mongoose.model('Articles', articleSchema)

module.exports = Article