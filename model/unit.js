var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.GetUnitname = async (unit_name) => {
    const Query = `
        SELECT *
        FROM units
        WHERE LOWER(unit_name) = ? `;

    const data = await query(Query, [unit_name.toLowerCase()]);
    return data;
};

module.exports.addUnitQuery = async (unit_name) => {
    let sql = `INSERT INTO units (unit_name) VALUES (?)`;
    return await query(sql, [unit_name]);
};


module.exports.updateUnitQuery = async (unit_id, unit_name) => {
    let sql = `UPDATE units SET unit_name = ? WHERE unit_id = ?`;
    return await query(sql, [unit_name, unit_id]);
};

module.exports.listUnitQuery = async () => {
    var Query = `SELECT * FROM  units `;
    var data = await query(Query);
    return data;
}

module.exports.deleteUnitQuery = async (Unit_id) => {
    var Query = `DELETE FROM units WHERE unit_id = ?`;
    var data = await query(Query, [Unit_id]);
    return data;
};
