const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  customId: {
    type: String,
    required: false, // ✅ Used to map old book.id during seeding
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Book", bookSchema);
