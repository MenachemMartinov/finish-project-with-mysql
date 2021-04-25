const sql = require("../utils/sqlConnection");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");

class User {
  async generateUserId(data, cb) {
    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash(data.password, salt);
    let randomNumber = await _.random(1000, 9999999999999);
    sql.query(
      `SELECT user_id FROM users WHERE user_id = ?`,
      [randomNumber],
      (error, exist) => {
        if (error) {
          cb(error, null);
          return true;
        }
        if (exist[0]) {
          return this.generateUserId(data, cb);
        }
        if (!exist[0]) {
          sql.query(
            `INSERT INTO users(user_id,name,email,password,user_type) VALUES(?,?,?,?,?)`,
            [randomNumber, data.name, data.email, password, data.user_type],
            (error, result) => {
              if (error) {
                console.log("error from user line 58", error);
                return cb(error, null);
              }
              if (result) {
                return cb(null, `the user is bin created successfully`);
              }
              if (!result) {
                return cb(result, null);
              }
            }
          );
          return "SELECT for me";
        }
      }
    );
  }

  userId = async () => {};

  /**
   * create new user
   */
  newUser = async (data, cb) => {
    this.generateUserId(data, cb);
  };

  /***
   * this function generate the auth token
   */
  generateAuthToken = (user_id, user_type) => {
    const token = jwt.sign(
      {
        user_id: user_id,
        user: user_type,
      },
      process.env.JWT_KEY
    );
    return token;
  };

  /***
   * this function is check if the data is valid
   */
  validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(2).max(255).required(),
      email: Joi.string().email().min(6).max(255).required(),
      password: Joi.string().min(6).max(1024).required(),
      user_type: Joi.string().required(),
    });

    return schema.validate(user);
  }
}

module.exports = new User();
