var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async(user_id)=>{
    var Query =`select * from bh_user where user_id = ? and user_role ='admin'`;
    var data = query(Query,[user_id]);
    return data;
};
module.exports.CheckBanner = async(banner_id)=>{
    var Query = `select * from bh_banner where banner_id = ?`
    var data = query(Query,[banner_id]);
    return data;
}

module.exports.RemoveBanner = async(banner_id)=>{
    var Query = `delete from bh_banner where banner_id = ?`;
    var data = query(Query,[banner_id]);
    return data;
}