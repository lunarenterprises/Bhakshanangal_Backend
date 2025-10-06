var model = require('../model/categorylist')
var { languages } = require('../languages/languageFunc');

module.exports.CategoryList = async (req, res) => {
    try {
        const lang = req.body.language || 'en';
        let { page = 1, limit = 20, search = '' } = req.body;
        let { role } = req.user

        // Ensure page and limit are integers
        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;

        let status = ''

        if (role == 'user') {
            status = `WHERE category_status = '1'`
        }

        const language = await languages(lang);

        // Get total category count with search
        const getTotalCategory = await model.GetCategoryCount(search); // update model to accept search

        // Get paginated categories with search
        const getCategory = await model.GetCategory(lang, status, offset, limit, search); // update model to accept search

        const categoryCount = getCategory.length;
        const totalPage = Math.ceil(categoryCount / limit);

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
        let { role } = req.user
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        console.log("rrrr", req.user);

        let status = ''

        if (role == 'user') {
            status = `WHERE sc.sc_status = '1'`
        }

        const language = await languages(lang);

        // Get total subcategory count with search
        const getTotalSubCategory = await model.GetSubCategoryCount(lang, search); // Update model to support search


        // Get paginated subcategories with search
        const getSubCategory = await model.GetSubCategory(lang, status, category_id, search, offset, limit); // Update model to accept pagination & search

        const totalCount = getSubCategory.length;
        const totalPage = Math.ceil(totalCount / limit);

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
