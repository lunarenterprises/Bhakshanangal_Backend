var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async (user_id) => {``
    var Query = `select * from bh_user where user_id = ? and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.CheckOffer = async (offer_id) => {
    var Query = `select * from bh_offers where offer_id = ? and offer_status = 'active'`;
    var data = query(Query, [offer_id]);
    return data;
};

module.exports.RemoveOffer = async (user_id,offer_id) => {
    var Query = `UPDATE bh_offers
                SET offer_status = 'removed', offer_removed_by = ?
                WHERE offer_id = ?`;
    var data = query(Query, [user_id,offer_id]);
    return data;
};