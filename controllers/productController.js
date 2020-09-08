const Product = require("../models/product");
const Bottle = require("../models/bottle");
const Color = require("../models/color");

const async = require("async");
const validator = require("express-validator");

// DISPLAY LIST OF BOTTLES THAT COME IN SELECTED TYPE OR SIZE
exports.product_select = (req, res) => {
  console.log(req.params);
  res.send(`NA: LIST OF BOTTLES BY TYPE w/ PARAMS: ${req.params.filter}`);
};

/// CREATE ///
// GET - COLOR CREATE PAGE - ADMIN ONLY
exports.product_create_get = (req, res, next) =>
  res.render("product/form", { title: "ADD PRODUCT", class: "form" });

// POST - COLOR CREATE PAGE - ADMIN ONLY
exports.product_create_post = [
  validator
    .body("size", "Size is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  validator.body("type", "Type is required").trim().isLength({ min: 1 }),

  validator.body("price", "Price is required").trim().isNumeric().escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    const product = new Product({
      size: req.body.size,
      type: req.body.type,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      res.render("/product/form", {
        title: "ADD PRODUCT",
        product: product,
        errors: errors.array(),
      });

      return;
    } else {
      Product.findOne({
        size: req.body.size,
        type: req.body.type,
      }).exec((err, found_product) => {
        if (err) return next(err);
        if (found_product) {
          res.redirect("/shop/admin");
        } else {
          product.save((err) => {
            if (err) return next(err);
            async.parallel(
              {
                bottle_list: (callback) =>
                  Bottle.find(callback).populate("product").populate("color"),
                product_list: (callback) => Product.find(callback),
                color_list: (callback) => Color.find(callback),
              },
              (err, results) => {
                if (err) return next(err);

                res.render("admin", {
                  title: "Admin",
                  bottle_list: results.bottle_list,
                  product_list: results.product_list,
                  color_list: results.color_list,
                  class: "admin",
                  admin: true,
                });
              }
            );
          });
        }
      });
    }
  },
];

/// UPDATE ///
// GET - COLOR UPDATE PAGE - ADMIN ONLY
exports.product_update_get = (req, res, next) => {
  Product.findById(req.params.id).exec((err, prod) => {
    if (err) return next(err);
    if (prod === null) {
      let err = new Error("Product not found");
      err.status = 404;
      return next(err);
    }
    res.render("product/form", {
      title: "UPDATE PRODUCT",
      product: prod,
      class: "form",
    });
  });
};

// POST - PRODUCT UPDATE PAGE - ADMIN ONLY
exports.product_update_post = [
  validator
    .body("size", "Size is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator.body("type", "Type is required").trim().isLength({ min: 1 }),
  validator.body("price", "Price is required").trim().isNumeric().escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    const product = new Product({
      _id: req.params.id,
      size: req.body.size,
      type: req.body.type,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      res.redirect(`/shop/product/${req.params.id}/update`);
    } else {
      Product.findByIdAndUpdate(req.params.id, product, {}, (err) => {
        if (err) return next(err);
        async.parallel(
          {
            bottle_list: (callback) =>
              Bottle.find(callback).populate("product").populate("color"),
            product_list: (callback) => Product.find(callback),
            color_list: (callback) => Color.find(callback),
          },
          (err, results) => {
            if (err) return next(err);

            res.render("admin", {
              title: "Admin",
              bottle_list: results.bottle_list,
              product_list: results.product_list,
              color_list: results.color_list,
              class: "admin",
              admin: true,
            });
          }
        );
      });
    }
  },
];

// DELETE PRODUCT
exports.product_delete = (req, res, next) => {
  async.parallel(
    {
      product: (callback) => Product.findById(req.params.id).exec(callback),
      bottles: (callback) =>
        Bottle.find({ product: req.params.id }).exec(callback),
    },
    (err, results) => {
      if (err) return next(err);

      if (results.product === null) {
        const err = new Error("PRODUCT NOT FOUND");
        err.status = 404;
        return next(err);
      }

      if (results.bottles.length > 0) {
        const err = new Error(
          "This product is in use, please delete all relevant bottles to continue!"
        );
        return next(err);
      }

      Product.findByIdAndDelete(req.params.id, (err) => {
        if (err) return next(err);
      });
      async.parallel(
        {
          bottle_list: (callback) =>
            Bottle.find(callback).populate("product").populate("color"),
          product_list: (callback) => Product.find(callback),
          color_list: (callback) => Color.find(callback),
        },
        (err, results) => {
          if (err) return next(err);

          res.render("admin", {
            title: "Admin",
            bottle_list: results.bottle_list,
            product_list: results.product_list,
            color_list: results.color_list,
            class: "admin",
            admin: true,
          });
        }
      );
    }
  );
};
