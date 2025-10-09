var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

// ✅ Check if user is admin
module.exports.CheckAdminQuery = async (user_id) => {
  if (!user_id) return [];

  const sql = `
    SELECT * 
    FROM bh_user 
    WHERE user_id = ? 
      AND user_status = 'active' 
      AND user_role = 'admin'
  `;
  const data = await query(sql, [user_id]);
  return data;
};

// ✅ Get banner by ID
module.exports.GetBannerById = async (banner_id) => {
  const sql = "SELECT * FROM bh_banner WHERE banner_id = ?";
  const data = await query(sql, [banner_id]);
  return data;
};
// Update banner (partial update)
module.exports.UpdateBanner = async (banner_id, payload = {}) => {
  try {
    const sets = [];
    const params = [];

    // map request keys => DB columns (no banner_priority here)
    const map = {
      banner_heading: 'banner_heading',
      description: 'description',
      image_path: 'banner_image',
      category_id: 'category_id',
      product_id: 'product_id'
    };

    Object.keys(map).forEach(k => {
      if (payload[k] !== undefined) {
        sets.push(`\`${map[k]}\` = ?`);
        if (k === 'category_id' || k === 'product_id') {
          params.push(payload[k] === null ? null : Number(payload[k]));
        } else {
          params.push(payload[k]);
        }
      }
    });

    if (sets.length === 0) {
      return { affectedRows: 0 };
    }

    // No updated_at push here; removed as requested

    const sql = `
      UPDATE bh_banner
      SET ${sets.join(', ')}
      WHERE banner_id = ?
    `;
    params.push(banner_id);

    return await query(sql, params);
  } catch (err) {
    err.message = `UpdateBanner failed: ${err.message}`;
    throw err;
  }
};

