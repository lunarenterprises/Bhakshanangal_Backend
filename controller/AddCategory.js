var model = require("../model/AddCategory");
var { languages } = require("../languages/languageFunc");
const { upload } = require("../components/category_uploader");
const moment = require("moment");
const Uploads = upload.array("image");
var translatte = require("translatte");

module.exports.AddCategory = async (req, res) => {
  try {
    Uploads(req, res, async (err) => {
      let { category_name } = req.body;
      var lang = req.body.language;
      var language = await languages(lang);
      if (!category_name) {
        return res.send({
          result: false,
          message: language.insufficient_parameters,
        });
      }
      if (req.files.length == 0) {
        return res.send({
          result: false,
          message: language.Please_add_category_image_also
        })
      }
      category_name = category_name.toLowerCase();
      let filePath =
        req.files && req.files.length > 0
          ? `uploads/category/` + req.files[0].filename
          : null;
      let CheckAdmin = await model.CheckAdminQuery(req.headers.user_id);
      if (CheckAdmin.length > 0) {
        let CheckCategory = await model.Getcategory(category_name);
        if (CheckCategory.length > 0) {
          return res.send({
            result: false,
            message: language.category_already_exist,
          });
        } else {
          let product_nameInArab = await translatte(category_name, { to: "ar" });
          product_nameInArab = product_nameInArab.text;
          let product_nameInFrench = await translatte(category_name, { to: "fr" });
          product_nameInFrench = product_nameInFrench.text;
          let product_nameInHindi = await translatte(category_name, { to: "hi" });
          product_nameInHindi = product_nameInHindi.text;
          let product_nameInmalayalam = await translatte(category_name, {
            to: "ml",
          });
          product_nameInmalayalam = product_nameInmalayalam.text;
          let product_nameIntamil = await translatte(category_name, {
            to: "ta",
          });
          product_nameIntamil = product_nameIntamil.text;
          let addcategory = await model.AddCategory(category_name, filePath);
          let array = [
            {
              lannum: 0,
              lancod: "en",
              cat: category_name,
            },
            {
              lannum: 1,
              lancod: "ar",
              cat: product_nameInArab,
            },
            {
              lannum: 2,
              lancod: "fr",
              cat: product_nameInFrench,
            },
            {
              lannum: 3,
              lancod: "hi",
              cat: product_nameInHindi,
            },
            {
              lannum: 4,
              lancod: "ml",
              cat: product_nameInmalayalam,
            },
            {
              lannum: 5,
              lancod: "ta",
              cat: product_nameIntamil,
            }
          ];
          array.forEach(async (element) => {
            await model.AddCategoryLang(addcategory.insertId, element.lannum, element.cat);
          });
          return res.send({
            result: true,
            message: language.category_added_success,
          });
        }
      } else {
        return res.send({
          result: false,
          message: language.Try_with_admin_level_Account,
        });
      }
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
