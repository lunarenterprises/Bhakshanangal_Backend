var model = require('../model/categorylist')
var { languages } = require('../languages/languageFunc');

module.exports.CategoryList = async (req, res) => {
    try {
        const lang = req.body.language || 'en';
        let { page = 1, limit = 20, search = '' } = req.body;

        // Ensure page and limit are integers
        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;

        const language = await languages(lang);

        // Get total category count with search
        const getTotalCategory = await model.GetCategoryCount(search); // update model to accept search
        const categoryCount = getTotalCategory.length;

        const totalPage = Math.ceil(categoryCount / limit);

        // Get paginated categories with search
        const getCategory = await model.GetCategory(lang, offset, limit, search); // update model to accept search

        // Attach product count for each category
        const data = await Promise.all(getCategory.map(async (el) => {
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
        let { category_id, page = 1, limit = 20, search = '' } = req.body;

        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const language = await languages(lang);

        // Get total subcategory count with search
        const getTotalSubCategory = await model.GetSubCategoryCount(lang, search); // Update model to support search
        const totalCount = getTotalSubCategory.length;
        const totalPage = Math.ceil(totalCount / limit);

        // Get paginated subcategories with search
        const getSubCategory = await model.GetSubCategory(lang, category_id, search, offset, limit); // Update model to accept pagination & search

        // Attach product count for each subcategory
        const data = await Promise.all(getSubCategory.map(async (el) => {
            const count = await model.GetProductSubCategoryCount(el.sc_id);
            return {
                ...el,
                category_image: el.sc_image,
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
