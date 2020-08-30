const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ColorSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 15 },
  hex: { type: String, required: true, minlength: 4, maxlength: 7 },
});

ColorSchema.virtual("url").get(function () {
  return "/shop/color/" + this._id;
});

module.exports = mongoose.model("Color", ColorSchema);
