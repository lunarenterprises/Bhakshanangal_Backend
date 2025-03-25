var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdmin = async(user_id)=>{
    var Query = `select * from bh_user where user_id = ? and user_role = 'admin' `;
    var data = query(Query,[user_id]);
    return data;
}


module.exports.CheckUser = async(Id)=>{
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query,[Id]);
    return data;
}

module.exports.UserDelete = async(Id)=>{
    var Query =`UPDATE bh_user
    SET user_status = 'removed'
    WHERE user_id = ?;`;
    var data = query(Query,[Id]);
    return data;
}