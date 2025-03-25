var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.Userlist = async (condition, limit, page_no) => {
    var Query = `select * from bh_user where user_role !='admin' and user_status = 'active' ${condition} order by user_id asc limit ? offset ?`;
    var data = query(Query, [limit, page_no]);
    console.log(Query, "query");
    return data;
};


module.exports.Userlist1 = async (condition) => {
    var Query = `select * from bh_user where user_role !='admin' and user_status = 'active' ${condition} order by user_id asc`;
    var data = query(Query);
    return data;
};