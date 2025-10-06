var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

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

module.exports.ListProductQuestionAnswersQuery = async (pq_p_id, condition) => {
    var Query = `SELECT * FROM product_questions where pq_p_id =? ${condition}  `;
    var data = query(Query, [pq_p_id]);
    return data;

}
