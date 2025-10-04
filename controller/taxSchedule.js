var model = require('../model/taxSchedule');


module.exports.AddTax = async (req, res) => {
    try {
        const { tx_schedule_id, tx_schedule_name, tx_schedule_tax, tx_schedule_cgst, tx_schedule_igst, tx_schedule_sgst, tx_schedule_vat } = req.body;

        if (!tx_schedule_name) {
            return res.send({
                result: false,
                message: "Tax name is required"
            });
        }

        let result;
        if (tx_schedule_id) {
            // ✅ Update existing Tax
            result = await model.updateTaxQuery(tx_schedule_name, tx_schedule_tax, tx_schedule_cgst, tx_schedule_igst, tx_schedule_sgst, tx_schedule_vat, tx_schedule_id);
            if (result.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Tax updated successfully"
                });
            } else {
                return res.send({
                    result: false,
                    message: "Tax not found or not updated"
                });
            }
        } else {

            const checkTax = await model.GetTaxname(tx_schedule_name);

            if (checkTax.length > 0) {
                return res.send({
                    result: false,
                    message: "This Tax Schedule is already exist",
                });
            }
            // ✅ Insert new Tax
            result = await model.addTaxQuery(tx_schedule_name,tx_schedule_tax, tx_schedule_cgst, tx_schedule_igst, tx_schedule_sgst, tx_schedule_vat, tx_schedule_id);
            if (result.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Tax Schedule added successfully",
                    Tax_id: result.insertId
                });
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add Tax"
                });
            }
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        });
    }
};


module.exports.listTax = async (req, res) => {
    try {

        let listTax = await model.listTaxQuery();
        if (listTax.length > 0) {
            return res.send({
                result: true,
                message: "data retrived",
                list: listTax
            });

        } else {
            return res.send({
                result: false,
                message: "data not found"
            })
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message,
        });


    }
}
module.exports.deleteTax = async (req, res) => {
    try {
        let { tx_schedule_id } = req.body || {};

        if (!tx_schedule_id) {
            return res.send({
                result: false,
                message: "Tax_id is required"
            });
        }

        let result = await model.deleteTaxQuery(tx_schedule_id);

        if (result.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Tax deleted successfully"
            });
        } else {
            return res.send({
                result: false,
                message: "Tax not found"
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};