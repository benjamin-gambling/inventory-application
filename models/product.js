const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  size: { type: String, required: true, minlength: 4, maxlength: 5 },
  type: { type: String, required: true },
  price: { type: Number, required: true },
});

ProductSchema.virtual("name").get(function () {
  return this.size + " " + this.type;
});

ProductSchema.virtual("url").get(function () {
  return "/shop/product/" + this._id;
});

ProductSchema.virtual("tax").get(function () {
  return this.price * 1.12;
});

module.exports = mongoose.model("Product", ProductSchema);
