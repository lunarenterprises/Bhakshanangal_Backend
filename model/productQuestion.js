var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.AddProductQuestion = async (pq_p_id, pq_u_id, pq_question) => {
    var Query = `insert into product_questions (pq_p_id,pq_u_id,pq_question) values (?,?,?)`;
    var data = query(Query, [pq_p_id, pq_u_id, pq_question]);
    return data;

}

module.exports.AddProductQuestionAnswerQuery = async (pq_answer, pq_id) => {
    var Query = `update product_questions set pq_answer=? where pq_id = ?`;
    var data = query(Query, [pq_answer, pq_id]);
    return data;
};

module.exports.ListProductQuestionAnswersQuery = async (p_id) => {
    var Query = `SELECT * FROM product_questions where pg_id =? and pq_answer <>'NULL'  `;
    var data = query(Query, [p_id]);
    return data;

}
