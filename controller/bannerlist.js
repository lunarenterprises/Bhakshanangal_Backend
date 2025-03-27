var model = require("../model/bannerlist");
var { languages } = require("../languages/languageFunc");

module.exports.BannerList = async (req, res) => {
    try {
        var lang = req.body.language;
        var language = await languages(lang);

        let getBanner = await model.GetBanner()
        var carousel = []
        var banner = []
        getBanner.forEach(element => {
            if (element.banner_priority == '' || element.banner_priority == null) {
                banner.push(element)
            } else {
                carousel.push(element)
            }
            element.banner_image =  element.banner_image
        });
        if (getBanner.length > 0) {
            return res.send({
                result: true,
                message: language.data_retrieved,
                carousel: carousel,
                banner: banner,
            })
        } else {
            return res.send({
                result: false,
                message: language.Data_not_found
            })
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}