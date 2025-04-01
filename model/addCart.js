var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.checkUser = async (user_id) => {
  var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
  var data = query(Query, [user_id]);
  return data;
};

module.exports.checkProduct = async (product_id, language) => {
  var Query = `select p.product_id from bh_products p 
  inner join bh_product_stock s on p.product_id = s.product_id and s.stock_status = 'instock' and s.product_id = '${product_id}'
  where p.product_status ='active'`;
  var data = await query(Query);
  return data
};


module.exports.AddingCart = async (product_id, user_id, quantity, unit) => {
  var Query = `insert into bh_cart(product_id,user_id,quantity,unit,status)values(?,?,?,?,?)`
  var data = await query(Query, [product_id, user_id, quantity, unit, 'active']);
  return data
}

module.exports.checkProductInCart = async (product_id, user_id) => {
  var Query = `select cart_id from bh_cart where user_id =? and product_id = ?`
  var data = await query(Query, [user_id, product_id]);
  return data;
}

module.exports.UpdateProductInCart = async (product_id, user_id, quantity, unit) => {
  var Query = `update bh_cart set quantity = ?,unit = ?,status = ? where user_id =? and product_id = ?`
  var data = await query(Query, [quantity, unit, 'active', user_id, product_id]);
  return data;
}

module.exports.RemoveFromWishlist = async (user_id, product_id)=>{
  var Query = `delete from bh_wishlist where wish_user_id=? and wish_product_id=?`
  return await query(Query, [user_id, product_id])
}
