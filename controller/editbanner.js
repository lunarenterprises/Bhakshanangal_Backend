var model = require("../model/editbanner"); // your model
var { languages } = require("../languages/languageFunc");
const { upload } = require("../components/banner");
const moment = require("moment");

const Uploads = upload.array("image");

module.exports.EditBanner = async (req, res) => {
  console.log(req, "reqq");

  try {
    // Run upload middleware
    Uploads(req, res, async (err) => {
      if (err) {
        return res.status(400).send({
          result: false,
          message: `Upload error: ${err.message}`,
        });
      }

      // Get user_id from JWT (req.user) or fallback to headers
      const user_id =
        (req?.user && req.user.user_id) || req?.headers?.user_id || null;

      if (!user_id) {
        return res.status(401).send({
          result: false,
          message: "User ID is required",
        });
      }

      // Language
      const lang = req.body.language || "en";
      const language = await languages(lang);

      // Destructure request body
      const {
        banner_id,
        banner_heading,
        category_id,
        product_id,
        description,
      } = req.body;

      if (!banner_id) {
        return res.send({
          result: false,
          message: "Banner ID is required.",
        });
      }

      // Admin check
      const CheckAdmin = await model.CheckAdminQuery(user_id);
      if (CheckAdmin.length === 0) {
        return res.send({
          result: false,
          message: language.Try_with_admin_level_Account,
        });
      }

      // Fetch existing banner
      const existingBanner = await model.GetBannerById(banner_id);
      if (!existingBanner || existingBanner.length === 0) {
        return res.send({
          result: false,
          message: "Banner not found.",
        });
      }

      // Handle new image (or keep old one)
      const filePath =
        req.files && req.files.length > 0
          ? `uploads/banner/${req.files[0].filename}`
          : existingBanner[0].banner_image; // make sure column name matches

      // Prepare update data
      const updatedData = {
        banner_id,
        banner_name: banner_heading
          ? String(banner_heading).trim().toLowerCase()
          : existingBanner[0].banner_name,
        description: description
          ? String(description).trim()
          : existingBanner[0].description,
        image_path: filePath,
        category_id: category_id
          ? Number(category_id)
          : existingBanner[0].category_id,
        product_id: product_id
          ? Number(product_id)
          : existingBanner[0].product_id,
        updated_by: user_id,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      // Update banner
      await model.UpdateBanner(updatedData);

      return res.send({
        result: true,
        message:
          language.banner_updated_success || "Banner updated successfully.",
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
