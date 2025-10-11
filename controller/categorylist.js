var model = require('../model/categorylist')
var { languages } = require('../languages/languageFunc');

module.exports.CategoryList = async (req, res) => {
    try {
        const lang = req.body.language || 'en';
        let { page = 1, limit = 20, search = '', statusKey } = req.body;
        // Make role optional (no crash if req.user missing)
        const role = (req.user && req.user.role) ? req.user.role : null; // optional role
        // Ensure integers with sane fallbacks
        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 20;
        const offset = (page - 1) * limit;
        const language = await languages(lang);
        // Get total count using same filters (lang, statusKey, search); no LIMIT/OFFSET
        const totalRows = await model.GetCategoryCount(lang, statusKey, search);
        // Get paginated list using same filters and ORDER BY for stable pagination
        const categories = await model.GetCategory(lang, statusKey, offset, limit, search);
        const totalCount = totalRows?.[0]?.total || 0;
        const totalPage = Math.ceil(totalCount / limit);
        // Attach product count
        const data = await Promise.all(categories.map(async (el) => {
            const count = await model.GetProductCategoryCount(el.category_id);
            return {
                ...el,
                product_count: count.length
            };
        }));
        if (data.length > 0) {
            return res.send({
                result: true,
                message: language.data_retrieved,
                page,
                limit,
                totalPage,
                list: data
            });
        } else {
            return res.send({
                result: false,
                message: language.data_not_found
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        });
    }
};
module.exports.SubCategoryList = async (req, res) => {
    try {
        const lang = req.body.language || 'en';
        let { category_id, page = 1, limit = 20, search = '', statusKey } = req.body;
        const role = (req.user && req.user.role) ? req.user.role : 'guest';
        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 20;
        const offset = (page - 1) * limit;
        // For admin or other roles statusKey is accepted as passed

        const language = await languages(lang);

        const totalRowsResult = await model.GetSubCategoryCount(lang, statusKey, category_id, search);
        const totalCount = totalRowsResult?.[0]?.total || 0;

        const getSubCategory = await model.GetSubCategory(lang, statusKey, category_id, search, offset, limit);

        const totalPage = Math.ceil(totalCount / limit);

        const data = await Promise.all(
            getSubCategory.map(async (el) => {
                const count = await model.GetProductSubCategoryCount(el.sc_id);
                return {
                    ...el,
                    category_image: el.sc_image,
                    product_count: count.length
                };
            })
        );

        if (data.length > 0) {
            return res.send({
                result: true,
                message: language.data_retrieved,
                page,
                limit,
                totalPage,
                totalCount,
                list: data
            });
        } else {
            return res.send({
                result: false,
                message: language.data_not_found,
                page,
                limit,
                totalPage,
                totalCount,
                list: []
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        });
    }
};

