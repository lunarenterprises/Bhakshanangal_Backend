var model = require("../model/createbanner");
var { languages } = require("../languages/languageFunc");
const { upload } = require("../components/banner");
const moment = require("moment");
const Uploads = upload.array("image");

module.exports.AddBanner = async (req, res) => {
    try {
        Uploads(req, res, async (err) => {
            const { user_id } = req?.user || req?.headers
            let { banner_name, banner_description, banner_priority } = req.body;
            var lang = req.body.language;
            var language = await languages(lang);
            if (!banner_name || !banner_description) {
                return res.send({
                    result: false,
                    message: language.insufficient_parameters,
                });
            }
            banner_name = banner_name.toLowerCase();
            let filePath =
                req.files && req.files.length > 0
                    ? `uploads/banner/` + req.files[0].filename
                    : null;
            if (filePath == null) {
                return res.send({
                    result: false,
                    message: language.image_upload_failed
                })
            }
            let CheckAdmin = await model.CheckAdminQuery(user_id);
            if (CheckAdmin.length > 0) {
                let CheckCategory = await model.Getbanner(banner_name);
                if (CheckCategory.length > 0) {
                    return res.send({
                        result: false,
                        message: language.banner_already_exist,
                    });
                } else {
                    await model.AddBanner(banner_name, banner_description, filePath, banner_priority);
                    return res.send({
                        result: true,
                        message: language.banner_added_success,
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