const createError = require("http-errors");
const ProductsDeal = require("../models/Product-deal");
const PDFDocument = require('pdfkit');
const fs = require('fs');

module.exports.getOrdersBuy = (req, res, next) => {
    const { user } = req.query

    ProductsDeal.find({ bought_by: user })
        .then((orders) => {
            res.json(orders)
        })
        .catch(next)
}

module.exports.getOrderSell = (req, res, next) => {
    const { user } = req.query
    ProductsDeal.find({ user: user })
        .then((orders) => {
            res.json(orders)
        })
        .catch(next)
}

module.exports.getOrder = (req, res, next) => {

    const { id } = req.params
    ProductsDeal.findById(id)
        .then((order) => {
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream('../../../../Downloads/Order.pdf'));

            doc.fontSize(14)
                .text(`Order Number: ${order._id}`)
            doc.fontSize(16)
                .text(`Model: ${order.model}`, 100, 100);
            doc.fontSize(16)
                .text(`Price: ${order.price} €`, 100, 120);
            doc.fontSize(16)
                .text(`Size: ${order.size}`, 100, 140);
            doc.fontSize(16)
                .text(`Address: Paseo de la chopera 14`, 100, 160);
            doc.image('qr.png', {
                fit: [250, 300],
                align: 'center',
                valign: 'center'
            });

            doc.end()
        })
}