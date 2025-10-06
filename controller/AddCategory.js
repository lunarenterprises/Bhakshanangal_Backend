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
      const checkCategory = await model.GetCategoryByName(category_name);
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


module.exports.EditCategory = async (req, res) => {
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

      let { category_id, category_name, status, language: lang } = fields;
      const { user_id, role } = req?.user || {};

      const language = await languages(lang || "en");

      // Validate required fields
      if (!category_id) {
        return res.send({
          result: false,
          message: "category id is required",
        });
      }

      if (role !== "admin") {
        return res.send({
          result: false,
          message: language.Try_with_admin_level_Account,
        });
      }
      console.log(category_id, category_name, status);

      // Check if category exists
      const existingCategory = await model.Getcategorydata(category_id);
      if (existingCategory.length === 0) {
        return res.send({
          result: false,
          message: language.category_not_found,
        });
      }

      // Prepare new data
      category_name = category_name.toLowerCase();

      // If a new image is uploaded, replace old one
      if (files.image) {
        const oldPath = files.image.filepath;
        const newPath = `${process.cwd()}/uploads/category/${files.image.originalFilename}`;
        const rawData = fs.readFileSync(oldPath);
        fs.writeFileSync(newPath, rawData);
        imagePath = `uploads/category/${files.image.originalFilename}`;

        // Optionally remove old image
        if (existingCategory[0].category_image && fs.existsSync(existingCategory[0].category_image)) {
          fs.unlinkSync(existingCategory[0].category_image);
        }
        await model.UpdateCategoryimage(category_id, imagePath);

      }

      // Check for duplicate category name (ignore same ID)
      const checkDuplicate = await model.GetCategoryByName(category_name, category_id);

      if (checkDuplicate.length > 0) {

        return res.send({
          result: false,
          message: language.category_not_found || "Category not found"
        });

      }

      // Update category details
      await model.UpdateCategory(category_id, category_name, status);

      // Update translations
      const translations = await Promise.all([
        translatte(category_name, { to: "ar" }),
        translatte(category_name, { to: "fr" }),
        translatte(category_name, { to: "hi" }),
        translatte(category_name, { to: "ml" }),
        translatte(category_name, { to: "ta" }),
      ]);

      const [arabic, french, hindi, malayalam, tamil] = translations.map(t => t.text);

      const langArray = [
        { lannum: 0, lancod: "en", cat: category_name },
        { lannum: 1, lancod: "ar", cat: arabic },
        { lannum: 2, lancod: "fr", cat: french },
        { lannum: 3, lancod: "hi", cat: hindi },
        { lannum: 4, lancod: "ml", cat: malayalam },
        { lannum: 5, lancod: "ta", cat: tamil },
      ];

      for (const element of langArray) {
        await model.UpdateCategoryLang(category_id, element.lannum, element.cat);
      }

      return res.send({
        result: true,
        message: "Category updated success",
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

      const checkSubCategory = await model.GetSubcategoryByname(category_name);

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


module.exports.EditSubCategory = async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({ result: false, message: language?.file_upload_failed || "File upload failed", data: err });
      }

      let { subcategory_id, category_id, category_name, status, language: lang = "en" } = fields;
      const { role } = req?.user || {};
      const language = await languages(lang);

      // Validation
      if (!subcategory_id) return res.send({ result: false, message: language?.subcategory_id_required || "Subcategory ID is required" });
      if (!category_id) return res.send({ result: false, message: language?.category_id_required || "Category ID is required" });
      if (!category_name) return res.send({ result: false, message: language?.subcategory_name_required || "Subcategory name is required" });
      if (!status) return res.send({ result: false, message: language?.status_required || "Status is required" });

      if (role !== "admin") return res.send({ result: false, message: language?.Try_with_admin_level_Account || "Admin privileges required" });

      // Fetch existing subcategory
      const existingSubCategory = await model.GetSubcategoryById(subcategory_id);
      if (existingSubCategory.length === 0) return res.send({ result: false, message: language?.subcategory_not_found || "Subcategory not found" });

      // Check if category exists
      const checkCategory = await model.Getcategorydata(category_id);
      if (checkCategory.length === 0) return res.send({ result: false, message: language?.category_not_found || "Category not found" });

      category_name = category_name.toLowerCase();

      // Check for duplicate subcategory name (ignore current)
      const checkDuplicate = await model.GetSubcategoryByname(category_name, subcategory_id);
      if (checkDuplicate.length > 0) return res.send({ result: false, message: language?.subcategory_already_exist || "This subcategory already exists" });

      // Handle image upload if provided
      if (files.image) {
        const oldPath = files.image.filepath;
        const newPath = `${process.cwd()}/uploads/subcategory/${files.image.originalFilename}`;
        fs.writeFileSync(newPath, fs.readFileSync(oldPath));
        imagePath = `uploads/subcategory/${files.image.originalFilename}`;

        // Remove old image
        if (existingSubCategory[0].sc_image && fs.existsSync(existingSubCategory[0].sc_image)) {
          fs.unlinkSync(existingSubCategory[0].sc_image);
        }
        await model.UpdateSubCategoryImage(subcategory_id, imagePath);
      }

      // Update main details
      await model.UpdateSubCategory(subcategory_id, category_id, category_name, status);

      // Update translations
      const translations = await Promise.all([
        translatte(category_name, { to: "ar" }),
        translatte(category_name, { to: "fr" }),
        translatte(category_name, { to: "hi" }),
        translatte(category_name, { to: "ml" }),
        translatte(category_name, { to: "ta" }),
      ]);

      const [arabic, french, hindi, malayalam, tamil] = translations.map(t => t.text);

      const langArray = [
        { lannum: 0, cat: category_name },
        { lannum: 1, cat: arabic },
        { lannum: 2, cat: french },
        { lannum: 3, cat: hindi },
        { lannum: 4, cat: malayalam },
        { lannum: 5, cat: tamil },
      ];

      for (const element of langArray) {
        await model.UpdateSubCategoryLang(subcategory_id, element.lannum, element.cat);
      }

      return res.send({ result: true, message: language?.subcategory_updated_success || "Subcategory updated successfully" });
    });
    
  } catch (error) {
    return res.send({ result: false, message: error?.message || "An error occurred" });
  }
};

