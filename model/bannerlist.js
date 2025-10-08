var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

// Check active admin/user by id
module.exports.CheckAdminQuery = async (user_id) => {
    try {
        const Query = `SELECT * FROM bh_user WHERE user_id = ? AND user_status = 'active'`;
        const data = await query(Query, [user_id]);
        return data;
    } catch (err) {
        // Attach context and rethrow
        err.message = `CheckAdminQuery failed: ${err.message}`;
        throw err;
    }
};

// Get all banners
module.exports.GetBanner = async () => {
    try {
        const Query = `SELECT * FROM bh_banner`;
        const data = await query(Query);
        return data;
    } catch (err) {
        err.message = `GetBanner failed: ${err.message}`;
        throw err;
    }
};
