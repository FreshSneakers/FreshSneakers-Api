const createError = require("http-errors");
const Products = require("../models/Products.model");
const ProductsDeal = require("../models/Product-deal");
const stripe = require('stripe')(process.env.KEY_SECRET)

module.exports.getBuy = (req, res, next) => {

  const { brand, price } = req.query
  console.log(price);

  if (brand.length > 0 && price.length > 0) {
    Products.find({ brand: brand }).sort({ price: price })
      .then((product) => {
        if (!product) {
          next(createError(404, "Product no found"));
        } else {
          res.status(201).json(product);
        }
      })
      .catch(next);
  } else if (price.length > 0 && price === 'Relevance') {
    Products.find({})
      .then((product) => {
        if (!product) {
          next(createError(404, "Product no found"));
        } else {
          res.status(201).json(product);
        }
      })
      .catch(next);
  }else if (brand.length > 0) {
    Products.find({ brand: brand })
      .then((product) => {
        if (!product) {
          next(createError(404, "Product no found"));
        } else {
          res.status(201).json(product);
        }
      })
      .catch(next);
  } else if (price.length > 0) {
    Products.find({}).sort({ price: price })
      .then((product) => {
        if (!product) {
          next(createError(404, "Product no found"));
        } else {
          res.status(201).json(product);
        }
      })
      .catch(next);
  } else {
    Products.find({})
      .then((product) => {
        if (!product) {
          next(createError(404, "Product no found"));
        } else {
          res.status(201).json(product);
        }
      })
      .catch(next);
  }

};

module.exports.buyDetail = (req, res, next) => {
  const { id } = req.params;
  let sizes = []
  let sibd = []
  Products.findById(id)
    .then((product) => {
      return ProductsDeal.find({ product: product.id, status: true })
        .then((productDeal) => {
          for (i = 0; i < productDeal.length; i++) {
            sizes.push(productDeal[i].size)
          }
        })
        .then(() => {
          sibd = [...new Set(sizes)];
          console.log(id)
         return Products.findByIdAndUpdate(id, { sizes: sibd }, { new: true })
            .then(() => res.json(product))
        })
    })
    .catch(next);
};

module.exports.filterSize = (req, res, next) => {
  const { id } = req.params

  Products.findById(id)
    .then((response) => {
      res.status(201).json(response)
    })
}

module.exports.filterProduct = (req, res, next) => {
  const { model } = req.query;

  Products.find({
    model: {
      $regex: model,
      $options: "i",
    },
  })
    .then((products) => {
      res.status(201).json(products);
    })
    .catch(next);
};

module.exports.sellDetail = (req, res, next) => {
  const { id } = req.params;

  Products.findById(id)
    .then((product) => {
      res.status(201).json(product);
    })
    .catch(next);
};

module.exports.sellProduct = (req, res, next) => {
  const {
    brand,
    model,
    description,
    price,
    image,
    color,
    size,
    user,
    _id,
  } = req.body;

  ProductsDeal.create({
    brand: brand,
    model: model,
    description: description,
    price: price,
    image: image,
    color: color,
    size: size,
    user: user,
    product: _id,
  })
    .then((productDeal) => {
      res.status(201).json(productDeal);
    })
    .catch(next);
};

module.exports.buyProduct = (req, res, next) => {
  const { product, size, user } = req.body.params;
  ProductsDeal.find({ product: product, size: size, status: true }).limit(1)
    .then((sneaker) => {
      console.log(sneaker)
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
        success_url: `${process.env.CORS_ORIGIN || `http://localhost:${3000}/api`}/successful-pay?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CORS_ORIGIN || `http://localhost:${3000}/api`}/sneaker-buy/${product}`,
        metadata: {
          product: sneaker[0]._id.toString(),
          bought_by_id: user.id
        }

      })
        .then(session => {
          res.json({
            sessionId: session.id,
          });
        })
    })
    .catch((e) => console.log(e))
}

module.exports.webhook = (req, res, next) => {
  console.log('webhook')
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_SIGNING_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Fulfill the purchase...
    ProductsDeal.findByIdAndUpdate(session.metadata.product, { status: false }, { new: true })
      .then(() => {
        res.status(200)
        ProductsDeal.findByIdAndUpdate(session.metadata.product, { bought_by: session.metadata.bought_by_id }, { new: true })
          .then(() => {
            res.status(200)
          })
      })
      .catch(next)
  } else {
    res.status(200)
  }
}

module.exports.filterProductBuy = (req, res, next) => {
  const { brand, price } = req.query;

  Products.find({
    brand: {
      $regex: brand,
      $options: "i",
    },
    price: {
      $regex: price,
    },
  })
    .then((products) => {
      res.status(201).json(products);
    })
    .catch(next);
};

