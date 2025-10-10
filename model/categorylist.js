var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
  var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
  var data = query(Query, [user_id]);
  return data;
};

module.exports.GetCategory = async (lang, statusKey, offset = 0, limit = 20, search = '') => {
  console.log("Status Key: ", lang);
  // Whitelist status keys to safe SQL fragments
  const allowedStatusMap = {
    active: 'pc.category_status = 1',
    inactive: 'pc.category_status = 0',
    all: null
  };
  const statusClause = allowedStatusMap[statusKey] || null;

  let Query = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY pc.category_id DESC) + ? AS sn,
      pc.category_id,
      ct.ct_language_name AS category_name,
      pc.category_image,
      pc.category_status
    FROM bh_category_translation ct
    INNER JOIN bh_product_categories pc ON ct.ct_c_id = pc.category_id
    INNER JOIN bh_languages l ON ct.ct_language_id = l.language_id
    WHERE 1=1
      AND l.language_code = ?
  `;

  const params = [Number(offset), lang];

  // Optional status filter
  if (statusClause) {
    Query += ` AND ${statusClause}`;
  }

  // Add search filter if provided
  if (search && search.trim() !== '') {
    Query += ` AND ct.ct_language_name LIKE ?`;
    params.push(`%${search}%`);
  }

  // Deterministic order for stable pagination
  Query += ` ORDER BY pc.category_id DESC`;

  // Pagination
  if (limit && Number(limit) > 0) {
    Query += ` LIMIT ? OFFSET ?`;
    // For mysql2 .query use numbers; for .execute consider strings
    params.push(Number(limit), Number(offset || 0));
  }

  const data = await query(Query, params);
  return data;
};


module.exports.GetProductCategoryCount = async (category_id) => {
  var Query = `select * from bh_products where category_id = ?`;
  var data = query(Query, [category_id]);
  return data;
};

// Returns total rows matching filters for accurate pagination
module.exports.GetCategoryCount = async (lang, statusKey = 'all', search = '') => {
  // Map allowed status keys to safe SQL fragments
  const allowedStatusMap = {
    active: 'pc.category_status = 1',
    inactive: 'pc.category_status = 0',
    all: null
  };
  const statusClause = allowedStatusMap[statusKey] || null;

  let Query = `
    SELECT COUNT(DISTINCT pc.category_id) AS total
    FROM bh_category_translation ct
    INNER JOIN bh_product_categories pc
      ON ct.ct_c_id = pc.category_id
    INNER JOIN bh_languages l
      ON ct.ct_language_id = l.language_id
    WHERE 1=1
      AND l.language_code = ?
  `;
  const params = [lang];

  if (statusClause) {
    Query += ` AND ${statusClause}`;
  }

  if (search && search.trim() !== '') {
    // match translated category name
    Query += ` AND ct.ct_language_name LIKE ?`;
    params.push(`%${search}%`);
  }

  // Optional: if there is a soft delete flag, include it here, e.g.
  // Query += ` AND pc.deleted_at IS NULL`;

  const data = await query(Query, params);
  return data;
};
module.exports.GetSubCategory = async (
  lang,
  statusCondition,
  category_id = null,
  search = '',
  offset = 0,
  limit = 10
) => {
  try {
    const allowedStatusMap = {
      'active': 'sc.sc_status = 1',
      'inactive': 'sc.sc_status = 0',
      'all': null
    };
    const statusClause = statusCondition && allowedStatusMap[statusCondition] ? allowedStatusMap[statusCondition] : null;

    let Query = `
      SELECT 
          ROW_NUMBER() OVER (ORDER BY sc.sc_id DESC) + ? AS sn,
          sc.sc_id, 
          sc.sc_category_id,
          sct.sct_language_name AS sc_name, 
          sc.sc_image, 
          sc.sc_status, 
          c.ct_language_name AS category_name
      FROM bh_subcategory_translation sct
      INNER JOIN bh_product_sub_categories sc 
          ON sct.sct_c_id = sc.sc_id
      INNER JOIN bh_category_translation c 
          ON sc.sc_category_id = c.ct_c_id 
         AND c.ct_language_id = sct.sct_language_id
      INNER JOIN bh_languages l 
          ON sct.sct_language_id = l.language_id
      WHERE 1=1
        AND l.language_code = ?
    `;

    const params = [Number(offset), lang];

    if (statusClause) {
      Query += ` AND ${statusClause}`;
    }

    if (category_id !== null && category_id !== undefined) {
      Query += ` AND sc.sc_category_id = ?`;
      params.push(category_id);
    }

    if (search && search.trim() !== '') {
      Query += ` AND sct.sct_language_name LIKE ?`;
      params.push(`%${search}%`);
    }

    Query += ` ORDER BY sc.sc_id DESC`;

    if (limit && Number(limit) > 0) {
      Query += ` LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset || 0)); // .query expects numbers
    }

    const data = await query(Query, params);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports.GetSubCategoryCount = async (
  lang,
  statusCondition = 'all',
  category_id = null,
  search = ''
) => {
  const allowedStatusMap = {
    'active': 'sc.sc_status = 1',
    'inactive': 'sc.sc_status = 0',
    'all': null
  };
  const statusClause = statusCondition && allowedStatusMap[statusCondition] ? allowedStatusMap[statusCondition] : null;

  let Query = `
    SELECT COUNT(*) AS total
    FROM bh_subcategory_translation sct
    INNER JOIN bh_product_sub_categories sc 
      ON sct.sct_c_id = sc.sc_id
    INNER JOIN bh_category_translation c 
      ON sc.sc_category_id = c.ct_c_id 
     AND c.ct_language_id = sct.sct_language_id
    INNER JOIN bh_languages l 
      ON sct.sct_language_id = l.language_id
    WHERE 1=1
      AND l.language_code = ?
  `; // language filter applied consistently [web:17][web:29]

  const params = [lang];

  if (statusClause) {
    Query += ` AND ${statusClause}`;
  }

  if (category_id !== null && category_id !== undefined) {
    Query += ` AND sc.sc_category_id = ?`;
    params.push(category_id);
  }

  if (search && search.trim() !== '') {
    Query += ` AND sct.sct_language_name LIKE ?`;
    params.push(`%${search}%`);
  }

  const data = await query(Query, params);
  return data;
};
module.exports.GetProductSubCategoryCount = async (category_id) => {
  var Query = `select * from bh_products where sub_category_id = ?`;
  var data = query(Query, [category_id]);
  return data;
};