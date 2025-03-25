var model = require("../model/offerAdd");
var { languages } = require("../languages/languageFunc");
const { upload } = require("../components/offer_uploader");
const moment = require("moment");
const Uploads = upload.array("image");

module.exports.OfferAdd = async (req, res) => {

      try {
      
        var lang = req.body.language;
        var language = await languages(lang);
        var category_id = req.body.category_id;
        let product_id = req.body.product_id;
        let discount = req.body.discount;
        let offer_name = req.body.offer_name;
        let offer_description = req.body.offer_description;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        let date = moment().format('YYYY-MM-DD')

        if (!offer_name || !offer_description || !start_date || !end_date || !discount) {
          return res.send({
            result: false,
            message: language.insufficient_parameters
          })
        }
        // let CheckAdmin = await model.CheckAdminQuery(req.headers.user_id);

        // if (CheckAdmin.length > 0) {

          let checkoffer = await model.checkOfferQuery(offer_name, start_date, end_date);
          if (checkoffer.length > 0) {
            return res.send({
              result: false,
              message: language.offer_already_exists
            })
          } else {
            let offerInsert = await model.AddOfferQuery(offer_name, offer_description, null, date, start_date, end_date, discount)
            let offer_id = offerInsert.insertId
            let condition = ``
            if ((category_id && product_id) || product_id) {
              for (const element of product_id) {
                let checkproduct = await model.checkproductQuery(element)
                if (checkproduct.length > 0) {
                  condition = `a`
                  let insertproductoffer = await model.AddproductQuery(offer_id, element)
                } else {
                  condition = `b`
                }
              };
            } else {
              for (const element of category_id) {
                let getproductid = await model.GetProduct(element)
                if (getproductid.length > 0) {
                  for (const el of getproductid) {
                    let insertproductoffer = await model.AddproductQuery(offer_id, el.product_id)
                  }
                }
              }

            }

            if (condition == `a`) {
              return res.send({
                result: true,
                message: language.offer_added_successfully
              })
            } else if (condition == `b`) {
              return res.send({
                result: false,
                message: language.product_not_exist
              })
            } else {
              console.log();
            }
          }
        // } else {
        //   return res.send({
        //     result: false,
        //     message: language.Try_with_admin_level_Account
        //   })
        // }
      } catch (error) {
        console.log(error);
        return res.send({
          result: false,
          message: error.message
        })
      }
 
};
