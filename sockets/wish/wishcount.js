var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);
var { languages } = require("../../languages/languageFunc");


exports = module.exports = function (io) {

    io.sockets.on('connection', function (socket) {
        let user_id = socket.handshake.query.user_id;

        socket.on("wishing", async (data) => {
            var lang = data.lan || "en";
            var language = await languages(lang);
            var wish = data.wish;
            var product_id = data.product_id;
            let checkuser = await CheckUser(user_id);
            if (checkuser.length > 0) {
                let checkproduct = await CheckProduct(product_id);
                if (checkproduct.length > 0) {
                    let checkwish = await CheckWish(product_id, user_id);
                    if (checkwish.length > 0) {
                        if (wish == 0) {
                            let removewish = await RemoveWish(product_id, user_id);
                            io.emit(user_id, {
                                result: true,
                                message: language.Product_removed_from_wishlist,
                            });
                        } else {
                            io.emit(user_id, {
                                result: false,
                                message: language.Product_already_in_wishlist,
                            });
                        }
                    } else {
                        if (wish == 0) {
                            io.emit(user_id, {
                                result: true,
                                message: language.Product_already_removed_wishlist,
                            });
                        } else {
                            let addwish = await AddWish(product_id, user_id);
                            io.emit(user_id, {
                                result: true,
                                message: language.Product_added_to_wishlist,
                            });
                        }
                    }
                } else {
                    io.emit(user_id, {
                        result: false,
                        message: language.Product_not_found,
                    });
                }
            } else {
                io.emit(user_id, {
                    result: false,
                    message: language.user_does_not_exist,
                })

            }
        })
    })
}


var CheckUser = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};
var CheckProduct = async (product_id) => {
    var Query = `select * from bh_products where product_id = ?`;
    var data = query(Query, [product_id]);
    return data;
};

var AddWish = async (product_id, user_id) => {
    var Query = `INSERT INTO bh_wishlist (wish_product_id, wish_user_id)
    VALUES (?,?) `;
    var data = query(Query, [product_id, user_id]);
    return data;
};

var CheckWish = async (product_id, user_id) => {
    var Query = `select * from bh_wishlist where wish_product_id = ? and wish_user_id = ?`;
    var data = query(Query, [product_id, user_id]);
    return data;
};

var RemoveWish = async (product_id) => {
    var Query = `DELETE FROM bh_wishlist where wish_product_id = ?`;
    var data = query(Query, [product_id]);
    return data;
};