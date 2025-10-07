let model = require('../model/productQuestion')
var { languages } = require("../languages/languageFunc");

module.exports.AddProductQuestion = async (req, res) => {
    try {
        let { role } = req.user
        let { pq_p_id, pq_u_id, pq_question, pq_answer,lang = 'en' } = req.body
        var language = await languages(lang);

        if (!pq_p_id || !pq_question) {
            return res.send({
                result: false,
                message:language.insufficient_parameters || "please fill all the fileds"
            })
        }
        let checkUser = await model.CheckUser(pq_u_id)
        if (checkUser.length == 0) {
             return res.send({
                result: false,
                message:language.User_not_found || "User not found"
            })
        }

        let addproductquestion

        if (role == 'admin') {
            addproductquestion = await model.AddProductQuestion(pq_p_id,pq_u_id=null, pq_question, pq_answer)

        } else {
            addproductquestion = await model.AddProductQuestion(pq_p_id, pq_u_id, pq_question)
        }

        if (addproductquestion.affectedRows > 0) {
            return res.send({
                result: true,
                message: language.thankyou_for_your_query || "Thank you for your query"
            })
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}


module.exports.AddProductQuestionAnswer = async (req, res) => {
    try {
        let { pq_id, pq_answer } = req.body

        if (!pq_id || !pq_answer) {
            return res.send({
                result: false,
                message: "Question id and Answer is required"
            })
        }

        let AddProductQuestionAnswer = await model.AddProductQuestionAnswerQuery(pq_answer, pq_id)

        if (AddProductQuestionAnswer.affectedRows > 0) {
            return res.send({
                result: true,
                message: "You replied user's question"
            })
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}

module.exports.ListProductQuestionAnswers = async (req, res) => {
    try {
        let { pq_p_id } = req.body || {}
        let { role } = req.user
        var language = await languages(lang);

        let conditions = [];

        if (role == 'user') {
            conditions.push(`pq.pq_answer IS NOT NULL`); 
        }

        if (pq_p_id) {
            conditions.push(`pq.pq_p_id = '${pq_p_id}'`);
        }

        let whereClause = '';
        if (conditions.length > 0) {
            whereClause = 'WHERE ' + conditions.join(' AND ');
        }

        let QuestionAnswerslist = await model.ListProductQuestionAnswersQuery(whereClause);


        if (QuestionAnswerslist.length > 0) {
            return res.send({
                result: true,
                message: language.data_retrieved ||"Data retrived",
                list: QuestionAnswerslist,
            });
        } else {
            return res.send({
                result: false,
                message: language.data_not_found || "data not found",
            });
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message,
        });


    }
}

module.exports.DeleteProductQuestionAnswer = async (req, res) => {
    try {
        const { pq_id } = req.body || {};

        // Validate input
        if (!pq_id) {
            return res.send({
                result: false,
                message: "product question Id is required",
            });
        }

        // Call model query to delete
        const deleteResult = await model.DeleteProductQuestionAnswerQuery(pq_id);

        if (deleteResult.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Product question and answer deleted successfully",
            });
        } else {
            return res.send({
                result: false,
                message: "No record found with the given product question id",
            });
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};
