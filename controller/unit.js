var model = require('../model/unit');


module.exports.AddUnit = async (req, res) => {
    try {
        const { unit_id, unit_name } = req.body;

        if (!unit_name) {
            return res.send({
                result: false,
                message: "Unit name is required"
            });
        }

        let result;
        if (unit_id) {
            // ✅ Update existing unit
            result = await model.updateUnitQuery(unit_id, unit_name);
            if (result.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Unit updated successfully"
                });
            } else {
                return res.send({
                    result: false,
                    message: "Unit not found or not updated"
                });
            }
        } else {

            const checkunit = await model.GetUnitname(unit_name);

            if (checkunit.length > 0) {
                return res.send({
                    result: false,
                    message: "This unit already exist",
                });
            }
            // ✅ Insert new unit
            result = await model.addUnitQuery(unit_name);
            if (result.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Unit added successfully",
                    unit_id: result.insertId
                });
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add unit"
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


module.exports.listUnit = async (req, res) => {
    try {

        let listUnit = await model.listUnitQuery();
        if (listUnit.length > 0) {
            return res.send({
                result: true,
                message: "data retrived",
                list: listUnit
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
module.exports.deleteUnit = async (req, res) => {
    try {
        let { Unit_id } = req.body || {};

        if (!Unit_id) {
            return res.send({
                result: false,
                message: "Unit_id is required"
            });
        }

        let result = await model.deleteUnitQuery(Unit_id);

        if (result.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Unit deleted successfully"
            });
        } else {
            return res.send({
                result: false,
                message: "Unit not found"
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};