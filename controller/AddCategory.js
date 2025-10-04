var model = require("../model/AddCategory");
var { languages } = require("../languages/languageFunc");
const { upload } = require("../components/category_uploader");
const moment = require("moment");
const Uploads = upload.array("image");
var translatte = require("translatte");
var formidable = require("formidable");
var fs = require("fs");
var path = require("path");

module.exports.AddCategory = async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          result: false,
          message: "File upload failed!",
          data: err,
        });
      }

      let { category_name, status, language: lang } = fields;
      const { user_id, role } = req?.user || {};

      const language = await languages(lang || "en");

      // Validate required fields
      if (!category_name || !status) {
        return res.send({
          result: false,
          message: language.insufficient_parameters,
        });
      }

      if (role !== "admin") {
        return res.send({
          result: false,
          message: language.Try_with_admin_level_Account,
        });
      }

      if (!files.image) {
        return res.send({
          result: false,
          message: language.Please_add_category_image_also,
        });
      }

      category_name = category_name.toLowerCase();

      // Save uploaded file
      const oldPath = files.image.filepath;
      const newPath = `${process.cwd()}/uploads/category/${files.image.originalFilename}`;
      const rawData = fs.readFileSync(oldPath);
      fs.writeFileSync(newPath, rawData);
      const imagePath = `uploads/category/${files.image.originalFilename}`;

      // Check if category already exists
      const checkCategory = await model.Getcategory(category_name);
      if (checkCategory.length > 0) {
        return res.send({
          result: false,
          message: language.category_already_exist,
        });
      }

      // Add category to DB
      const addCategory = await model.AddCategory(category_name, imagePath, status);
      const categoryId = addCategory.insertId;

      // Translate category name
      const translations = await Promise.all([
        translatte(category_name, { to: "ar" }),
        translatte(category_name, { to: "fr" }),
        translatte(category_name, { to: "hi" }),
        translatte(category_name, { to: "ml" }),
        translatte(category_name, { to: "ta" }),
      ]);

      const [arabic, french, hindi, malayalam, tamil] = translations.map(t => t.text);

      // Add translations to DB
      const langArray = [
        { lannum: 0, lancod: "en", cat: category_name },
        { lannum: 1, lancod: "ar", cat: arabic },
        { lannum: 2, lancod: "fr", cat: french },
        { lannum: 3, lancod: "hi", cat: hindi },
        { lannum: 4, lancod: "ml", cat: malayalam },
        { lannum: 5, lancod: "ta", cat: tamil },
      ];

      for (const element of langArray) {
        await model.AddCategoryLang(categoryId, element.lannum, element.cat);
      }

      return res.send({
        result: true,
        message: language.category_added_success,
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};




module.exports.AddSubCategory = async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          result: false,
          message: "File upload failed!",
          data: err,
        });
      }

      let { category_id, category_name, status, language: lang = 'en' } = fields;

      const { user_id, role } = req?.user || {};

      const language = await languages(lang);

      if (!category_name || !category_id || !status) {
        return res.send({
          result: false,
          message: language.insufficient_parameters,
        });
      }

      if (role !== "admin") {
        return res.send({
          result: false,
          message: language.Try_with_admin_level_Account,
        });
      }

      const checkSubCategory = await model.GetSubcategoryname(category_name);

      if (checkSubCategory.length > 0) {
        return res.send({
          result: false,
          message: "This sub category alredy exist",
        });
      }

      const checkCategory = await model.Getcategorydata(category_id);
      if (checkCategory.length == 0) {
        return res.send({
          result: false,
          message: "Category not found",
        });
      }

      category_name = category_name.toLowerCase();

      // Translations
      const translations = await Promise.all([
        translatte(category_name, { to: "ar" }),
        translatte(category_name, { to: "fr" }),
        translatte(category_name, { to: "hi" }),
        translatte(category_name, { to: "ml" }),
        translatte(category_name, { to: "ta" }),
      ]);

      const [arabic, french, hindi, malayalam, tamil] = translations.map(t => t.text);

      if (!files.image) {
        return res.send({
          result: false,
          message: language.Please_add_image_also,
        });
      }

      const oldPath = files.image.filepath;
      const newPath = `${process.cwd()}/uploads/subcategory/${files.image.originalFilename}`;
      const rawData = fs.readFileSync(oldPath);
      fs.writeFileSync(newPath, rawData);
      const imagePath = `uploads/subcategory/${files.image.originalFilename}`;

      // Add SubCategory
      const addSubCategory = await model.AddSubCategory(category_id, category_name, imagePath, status);
      const sbc_id = addSubCategory.insertId;

      // Add translations
      const langArray = [
        { lannum: 0, lancod: "en", cat: category_name },
        { lannum: 1, lancod: "ar", cat: arabic },
        { lannum: 2, lancod: "fr", cat: french },
        { lannum: 3, lancod: "hi", cat: hindi },
        { lannum: 4, lancod: "ml", cat: malayalam },
        { lannum: 5, lancod: "ta", cat: tamil },
      ];

      for (const element of langArray) {
        await model.AddsubCategoryLang(sbc_id, element.lannum, element.cat);
      }

      return res.send({
        result: true,
        message: language.subcategory_added_success,
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};

