const mongoose = require("mongoose");
require('./User.model')
const CARD_PATTERN = /^3[47][0 - 9]{ 13}$/

const productsDeal = mongoose.Schema({
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
    size: {
        type: Number,
        require: 'Size is required'
    },
    card: {
        type: Number,
        require: 'Card is required'
    },
    status:{
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: 'A user needs to be referenced',
        ref: 'User'
    },
},
    {
        timestamps: true,
    }

)

const ProductsDeal = mongoose.model("ProductsDeal", productsDeal)

module.exports = ProductsDeal