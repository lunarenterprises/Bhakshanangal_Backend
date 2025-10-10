var model = require("../model/editbanner"); // your model
var { languages } = require("../languages/languageFunc");
const { upload } = require("../components/banner");
const moment = require("moment");
const Uploads = upload.array("image");
module.exports.EditBanner = async (req, res) => {
  try {
    // Execute upload middleware (Multer) and proceed in its callback
    Uploads(req, res, async (err) => {
      if (err) {
        return res.status(400).send({
          result: false,
          message: `Upload error: ${err.message}`
        });
      }

      // Get user_id from JWT or fallback header
      const user_id = (req?.user && req.user.user_id) ? req.user.user_id : (req?.headers?.user_id || null);
      if (!user_id) {
        return res.status(401).send({
          result: false,
          message: "User ID is required"
        });
      }

      // Language pack
      const lang = req.body.language || "en";
      const language = await languages(lang);

      // Inputs
      const {
        banner_id,
        banner_heading,
        category_id,
        product_id,
        description,

      } = req.body;

      // Validate banner_id
      if (!banner_id) {
        return res.send({
          result: false,
          message: "Banner ID is required."
        });
      }

      // Admin check
      const CheckAdmin = await model.CheckAdminQuery(user_id);
      if (!Array.isArray(CheckAdmin) || CheckAdmin.length === 0) {
        return res.send({
          result: false,
          message: language.Try_with_admin_level_Account || "Try with admin level Account"
        });
      }

      // Fetch existing banner
      const existingRows = await model.GetBannerById(Number(banner_id));
      if (!existingRows || existingRows.length === 0) {
        return res.send({
          result: false,
          message: "Banner not found."
        });
      }
      const existingBanner = existingRows[0];

      // Resolve image path: new file if uploaded, else keep existing
      const image_path =
        (req.files && req.files.length > 0)
          ? `uploads/banner/${req.files[0].filename}`
          : existingBanner.banner_image;

      // Build payload for update (only include fields that are provided)
      const payload = {
        // Do not change banner_name here automatically; if heading changes,
        // optionally also update normalized banner_name to keep unique check consistent.
        banner_heading: banner_heading !== undefined ? String(banner_heading).trim() : undefined,
        description: description !== undefined ? String(description).trim() : undefined,
        image_path: image_path !== undefined ? image_path : undefined,
        category_id: category_id !== undefined ? (category_id ? Number(category_id) : null) : undefined,
        product_id: product_id !== undefined ? (product_id ? Number(product_id) : null) : undefined
      };

      // Perform update
      const result = await model.UpdateBanner(Number(banner_id), payload);
      if (!result || result.affectedRows === 0) {
        return res.send({
          result: false,
          message: "Nothing updated or banner not found."
        });
      }

      return res.send({
        result: true,
        message: language.banner_updated_success || "Banner updated successfully."
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message
    });
  }
};

