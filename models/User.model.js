const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: "Name is required",
      trim: true,
    },
    email: {
      unique: true,
      type: String,
      require: "Email is required",
      match: [EMAIL_PATTERN, "Email is not valid"],
    },
    password: {
      type: String,
      require: "Password is required",
      match: [PASSWORD_PATTERN, "Password is not valid"],
    },
    address: {
      type: String,
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
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hasheamos la contraseña con bcrypt
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, SALT_WORK_FACTOR).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});
//Comparamos los dos passwords
userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
