const createError = require('http-errors')
const Products = require('../models/Products.model')
const ProductsDeal = require('../models/Product-deal')
const stripe = require('stripe')(process.env.KEY_SECRET)

module.exports.getBuy = (req, res, next) => {
    Products.find({})
        .then(product => {
            if (!product) {
                next(createError(404, 'Product no found'))
            } else {
                res.status(201).json(product)
            }
        })
        .catch(next)
}

module.exports.buyDetail = (req, res, next) => {
    const { id } = req.params

    Products.findById(id)
        .then((product) => {
            res.status(201).json(product)
        })
        .catch(next)
}

module.exports.filterProduct = (req, res, next) => {
    const { model } = req.query

    Products.find({
        model: {
            $regex: (model),
            $options: 'i'
        }
    })
        .then((products) => {
            res.status(201).json(products)
        })
        .catch(next)
}

module.exports.sellDetail = (req, res, next) => {
    const { id } = req.params

    Products.findById(id)
        .then((product) => {
            res.status(201).json(product)
        })
        .catch(next)
}

module.exports.sellProduct = (req, res, next) => {

    const { brand, model, description, price, image, color, size, user, _id } = req.body

    ProductsDeal.create({
        brand: brand,
        model: model,
        description: description,
        price: price,
        image: image,
        color: color,
        size: size,
        user: user,
        product: _id
    })
        .then((productDeal) => {
            res.status(201).json(productDeal)
        })
        .catch(next)
}

module.exports.buyProduct = (req, res, next) => {
    const { product, size, user} = req.body.params

    ProductsDeal.find({ product: product, size: size }).limit(1)
        .then((sneaker) => {
            console.log(sneaker[0]._id)
            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        amount: sneaker[0].price * 100,
                        currency: 'EUR',
                        name: sneaker[0].model,
                        quantity: 1,
                    }
                ],
                customer_email: user.email,
                mode: 'payment',
                success_url: `http://localhost:3000/successful-pay?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `http://localhost:3000/sneaker-buy/${product}`,
                metadata: {
                    product: sneaker[0]._id.toString()
                }
                
            })
                .then(session => {
                    console.log(session)
                    res.json({
                        sessionId: session.id,
                    });
                })
        })
        .catch((e) => console.log(e))
}

module.exports.webhook = (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_SIGNING_SECRET);
    } catch (err) {
        console.error(err)
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Fulfill the purchase...
        ProductsDeal.findByIdAndUpdate(session.metadata.product, { status: false }, { new: true })
            .then(() => {
                console.log(`Product with id ${session.metadata.product} has been bought`)
                res.status(200)
            })
            .catch(next)
    } else {
        res.status(200)
    }
}