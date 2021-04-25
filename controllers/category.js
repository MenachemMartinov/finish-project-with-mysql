const sql = require("../utils/sqlConnection");
const Joi = require("@hapi/joi");

class Category {
  newCategory = (data, cb) => {
    sql.query(
      `SELECT category_name FROM categories WHERE category_name = ?`,[
        data.category_name
      ],
      (errExist, exist) => {
        if (errExist) {
          console.log("errExist", errExist);
          return cb(errExist, null, null);
        }
        if (exist[0]) {
          return cb(null, "category is exist", null);
        }
        if (!exist[0]) {
          sql.query(
            `INSERT INTO categories(category_name,image) values(?,?)`,
            [data.category_name, data.image],
            (err, result) => {
              if (err) {
                console.log("err", err);
                return cb(err, null);
              }
              if (result) {
                return cb(null, null, "category is created successfully");
              }
            }
          );
        }
      }
    );
  };

  /***
   * this function check if the data valid
   */
  validateCategory(category) {
    const schema = Joi.object({
      category_name: Joi.string().required().min(2).max(50),
      image: Joi.string().max(240).required(),
    });

    return schema.validate(category);
  }
}
module.exports = new Category();
