const mongoose = require("mongoose");
const User = require("./userModule.js");

const categorieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide Categorie"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Categorie = mongoose.model("Categories", categorieSchema);

module.exports = Categorie;
