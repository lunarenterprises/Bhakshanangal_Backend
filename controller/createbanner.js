var model = require("../model/createbanner");
var { languages } = require("../languages/languageFunc");
const { upload } = require("../components/banner");
const moment = require("moment");
const Uploads = upload.array("image");

module.exports.AddBanner = async (req, res) => {
    try {
        // Run upload middleware
        Uploads(req, res, async (err) => {
            if (err) {
                return res.status(400).send({
                    result: false,
                    message: `Upload error: ${err.message}`
                });
            }
            // Allow user_id from authenticated context or fallback header (if that's a legacy support)
            const user_id = (req?.user && req.user.user_id) ? req.user.user_id : req?.headers?.user_id || null;
            // New field names as requested:
            // - Banner Heading
            // - Category ID
            // - Product ID
            // - description
            // Also accept banner_priority if provided
            let {
                banner_heading,        // Banner Heading
                category_id,           // Category ID
                product_id,            // Product ID
                description,           // description
            } = req.body;
            const lang = req.body.language || 'en';
            const language = await languages(lang);
            // Normalize
            const normalizedName = String(banner_heading).trim().toLowerCase();
            const normalizedDesc = String(description).trim();
            // Optional numeric coercion
            const categoryId = category_id ? Number(category_id) : null;
            const productId = product_id ? Number(product_id) : null;

            // Require at least one uploaded file
            const filePath =
                req.files && req.files.length > 0
                    ? `uploads/banner/` + req.files[0].filename
                    : null;

            if (!filePath) {
                return res.send({
                    result: false,
                    message: language.image_upload_failed
                });
            }

            // Admin check (optional user_id support)
            const CheckAdmin = await model.CheckAdminQuery(user_id);
            if (CheckAdmin.length === 0) {
                return res.send({
                    result: false,
                    message: language.Try_with_admin_level_Account
                });
            }

            // Create banner with new fields
            await model.AddBanner({
                banner_name: normalizedName,
                description: normalizedDesc,
                image_path: filePath,
                category_id: categoryId,
                product_id: productId,
                created_by: user_id
            });

            return res.send({
                result: true,
                message: language.banner_added_success
            });
        });
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        });
    }
};
