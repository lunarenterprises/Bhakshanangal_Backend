var model = require("../model/ListProduct");
var { languages } = require("../languages/languageFunc");
var moment = require('moment')

module.exports.ListProduct = async (req, res) => {
  try {
    var lang = req.body.language || "en";
    var language = await languages(lang);
    let search = req.body.search;
    let filterby = req.body.filterby
    let category_id = req.body.category_id
    let user_id = req.headers?.user_id
    let product_id = req.body.product_id

    let condition = ``
    let con = ``

    let current_date = moment().format('YYYY-MM-DD')
    var page_no = req.body.page_no ? Number(req.body.page_no) : 1
    var limit = req.body.limit ? req.body.limit : 20
    var starting_offset = (limit * page_no) - limit;
    console.log(starting_offset, "starting_offset", limit, page_no);
    var ending_offset = limit * page_no

    var getcategory = []
    if (search) {
      condition = ` and (product_name like '%${search}%' or category_name like '%${search}%')`
    }
    if (category_id) {
      if (condition !== '') {
        if (category_id == 'all') {
          condition += ``
        } else {
          condition += ` and p.category_id = '${category_id}'`
        }
      } else {
        if (category_id == 'all') {
          condition = ``
        } else {
          condition = ` and p.category_id = '${category_id}'`
        }
      }
      if (category_id !== 'all') {
        getcategory = await model.GetCategories1(category_id);
      }
    }

    let cond = ``
    if (filterby == 'low') {
      cond = ` order by price asc`
    }
    else if (filterby == 'high') {
      cond = ` order by price desc`
    } else {
      cond = `order by p.product_id desc`
    }

    if (product_id) {
      con = `and p.product_id='${product_id}'`

    }
    let Allproducts = await model.GetAllProducts(con)

    let GetProduct = await model.GetProducts(lang, condition, cond, limit, starting_offset);
    let Data = await Promise.all(GetProduct.map(async (element) => {
      // GetProduct.forEach(async (element) => {
      let wishlistcheck = await model.Getwishlist(user_id, element.product_id)
      let imagesInproduct = await model.GetImages(element.product_id)
      // imagesInproduct.forEach(el => {
      //   el.image_file = 'bhakshanangal/' + el.image_file
      // });
      element.image_file = imagesInproduct[0]?.image_file
      element.product_rating = Number(element.product_rating).toFixed(1)

      // if (wishlistcheck.length > 0) {
      //   var wishlist = true
      // } else {
      //   var wishlist = false
      // }
      let discountCheck = await model.GetDiscount(current_date, element.product_id)
      if (discountCheck.length > 0) {
        var Discount = Number(discountCheck[0].offer_discount) + '%'
        var Offer_Price = Number(element.price) - (Number(element.price) * (Number(discountCheck[0].offer_discount) / 100))
      } else {
        var Offer_Price = null
        var Discount = null
      }

      element.wishlist = wishlistcheck.length > 0 ? true : false
      element.discount = Discount
      element.offer_price = Offer_Price

      return element
    }))
    let totalData = await model.GetProducts1(lang, condition, cond)
    let category_name = ''
    if (getcategory.length > 0) {
      category_name = getcategory[0].category_name
    }

    if (GetProduct.length > 0) {
      return res.send({
        result: true,
        message: language.data_retrieved,
        category_name,
        current_data_count: Data.length,
        total_data_count: totalData.length,
        data: Data,
        Allproducts: Allproducts
      });
    } else {
      return res.send({
        result: false,
        message: language.data_not_found,
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
