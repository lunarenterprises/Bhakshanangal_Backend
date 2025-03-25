var model = require("../model/offerlist");
var { languages } = require("../languages/languageFunc");
var moment = require("moment");

module.exports.ListOffer = async (req, res) => {
  try {
    var lang = req.body.lang || "en";
    var language = await languages(lang);
    var current_date = moment().format("YYYY-MM-DD");
    // var category_id = req.body.category_id
    let OfferList = await model.offerList(current_date);
    let array = [];
    if (OfferList.length > 0) {
      for (let data of OfferList) {
        let product = await model.productList(lang, data.offer_id);
        console.log(data);
        let obj = {
          offer_id:data.offer_id,
          offer_name: data.offer_name,
          offer_description: data.offer_description,
          offer_image: data.offer_image,
          offer_status: data.offer_status,
          offer_created_at: data.offer_created_at,
          offer_start_date: moment(data.offer_start_date).format("YYYY-MM-DD"),
          offer_end_date: moment(data.offer_end_date).format("YYYY-MM-DD"),
          product: product,
        };
        array.push(obj);
      }

      return res.send({
        result: true,
        message: language.data_retrieved,
        data: array,
      });
    }else{
    return res.send({
        result: false,
        message: language.data_not_found
    })
    }
    // let ProductList = await model.productList(language,category_id)

    // if(OfferList.length)
  } catch (error) {
    console.log(error);
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
