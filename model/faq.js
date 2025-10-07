var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.AddFaq = (faq_question, faq_answer) => {
    const sql = `INSERT INTO bh_faq (faq_question, faq_answer) VALUES (?, ?)`;
    return query(sql, [faq_question, faq_answer]);
};

module.exports.UpdateFaq = (faq_id, faq_question, faq_answer) => {
    const sql = `
    UPDATE bh_faq 
    SET faq_question = ?, faq_answer = ?, 
    WHERE faq_id = ?`;
    return query(sql, [faq_question, faq_answer, faq_id]);
};

module.exports.GetFaqById = (faq_id) => {
    const sql = `SELECT * FROM bh_faq WHERE faq_id = ?`;
    return query(sql, [faq_id]);
};

module.exports.AddFaqTranslation = (faq_id, lannum, lancod, question, answer) => {
    const sql = `
    INSERT INTO bh_faq_translation (faq_tras_faq_id,faq_tras_language_id,faq_tras_language_code,faq_tras_question,faq_tras_answer) VALUES (?, ?, ?, ?, ?)`;
    return query(sql, [faq_id, lannum, lancod, question, answer]);
};

module.exports.UpdateFaqTranslation = (faq_id, lannum, lancod, question, answer) => {
    const sql = `
    UPDATE bh_faq_translation 
    SET faq_tras_question = ?, faq_tras_answer = ? 
    WHERE faq_tras_faq_id = ? AND faq_tras_language_id = ? AND faq_tras_language_code = ?`;
    return query(sql, [question, answer, faq_id, lannum, lancod]);
};


module.exports.ListFaqsByLanguage = (language_code) => {
    const sql = `SELECT 
      f.faq_id,
      ft.*
    FROM bh_faq f
    INNER JOIN bh_faq_translation ft 
      ON f.faq_id = ft.faq_tras_faq_id
    WHERE ft.faq_tras_language_code = ?
    ORDER BY f.faq_id DESC  `;
    return query(sql, [language_code]);
};


// Corrected DeleteFaq to ensure both deletions happen sequentially
module.exports.DeleteFaq = async (faq_id) => {
    await query(`DELETE FROM bh_faq_translation WHERE faq_tras_faq_id = ?`, [faq_id]);
    return query(`DELETE FROM bh_faq WHERE faq_id = ?`, [faq_id]);
};

