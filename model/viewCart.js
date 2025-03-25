var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
  var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
  var data = query(Query, [user_id]);
  return data;
};

module.exports.checkInCart = async (language, user_id) => {
  var Query = `select cart_id,p.product_id,product_name,ch.quantity,unit,price,image_file from bh_cart ch
  inner join bh_products p on ch.product_id = p.product_id
  inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    where l.language_code = ? and user_id = ? and ch.status = 'active'`;
  var data = await query(Query, [language, user_id]);
  return data;
};
