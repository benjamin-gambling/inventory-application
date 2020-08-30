const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BottleSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
  inventory: { type: Number, required: true, min: 0 },
  file: { type: String, required: true },
});

BottleSchema.virtual("url").get(function () {
  return "/shop/bottle/" + this._id;
});

module.exports = mongoose.model("Bottle", BottleSchema);
