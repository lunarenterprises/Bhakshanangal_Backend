var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async (pq_u_id) => {
    var Query = `select * from bh_user where user_id = ?`;
    var data = query(Query, [pq_u_id]);
    return data;
};

module.exports.AddProductQuestion = async (pq_p_id, pq_u_id, pq_question,pq_answer) => {
    var Query = `insert into product_questions (pq_p_id,pq_u_id,pq_question,pq_answer) values (?,?,?,?)`;
    var data = query(Query, [pq_p_id, pq_u_id, pq_question,pq_answer]);
    return data;

}

module.exports.AddProductQuestionAnswerQuery = async (pq_answer, pq_id) => {
    var Query = `update product_questions set pq_answer=? where pq_id = ?`;
    var data = query(Query, [pq_answer, pq_id]);
    return data;
};

module.exports.ListProductQuestionAnswersQuery = async (whereClause) => {
    var Query = `SELECT pq.*, pt.product_name, u.user_id AS user_id, u.user_name, u.user_email FROM product_questions pq 
    LEFT JOIN bh_product_translations pt ON pq.pq_p_id = pt.product_id AND pt.language_id = 0 
    LEFT JOIN bh_user u ON pq.pq_u_id = u.user_id ${whereClause} `;
    var data = query(Query);
    return data;

}

module.exports.DeleteProductQuestionAnswerQuery = async ( pq_id) => {
    var Query = `delete from product_questions where pq_id = ?`;
    var data = query(Query, [pq_id]);
    return data;
};