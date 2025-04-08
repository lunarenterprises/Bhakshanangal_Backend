var model = require('../model/orderlistDownload')
var moment = require("moment")
var fs = require("fs");
var puppeteer = require("puppeteer");
// var { languages } = require("../languages/languageFunc");

module.exports.orderListDownload = async (req, res) => {
    try {
        let search = req.body.search

        var today = moment().format('MMM_DD_YYYY_hh_mm')
        let serverName = req.protocol + "://" + req.get("host");

        console.log(search, "search");

        let condition = ``
        if (search) {
            condition = `and od.order_status ='${search}'`

        }

        let getOrder = await model.Getorder(condition)
        // console.log(getOrder, "tttttttttt");

        var path1 = `${process.cwd()}/uploads/orderDownload`;
        var path = `${process.cwd()}/uploads/orderDownload/Bhakshanagal${today}.pdf`;
        if (!fs.existsSync(path1)) {
            fs.mkdirSync(path1, true);
        }
        var datahtml = ''
        for (let data of getOrder) {

            // console.log(data, "dataaaaaaaaaaaa");

            datahtml += '<tr>' +
                '<td>' + data.order_id + '</td>' +
                '<td>' + data.user_name + '</td>' +
                '<td>' + data.order_amount + '</td>' +
                '<td>' + data.product_name + '</td>' +
                '<td>' + moment(data.created_at).format('YYYY-MM-DD') + '</td>' +
                '<td>' + data.payment_method + '</td>' +
                '<td>' + data.address_building_name + ',' + data.address_state + ',' + data.address_state + ',' + data.address_city + ',' + data.address_pincode + '</td>' +
                '<td>' + data.status + '</td>' +
                '<td>' + data.delivery_status + '</td>' +
                '</tr>';
        }
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KANNUR DISTRICT PETROLEUM PRODUCT ORDERS</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            font-size: 12px; /* Reduced font size for the body */
        }
        .container {
            width: 90%;
            margin: 10px auto;
            background-color: white;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            font-size: 16px; /* Reduced font size for the header */
        }
        .table-container {
            overflow-x: auto;
            margin-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid #ddd;
            text-align: left;
            font-size: 10px;
            padding: 3px;
        }
        th {
            background-color: #333;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #ddd;
        }
        .status {
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 5px;
            text-align: center;
        }
        .pending {
            color: white;
            background-color: orange;
        }
        .paid {
            color: white;
            background-color: green;
        }
        .delivered {
            color: white;
            background-color: green;
        }
        .not-delivered {
            color: white;
            background-color: orange;
        }

    </style>
</head>
<body>

<div class="container">
    <h1>Product Order</h1>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>User Name</th>
                    <th>Amount</th>
                    <th>Products</th>
                    <th>Oder Date</th>
                    <th>Payment Method</th>
                    <th>Billing Address</th>
                    <th>Payment Status</th>
                    <th>Delivery Status</th>
                </tr>
            </thead>
            <tbody>
                ${datahtml}
            </tbody>
        </table>
    </div>
</div>

</body>
</html>
`
        var pdf = await createPdfWithPuppeteer(html, path, getOrder);

        return res.send({
            result: true,
            message: "data retrieved",
            pdf: `${serverName}/uploads/orderDownload/Bhakshanagal${today}.pdf`,
            data: getOrder
        })




    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message,
        });
    }
}


async function createPdfWithPuppeteer(htmlContent, path) {
    try {
        let browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: "new",
            executablePath: "/usr/bin/chromium-browser"
        });
        let page = await browser.newPage();

        await page.setContent(htmlContent, { "waitUntil": "networkidle0" });

        await page.pdf({
            path: path,
            format: "A4",
            printBackground: true, // Only one instance of this key
            displayHeaderFooter: true,
            // headerTemplate: tournamentss && i_sale_status
            //     ? `<div style="width: 100%; text-align: center; font-weight: bold; margin-bottom: 10px;">
            //             <h2 style="margin: 0; font-size: 18px;">${orderlist[0].tr_name}(${i_sale_status})</h2>
            //        </div>`
            //     : `<div style="width: 100%; text-align: center; font-weight: bold; margin-bottom: 10px;">
            //             <h2 style="margin: 0; font-size: 18px;">${orderlist[0].tr_name}</h2>
            //        </div>`,
            // footerTemplate: "", // Optional, add if you need a footer
            margin: { top: "50px", bottom: "50px" },
        });

        await browser.close();
    } catch (err) {
        console.error("Error_creating_PDF", err);
    }
    return path;
}