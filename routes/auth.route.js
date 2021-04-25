const sql = require("../utils/sqlConnection");
const User = require("../controllers/user");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const router = require("express").Router();

/***
 * this is route for auth (login)
 */
router.post("/", (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    sql.query(
      `SELECT user_id,name,email,password,user_type FROM users WHERE email = ? `,
      [req.body.email],
      async (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("server error");
        }
        if (result[0]) {
          const isValidPassword = await bcrypt.compare(
            req.body.password,
            result[0].password
          );
          if (!isValidPassword) {
            return res.status(400).send("Invalid email or password");
          }
          res.send({
            token: await User.generateAuthToken(
              result[0].user_id,
              result[0].user_type
            ),
            user: {
              user_id: result[0].user_id,
              name: result[0].name,
              email: result[0].email,
            },
          });
        }
        if (!result[0]){
          res.status(400).send("invalid email or password 2")
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/***
 * this function check if the data is valid
 */
function validate(data) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(data);
}

module.exports = router;
