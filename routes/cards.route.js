const sql = require("../utils/sqlConnection");
const auth = require("../middlewares/auth.middleware");
const Card = require("../controllers/card");

const router = require("express").Router();

/***
 * this is route for create new card
 */
router.post("/new-card", auth, async (req, res) => {
  const { error } = Card.validateCard(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  Card.newCard(req.body, req.user.user_id, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result) {
      return res.send(result);
    }
  });
});

/***
 * this route is to get all cards
 */
router.get("/all-cards", async (req, res) => {
  sql.query(
    `SELECT card_id,biz_name,biz_category,biz_phone,biz_address,biz_logo,biz_description,user_id FROM cards`,
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      if (result) {
        res.send(result);
      }
    }
  );
});

/***
 * this route is to get one card by id
 */
router.get("/:id", async (req, res) => {
  try {
    sql.query(
      `SELECT card_id,biz_name,biz_category,biz_phone,biz_address,biz_logo,biz_description,user_id FROM cards WHERE card_id = ?`,
      [req.params.id],
      (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        if (result) {
          res.send(result);
        }
      }
    );
  } catch (err) {
    console.error("error from get card by id", err);
    res.send("not found card with the id");
  }
});

/***
 * this route is to update card
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = Card.validateCard(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const {
      biz_name,
      biz_category,
      biz_phone,
      biz_address,
      biz_logo,
      biz_description,
    } = req.body;
    sql.query(
      `UPDATE cards SET biz_name = ?,biz_category = ?,biz_phone = ?,biz_address = ?,biz_logo = ?,biz_description = ? WHERE user_id = ?`,
      [
        biz_name,
        biz_category,
        biz_phone,
        biz_address,
        biz_logo,
        biz_description,
        req.user?.user_id,
      ],
      (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        if (result) {
          res.send(result);
        }
      }
    );
  } catch (err) {
    console.error("error from update card by _id", err);
    res.status(403).send(err);
  }
});

/***
 * this route is to update card image
 */
router.post("/:id/upload-img", auth, async (req, res) => {
  if (
    req.user?.user === "manager" ||
    req.user?.user === "business_pro" ||
    req.user?.user === "business_pro_max"
  ) {
    const { error } = Card.validateCardImages(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    try {
      sql.query(
        `SELECT user_id FROM cards WHERE user_id = ? AND card_id = ?`,
        [req.user.user_id, req.params.id],
        (errExist, exist) => {
          if (errExist) {
            res.status(500).send(errExist);
          }
          if (exist[0]) {
            sql.query(
              `INSERT INTO card_images(image_path,by_card) VALUES(?,?)`,
              [req.body.image_path, req.params.id],
              (err, result) => {
                if (err) {
                  res.status(500).send(err);
                }
                if (result) {
                  res.send(result);
                }
              }
            );
          } else {
            res.status(403).send("unknown error");
          }
        }
      );
    } catch (err) {
      console.error("error from update card by _id upload img", err);
      res.status(500).send(err);
    }
  } else {
    res.status(403).send(`Access denied.`);
  }
});

/***
 * this route is to delete a card by its id
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    sql.query(
      `DELETE FROM cards WHERE card_id = ?`,
      [req.params.id],
      (err, result) => {
        if (err) {
          console.log("error from cards.route line 151", err);
          return res.status(500).send(err);
        }
        if (result) {
          res.send(`card with gibeon id is bin deleted successfully`);
        }
      }
    );
  } catch (err) {
    console.error("error from update card by _id", err);
    res.status(403).send(err);
  }
});

module.exports = router;
