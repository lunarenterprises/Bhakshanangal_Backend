let model = require('../model/productQuestion')

module.exports.AddProductQuestion = async (req, res) => {
    try {
        let { role } = req.user
        let { pq_p_id, pq_u_id, pq_question, pq_answer } = req.body

        if (!pq_p_id || !pq_question) {
            return res.send({
                result: false,
                message: "please fill all the fileds"
            })
        }
        let addproductquestion

        if (role == 'admin') {
            addproductquestion = await model.AddProductQuestion(pq_p_id, pq_u_id, pq_question, pq_answer)

        } else {
            addproductquestion = await model.AddProductQuestion(pq_p_id, pq_u_id, pq_question)

        }

        if (addproductquestion.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Thank you for your query"
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
                message: "please fill all the fileds"
            })
        }

        let AddProductQuestionAnswer = await model.AddProductQuestionAnswerQuery(pq_answer, pq_id)

        if (AddProductQuestionAnswer.affectedRows > 0) {
            return res.send({
                result: true,
                message: "you replied user question"
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
        let { pq_p_id } = req.body
        let { role } = req.user
        let condition = ''
        if (role == 'user') {
            condition = `and pq_answer <>'NULL'`

        }
        
        let QuestionAnswerslist = await model.ListProductQuestionAnswersQuery(pq_p_id, condition);

        if (QuestionAnswerslist.length > 0) {
            return res.send({
                result: true,
                message: "Data retrived",
                list: QuestionAnswerslist,
            });
        } else {
            return res.send({
                result: false,
                message: "data not found",
            });
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message,
        });


    }
}