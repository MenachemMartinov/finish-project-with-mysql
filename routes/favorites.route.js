const auth = require("../middlewares/auth.middleware");
const { Favorites } = require("../models/favorites");

const router = require("express").Router();

/***
 * this route is to create new card the parameters what gibeon the id of the card what will to add to favorites
 */
router.post("/:id/new-favorites", auth, async (req, res) => {
  try {
    let favorites = await new Favorites({
      user_id: req.user._id,
      of_card: req.params.id,
    });

    await favorites.save();
    res.send(favorites);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/***
 * this route is to get all favorites
 */
router.get("/all-favorites", auth, async (req, res) => {
  const favorites = await Favorites.find({
    user_id: req.user._id,
  });
  if (!favorites) {
    return res.status(404).send("no favorites");
  }
  res.send(favorites);
});

/***
 * this route is to get one favorite by id
 */
router.get("/:id", auth, async (req, res) => {
  const favorites = await Favorites.find({
    user_id: req.user._id,
    of_card: req.params.id,
  });
  if (!favorites) {
    return res.send(null);
  }
  res.send(favorites);
});

/***
 * this route is to delete one favorite by id
 */
router.delete("/:id", auth, async (req, res) => {
  const favorites = await Favorites.findOneAndDelete({
    user_id: req.user._id,
    of_card: req.params.id,
  });
  if (!favorites) {
    return res.status(404).send("no favorites");
  }
  res.send(favorites);
});

module.exports = router;
