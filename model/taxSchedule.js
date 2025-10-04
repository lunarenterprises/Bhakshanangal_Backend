var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.GetTaxname = async (tx_schedule_name) => {
    const Query = `
        SELECT *
        FROM tax_schedule
        WHERE LOWER(tx_schedule_name) = ? `;

    const data = await query(Query, [tx_schedule_name.toLowerCase()]);
    return data;
};

module.exports.addTaxQuery = async (unit_name) => {
    let sql = `INSERT INTO tax_schedule (tx_schedule_name) VALUES (?)`;
    return await query(sql, [unit_name]);
};


module.exports.updateTaxQuery = async (tx_schedule_name, tx_schedule_tax, tx_schedule_cgst, tx_schedule_igst, tx_schedule_sgst, tx_schedule_vat, tx_schedule_id) => {
    let sql = `UPDATE tax_schedule SET tx_schedule_name=?, tx_schedule_tax=?, tx_schedule_cgst=?, tx_schedule_igst=?, tx_schedule_sgst=?, tx_schedule_vat=? WHERE tx_schedule_id = ?`;
    return await query(sql, [tx_schedule_name, tx_schedule_tax, tx_schedule_cgst, tx_schedule_igst, tx_schedule_sgst, tx_schedule_vat, tx_schedule_id]);
};

module.exports.listTaxQuery = async () => {
    var Query = `SELECT * FROM  tax_schedule `;
    var data = await query(Query);
    return data;
}

module.exports.deleteTaxQuery = async (tx_schedule_id) => {
    var Query = `DELETE FROM tax_schedule WHERE tx_schedule_id = ?`;
    var data = await query(Query, [tx_schedule_id]);
    return data;
};
