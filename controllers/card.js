const sql = require("../utils/sqlConnection");

const Joi = require("@hapi/joi");
const _ = require("lodash");

class card {
  newCardHours = (card_id, open_hours, cb) => {
    const {
      day_1,
      day_2,
      day_3,
      day_4,
      day_5,
      day_6,
      day_7,
      day_8,
    } = open_hours;
    sql.query(
      `INSERT INTO open_hours(day_1,day_2,day_3,day_4,day_5,day_6,day_7,day_8,by_card) VALUES(?,?,?,?,?,?,?,?,?)`,
      [day_1, day_2, day_3, day_4, day_5, day_6, day_7, day_8, card_id],
      (err, result) => {
        if (err) {
          console.log(err);
          cb(err, null);
        }
        if (result) {
          cb(null, result);
        }
      }
    );
  };
  newCard = async (data, user_id, cb) => {
    let randomNumber = await _.random(100000000, 9999999999999);
    sql.query(
      `SELECT card_id FROM cards WHERE card_id = ?`,
      [randomNumber],
      (error, exist) => {
        if (error) {
          cb(error, null);
          return true;
        }
        if (exist[0]) {
          return this.newCard(data, user_id, cb);
        }
        if (!exist[0]) {
          const {
            biz_name,
            biz_category,
            biz_phone,
            biz_address,
            biz_logo,
            biz_description,
            open_hours,
          } = data;
          sql.query(
            `INSERT INTO cards(card_id,biz_name,biz_category,biz_phone,biz_address,biz_logo,biz_description,user_id) VALUES(?,?,?,?,?,?,?,?)  `,
            [
              randomNumber,
              biz_name,
              biz_category,
              biz_phone,
              biz_address,
              biz_logo,
              biz_description,
              user_id,
            ],
            (errCard, resultCard) => {
              if (errCard) {
                cb(errCard, null);
              }
              if (resultCard) {
                if (open_hours) {
                  this.newCardHours(
                    randomNumber,
                    open_hours,
                    (hoursErr, hoursResult) => {
                      if (hoursErr) {
                        cb(hoursErr, null);
                      }
                      if (hoursResult) {
                        cb(null, "card is created successfully");
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    );
  };

  /***
   * this a function that check if what the frontend send is valid
   */
  validateCard(card) {
    const schema = Joi.object({
      biz_name: Joi.string().min(2).max(255).required(),
      biz_category: Joi.string().min(2).max(50).required(),
      biz_phone: Joi.string().min(9).max(10).required(),
      biz_address: Joi.string().min(2).max(400).required(),
      biz_logo: Joi.string().min(10).max(240).required(),
      biz_description: Joi.string().min(2).max(1024).required(),
      open_hours: Joi.object(),
    });

    return schema.validate(card);
  }
  /***
   * this a function that check if what the frontend send is valid
   */
  validateCardImages(card) {
    const schema = Joi.object({
      image_path: Joi.string().min(15).max(255).required(),
    });

    return schema.validate(card);
  }
}
module.exports = new card();
