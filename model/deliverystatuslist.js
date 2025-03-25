var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.CheckdeliverystatusQuery = async () => {
    var Query = `select * from bh_delivery_mode order by delivery_mode_id asc`;
    var data = await query(Query);
    return data;
};