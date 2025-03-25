var model = require("../model/editprofile");
var { languages } = require("../languages/languageFunc");
const { checkUser } = require("../model/addCart");
var bcrypt = require("bcrypt");

module.exports.EditProfile = async (req, res) => {
  try {
    var lang = req.body.language;
    var language = await languages(lang);
    let user_id = req.headers.user_id;
    let FirtsName = req.body.first_name;
    let LastName = req.body.last_name;
    let email = req.body.email;
    let address = req.body.address;
    let current_password = req.body.current_password;
    let new_password = req.body.new_password;
    let confirm_password = req.body.confirm_password;
    let CheckUser = await model.CheckUserQuery(user_id);
    if (checkUser.length > 0) {
      let condition = ``;
      if (FirtsName) {
        if (condition !== "") {
          condition += `,user_name = '${FirtsName}'`;
        } else {
          condition = `set user_name = '${FirtsName}'`;
        }
      }
      if (LastName) {
        if (condition !== "") {
          condition += `,user_last_name = '${LastName}'`;
        } else {
          condition = `set user_last_name  = '${LastName}'`;
        }
      }
      if (email) {
        if (condition !== "") {
          condition += `,user_email = '${email}'`;
        } else {
          condition = `set user_email = '${email}'`;
        }
      }
      var UpdateUser = await model.UpdateUserQuery(user_id, condition);
      let conditions = ``;

      if (address.building_name !== "" && address.building_name !== undefined) {
        if (conditions !== "") {
          conditions += `,address_building_name = '${address.building_name}'`;
        } else {
          conditions = `set address_building_name = '${address.building_name}'`;
        }
      }
      if (address.area_name !== "" && address.area_name !== undefined) {
        if (conditions !== "") {
          conditions += `,address_area_name = '${address.area_name}'`;
        } else {
          conditions = `set address_area_name = '${address.area_name}'`;
        }
      }
      if (address.landmark !== "" && address.landmark !== undefined) {
        if (conditions !== "") {
          conditions += `,address_landmark = '${address.landmark}'`;
        } else {
          conditions = `set address_landmark = '${address.landmark}'`;
        }
      }
      if (address.city !== "" && address.city !== undefined) {
        if (conditions !== "") {
          conditions += `,address_city = '${address.city}'`;
        } else {
          conditions = `set address_city = '${address.city}'`;
        }
      }
      if (address.state !== "" && address.state !== undefined) {
        if (conditions !== "") {
          conditions += `,address_state = '${address.state}'`;
        } else {
          conditions = `set address_state = '${address.state}'`;
        }
      }
      if (address.pincode !== "" && address.pincode !== undefined) {
        if (conditions !== "") {
          conditions += `,address_pincode = '${address.pincode}'`;
        } else {
          conditions = `set address_pincode = '${address.pincode}'`;
        }
      }

      if (address.address_id && conditions) {
        var Update_Address = await model.UpdateAddressQuery(
          address.address_id,
          conditions
        );
      }

      if (current_password !== "" && current_password !== undefined) {
        let Checkpassword = await bcrypt.compare(
          current_password,
          CheckUser[0].user_password
        );
        if (Checkpassword == true) {
          if (new_password == "" || new_password == undefined) {
            return res.send({
              result: false,
              message: language.enter_a_new_password,
            });
          }
          if (new_password == confirm_password) {
            var hashedPassword = await bcrypt.hash(new_password, 10);
            await model.ChangepasswordQuery(user_id, hashedPassword);
          } else {
            return res.send({
              result: false,
              message:
                language.new_password_and_confirm_password_does_not_match,
            });
          }
        } else {
          return res.send({
            result: false,
            message: language.wrong_password,
          });
        }
      }

      return res.send({
        result: true,
        message: language.Data_successfully_updated,
      });
    } else {
      return res.send({
        result: false,
        message: language.user_does_not_exist,
      });
    }
  } catch(error) {
    console.log(error);
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
