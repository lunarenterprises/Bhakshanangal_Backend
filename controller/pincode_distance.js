var pin = require('pincode')
var moment = require('moment');

module.exports.Pincode_validation = async (req, res) => {
    console.log(req.body);
    let { pincode } = req.body
    if (!pincode) {
        return res.send({
            result: false,
            message: language.insufficient_parameters,
        });
    }
    var output = {}
    var time = moment();

    pin.seachByPin(pincode, function (response) {
        try {
          
        response.forEach(function (data) {
            console.log(data);
            if (data) {
                if (data.StateName == 'KERALA') {
                    if (data.DistrictName == 'Thiruvananthapuram') {
                        var timecheck = time.isAfter(moment('18:00', 'HH:mm'));
                        var subtime = moment().subtract(1, 'hour');
                        var timechecks = subtime.isAfter(moment('17:00', 'HH:mm'));
                        if (timecheck && timechecks) {
                            var nextday = moment().add(1, 'day').format('DD MMM, dddd');
                            output = {
                                result: true,
                                message: `Delivery by ${nextday}`
                            }

                        } else {
                            var nextdays = moment().format('DD MMM, dddd');
                            output = {
                                result: true,
                                message: `Delivery by ${nextdays}`
                            }
                        }
                    } else {
                        var Oneday = moment().add(1, 'day').format('DD MMM, dddd');
                        output = {
                            result: true,
                            message: `Delivery by ${Oneday}`
                        }
                    }
                } else {
                    var threeday = moment().add(3, 'day').format('DD MMM, dddd');
                    output = {
                        result: true,
                        message: `Delivery by ${threeday}`
                    }
                }
            } else {
                output = {
                    result: false,
                    message: `delivery not available at this pincode`
                }
            }
        });
        return res.send(output)
    } catch (error) {
        output = {
            result: false,
            message: `Not a valid pincode`
        }
        return res.send(output)
    }

    })


}

