var model = require("../model/rating");
var translate = require("../languages/languageFunc");
var moment = require("moment");

module.exports.ProductRating = async (req, res, next) => {

    try {
        var lang = req.body.language;
        var language = await translate.languages(lang);
        var user_id = req.headers.user_id;
        let product_id = req.body.product_id;
        let rating = req.body.rating;
        let comment = req.body.comment;
        let current_date = moment().format('YYYY-MM-DD');
        let current_time = moment().format('HH:mm:ss');
        var output = {};
        if (product_id == '' || product_id == undefined || user_id == '' || user_id == undefined || rating == '' || rating == undefined) {
            output = { result: false, message: language.insufficient_parameters };
            return res.send(output)
        } else {
            let CheckUser = await model.checkUserQuery(user_id);
            if (CheckUser.length > 0) {
                let CheckResourceRating = await model.CheckResourceRatingQuery(user_id, product_id);
                let CheckResourceRatedUser = await model.CheckResourceRatedUserQuery(product_id);
                let CheckResourceAverageRating = await model.CheckResourceAverageRatingQuery(product_id);
                if (CheckResourceAverageRating.length > 0) {
                    if (CheckResourceRating.length > 0) {
                        let condition = ``;
                        if (comment !== '' && comment !== undefined) {
                            condition = ` set product_rating_value = ${rating},product_rating_comments = '${comment}',product_rating_date = '${current_date}', product_rating_time = '${current_time}' `;
                        } else {
                            condition = ` set product_rating_value = ${rating},product_rating_date = '${current_date}', product_rating_time = '${current_time}' `;
                        }
                        await model.UpdateResourceRatingQuery(user_id, product_id, condition);
                        let Avg_Rating = (CheckResourceAverageRating[0].product_rating == null) ? 0 : CheckResourceAverageRating[0].product_rating;
                        let Old_Rating = CheckResourceRating[0].product_rating_value;
                        let Calculate = ((CheckResourceRatedUser.length * Avg_Rating) - Old_Rating + rating) / CheckResourceRatedUser.length;
                        Calculate = parseFloat(Calculate.toFixed(1));
                        await model.UpdateResourceAverageRatingQuery(Calculate, product_id);
                        output = { result: true, message: language.Rating_Updated };
                    } else {
                        await model.InsertResourceRatingQuery(rating, comment, current_date, current_time, product_id, user_id);
                        let Avg_Rating = (CheckResourceAverageRating[0].product_rating == null) ? 0 : CheckResourceAverageRating[0].product_rating;
                        let Calculate = ((Avg_Rating * CheckResourceRatedUser.length) + rating) / (CheckResourceRatedUser.length + 1);
                        Calculate = parseFloat(Calculate.toFixed(1));
                        await model.UpdateResourceAverageRatingQuery1(Calculate, product_id);
                        output = { result: true, message: language.Rated_successfully };
                    }
                } else {
                    output = { result: false, message: language.product_not_exist };
                }
            } else {
                output = { result: false, message: language.user_does_not_exist };
            }
        }
        return res.send(output);
    } catch (error) {
        return res.send({ error: error.message, errorStack: error.stack });
    }
}