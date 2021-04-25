const sql = require("../utils/sqlConnection");
const auth = require("../middlewares/auth.middleware");
const Category = require("../controllers/category");

const router = require("express").Router();

router.post("/new-category", auth, async (req, res) => {
  const { error } = Category.validateCategory(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  Category.newCategory(req.body, (err, exist, result) => {
    if (err) {
      res.status(500).send(err);
    }
    if (exist) {
      res.status(400).send(exist);
    }
    if (result) {
      res.send(result);
    }
  });
});

router.get("/", async (req, res) => {
  sql.query(`SELECT category_name,image FROM categories`, (err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

router.put("/:id", auth, async (req, res) => {
  const { error } = Category.validateCategory(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  sql.query(
    `UPDATE categories SET category_name = ?,image = ?`,
    [req.body.category_name, req.body.image],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      if (result) {
        res.send("category is bin updated successfully");
      }
    }
  );
});

router.delete("/:id", auth, async (req, res) => {
  sql.query(
    `DELETE FROM categories WHERE category_name = ?`,
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      if (result) {
        res.send("category is bin deleted successfully");
      }
    }
  );
});

module.exports = router;
