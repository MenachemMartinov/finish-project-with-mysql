const sql = require("../utils/sqlConnection");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/auth.middleware");
const User = require("../controllers/user");
const router = require("express").Router();

/***
 * this route is to get to the user details
 */
router.get("/user-details", authMiddleware, async (req, res) => {
  sql.query(
    `SELECT user_id,name,email,create_at FROM users WHERE user_id = ?`,
    [req?.user?.user_id],
    (err, result) => {
      if (err) {
        console.log("error from users.route line 18", err);
        return res.status(500).send(err);
      }
      if (result) {
        res.send(result);
      }
    }
  );
});

/**
 * this route is to create new user
 */
router.post("/new-user", async (req, res) => {
  const { error } = User.validateUser(req.body);
  console.log("error from users.route line 21", error);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  sql.query(
    `SELECT email FROM users WHERE email = ?`,
    [req.body.email],
    (error, result) => {
      if (error) {
        console.log("error from users.route line 30", error);
        return res.status(500).send(error);
      }
      if (result[0]) {
        return res.status(400).send("the email is exist");
      }
      if (!result[0]) {
        User.newUser(req.body, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          if (result) {
            res.status(200).send(result);
          }
        });
      }
    }
  );
});

/***
 * this route is to update user details
 */
router.put("/:id", authMiddleware, async (req, res) => {
  const salt = await bcrypt.genSalt(12);
  const password = await bcrypt.hash(req.body.password, salt);
  if (!req.params.id === req.user.user_id) {
    return res.status(400).send("unknown error");
  }
  sql.query(
    `UPDATE users SET name = ?,email = ?,password = ? WHERE user_id = ?`,
    [req.body?.name, req.body?.email, password, req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(`server error ${err}`);
      }
      if (result) {
        res.send(`user is bin updated successfully`);
      }
    }
  );
});

/***
 * this route is to delete a user
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  sql.query(
    `DELETE FROM users WHERE user_id = ?`,
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result) {
        res.send(`user with gibeon id is bin deleted successfully`);
      }
    }
  );
});

module.exports = router;
