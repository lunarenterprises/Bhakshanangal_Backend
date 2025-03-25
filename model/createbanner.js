var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.Getbanner = async (banner_name) => {
    var Query = `select * from bh_banner where banner_name = ?`;
    var data = await query(Query, [banner_name]);
    return data;
};

module.exports.AddBanner = async (banner_name, banner_description, banner_image, banner_priority) => {
    var col = ``
    var val = ``
    if (banner_priority) {
        col = `,banner_priority`
        val = `,${banner_priority}`
    }
    var Query = `insert into bh_banner(banner_name,banner_description,banner_image${col})values(?,?,?${val})`;
    var data = query(Query, [banner_name, banner_description, banner_image]);
    return data;
};