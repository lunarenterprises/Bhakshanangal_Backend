var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.GetBanner = async()=>{
    var Query = `select * from bh_banner`;
    var data = await query(Query);
    return data;
}