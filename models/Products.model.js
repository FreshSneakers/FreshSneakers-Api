const mongoose = require("mongoose");
const ProductsDeal = require("./Product-deal");

const productSchema = mongoose.Schema({
    brand: {
      type: String,
      require: "Brand is required",
    },
    model: {
      type: String,
      require: "Model is required",
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      require: "Price is required",
    },
    image: {
      type: String,
      validate: {
        validator: (value) => {
          try {
            const url = new URL(value);
            //Validamos si es protocolo http o https, si no lo es, no es una imagen
            return url.protocol === "http:" || url.protocol === "https:";
          } catch (err) {
            return false;
          }
        },
        message: () => "Invalid image URL",
      },
    },
    color: {
      type: String,
    },
    sizes : []
  })

  productSchema.virtual('ProductDeal', {
    ref: ProductsDeal.modelName,
    localField:'_id',
    foreignField: 'product'
  })

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
