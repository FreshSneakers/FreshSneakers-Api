const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    brand: {
      type: String,
      require: "Name is required",
    },
    model: {
      type: String,
      require: "Email is required",
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      require: "Address is required",
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
    size: {
      type: Number,
      require: "Address is required",
    },
    color: {
      type: String,
    },
  })

const Products = mongoose.model("Products", userSchema);

module.exports = Products;
