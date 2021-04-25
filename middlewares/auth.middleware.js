const sql = require("../utils/sqlConnection");
const jwt = require("jsonwebtoken");

/***
 * this a middleware to check if token is exist end if is invalid
 */
module.exports = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  const checkUser = (data, cb) => {
    sql.query(
      `SELECT user_id FROM users WHERE user_id = ? AND user_type = ?`,
      [data.user_id, data.user],
      (err, result) => {
        if (err) {
          cb(err, null, null);
        }
        if (result[0]) {
          cb(null, result, null);
        }
        if (!result[0]) {
          cb(null, null, "user is not exist");
        }
      }
    );
  };

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    checkUser(decoded, (err, result, noResult) => {
      if (err) {
        console.log(err);
        return res.status(500).send("server-error");
      }
      if (noResult) {
        return res.status(401).send(`Access denied. ${noResult}`);
      }
      if (result) {
        console.log("next");
        return next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid token");
  }
};
