var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.checkUser = async (user_id) => {
  var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'user'`;
  var data = query(Query, [user_id]);
  return data;
};




module.exports.checkProductInCart = async(user_id,cart_id)=>{
  var Query = `select cart_id from bh_cart where user_id =? and cart_id = ?`
var data = await query(Query,[user_id,cart_id]);
return data;
}

module.exports.Updatecart= async(cart_id)=>{
    var Query = `update bh_cart set status  = 'removed' where cart_id = ?`
    var data = await query(Query,[cart_id]);
    return data
    }