var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
  var Query = `select * from bh_user where user_id = ? and user_role = 'admin'`;
  var data = query(Query, [user_id]);
  return data;
}

module.exports.AddCouponQuery = async (coupon_name, coupon_code, coupon_discount, ValidFrom, ValidTo) => {
  var Query = `INSERT INTO bh_coupon (coupon_name,coupon_code,coupon_discount, valid_from, valid_to, coupon_status) VALUES (?,?,?,?,?,?) ;`;
  var data = await query(Query, [coupon_name, coupon_code, coupon_discount, ValidFrom, ValidTo, 'active']);
  var datas = await query('SELECT LAST_INSERT_ID() as coupon_id;')
  return datas;
}

module.exports.Getcategory = async (category_id) => {
  var Query = `select product_id from bh_products where category_id = ? order by product_id asc`;
  var data = await query(Query, [category_id]);
  return data;
}

module.exports.AddproductCoupon = async (coupon_id, product_id) => {
  var Query = `insert into bh_product_coupons(coupon_id,product_id)values(?,?)`;
  var data = await query(Query, [coupon_id, product_id]);
  return data;
}

module.exports.AddOfferQuery = async (offer_name, offer_discount, offer_description, ValidFrom, ValidTo) => {
  var Query = `INSERT INTO bh_offers(offer_name,offer_discount,offer_description, offer_status, offer_start_date, offer_end_date) VALUES (?,?,?,?,?,?) ;`;
  var data = await query(Query, [offer_name, offer_discount, offer_description, 'active', ValidFrom, ValidTo]);
  return data;
}

module.exports.Addproductoffer = async (offer_id, product_id) => {
  var Query = `insert into bh_product_offers(offer_id,product_id)values(?,?)`;
  var data = await query(Query, [offer_id, product_id]);
  return data;
}

module.exports.GetcouponCheck = async (coupon_name) => {
  var Query = `select coupon_id from bh_coupon where coupon_name = ?`;
  var data = await query(Query, [coupon_name]);
  return data;
}

module.exports.UpdateCoupon = async (coupon_code, coupon_discount, ValidFrom, ValidTo, coupon_id) => {
  var Query = `update bh_coupon set coupon_code = ?,coupon_discount = ?, valid_from = ?, valid_to = ?,coupon_status='active' where coupon_id = ?`;
  var data = await query(Query, [coupon_code, coupon_discount, ValidFrom, ValidTo, coupon_id]);
  return data;
}

module.exports.removeCouponProducts = async (coupon_id) => {
  var Query = `delete from bh_product_coupons where coupon_id = ?`;
  var data = await query(Query, [coupon_id]);
  return data;
}

module.exports.GetofferCheck = async (offer_name) => {
  var Query = `select offer_id from bh_offers where offer_name = ?`;
  var data = await query(Query, [offer_name]);
  return data;
}

module.exports.UpdateOffer = async (discount, description, ValidFrom, ValidTo, offer_id) => {
  var Query = `update bh_offers set offer_discount = ?,offer_description = ?,offer_start_date = ?, offer_end_date = ?,offer_status ='active' where offer_id = ?`;
  var data = await query(Query, [discount, description, ValidFrom, ValidTo, offer_id]);
  return data;
}

module.exports.removeOfferProducts = async (coupon_id) => {
  var Query = `delete from bh_product_offers where offer_id = ?`;
  var data = await query(Query, [coupon_id]);
  return data;
}

module.exports.AddproductQuery = async (offer_id, product_id) => {
  var Query = `insert into bh_product_offers(offer_id,product_id)values(?,?)`;
  var data = query(Query, [offer_id, product_id]);
  return data;
}

module.exports.checkproductQuery = async (product_id) => {
  var Query = `select * from bh_products where product_id = ?`;
  var data = query(Query, [product_id]);
  return data;
};
