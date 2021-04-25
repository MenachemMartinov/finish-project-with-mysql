const mongoose = require("mongoose");

/***
 * this is a schema for favorites
 */
const favoritesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  of_card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Favorites = mongoose.model("Favorites", favoritesSchema);

module.exports = { Favorites };
