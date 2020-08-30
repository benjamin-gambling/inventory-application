require("dotenv").config();

const Bottle = require("../models/bottle");
const Product = require("../models/product");
const Color = require("../models/color");

const validator = require("express-validator");
const async = require("async");

const tools = require("../public/javascripts/tools.js");

// HOME PAGE
exports.index = (req, res) => {
  res.render("index", { title: "Home", class: "home" });
};

// ADMIN PAGE
exports.admin = (req, res, next) => {
  if (tools.adminLoggedIn) {
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
          class: "admin",
          admin: tools.adminLoggedIn,
          bottle_list: results.bottle_list,
          product_list: results.product_list,
          color_list: results.color_list,
        });
      }
    );
  } else {
    res.render("admin", {
      title: "Admin",
      class: "admin",
      admin: tools.adminLoggedIn,
    });
  }
};

//LOG IN ??????
exports.admin_login = [
  validator
    .check("password", "Incorrect Password!")
    .trim()
    .custom((value, { req }) => {
      return value === process.env.ADMIN_PASSWORD ? true : false;
    }),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      res.render("admin", {
        title: "Admin",
        class: "admin",
        admin: false,
        errors: errors.array(),
      });
    } else {
      async.parallel(
        {
          bottle_list: (callback) =>
            Bottle.find(callback).populate("product").populate("color"),
          product_list: (callback) => Product.find(callback),
          color_list: (callback) => Color.find(callback),
        },
        (err, results) => {
          if (err) return next(err);

          tools.adminLoggedIn = true;

          res.render("admin", {
            title: "Admin",
            bottle_list: results.bottle_list,
            product_list: results.product_list,
            color_list: results.color_list,
            class: "admin",
            admin: tools.adminLoggedIn,
          });
        }
      );
    }
  },
];
// BOTTLE LIST
exports.bottle_list = (req, res, next) => {
  async.parallel(
    {
      bottle_list: (callback) =>
        Bottle.find(callback).populate("product").populate("color"),
      product_list: (callback) => Product.find(callback),
    },
    (err, results) => {
      if (err) return next(err);

      const groupByProduct = results.bottle_list.reduce((acc, val) => {
        acc[val.product._id] = (acc[val.product._id] || []).concat(val);
        return acc;
      }, {});

      let data = [];

      results.product_list.forEach((product) => {
        let key = groupByProduct[product._id];
        if (key !== undefined) {
          let options = [];
          let altproduct = { ...product._doc };

          key.forEach((style) => {
            let obj = {
              name: style.color.name,
              hex: style.color.hex,
              unique_id: style._id,
              url: style.file,
              stock: style.inventory,
            };
            options.push(obj);
          });

          altproduct.options = options;
          data.push(altproduct);
        }
      });

      res.render("bottle/bottle", {
        title: "All",
        bottle_list: groupByProduct,
        product_list: results.product_list,
        data: data,
      });
    }
  );
};

// BOTTLE DETAIL
exports.bottle_detail = (req, res, next) => {
  Bottle.findById(req.params.id)
    .populate("color")
    .populate("product")
    .exec((err, bottle) => {
      if (err) return next(err);
      let instock;
      bottle.inventory !== 0 ? (instock = true) : (instock = false);
      res.render("bottle/detail", {
        title: "Detail",
        bottle: bottle,
        instock: instock,
        class: "detail",
      });
    });
};

// BOTTLE BUY
exports.bottle_buy = [
  validator
    .body("number", "Positive Number Only!")
    .isNumeric()
    .trim()
    .escape()
    .toInt(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      res.redirect(`/shop/bottle/${req.params.id}`);
      return;
    } else {
      Bottle.findById(req.params.id).exec((err, result) => {
        if (err) return next(err);

        if (result.inventory - req.body.number >= 0) {
          result.inventory = result.inventory - req.body.number;
          result.save((err) => next(err));
        }

        res.redirect(`/shop/bottle/${req.params.id}`);
      });
    }
  },
];

/// CREATE ///
// GET - BOTTLE CREATE PAGE - ADMIN ONLY
exports.bottle_create_get = (req, res) => {
  async.parallel(
    {
      bottle_list: (callback) =>
        Bottle.find(callback).populate("product").populate("color"),
      product_list: (callback) => Product.find(callback),
      color_list: (callback) => Color.find(callback),
    },
    (err, results) => {
      if (err) return next(err);

      res.render("bottle/form", {
        title: "ADD BOTTLE",
        bottle_list: results.bottle_list,
        product_list: results.product_list,
        color_list: results.color_list,
        class: "form",
      });
    }
  );
};

// POST - BOTTLE CREATE PAGE - ADMIN ONLY
exports.bottle_create_post = [
  validator
    .body("product", "Product is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator
    .body("color", "Color is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator
    .body("inventory", "Product inventory is required")
    .trim()
    .isNumeric()
    .escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    const file_url = `images/${req.file.filename}`;

    const bottle = new Bottle({
      product: req.body.product,
      color: req.body.color,
      inventory: req.body.inventory,
      file: file_url,
    });

    if (!errors.isEmpty()) {
      res.render("bottle/form", {
        title: "ADD BOTTLE",
        bottle: bottle,
        class: "form",
        errors: errors.array(),
      });
      return;
    } else {
      Bottle.findOne({
        product: req.body.product,
        color: req.body.color,
      }).exec((err, found_bottle) => {
        if (err) return next(err);
        if (found_bottle) {
          res.redirect(found_bottle.url);
        } else {
          bottle.save((err) => {
            if (err) return next(err);
            res.redirect(bottle.url);
          });
        }
      });
    }
  },
];

/// UPDATE ///
// GET - BOTTLE UPDATE PAGE - ADMIN ONLY
exports.bottle_update_get = (req, res, next) => {
  async.parallel(
    {
      bottle: (callback) =>
        Bottle.findById(req.params.id)
          .populate("product")
          .populate("color")
          .exec(callback),
      product_list: (callback) => Product.find(callback),
      color_list: (callback) => Color.find(callback),
    },
    (err, results) => {
      if (err) return next(err);
      if (results.bottle === null) {
        let err = new Error("Bottle not found!");
        err.status = 404;
        return next(err);
      }
      res.render("bottle/form", {
        title: "UPDATE BOTTLE",
        bottle: results.bottle,
        product_list: results.product_list,
        color_list: results.color_list,
        class: "form",
      });
    }
  );
};

// POST - BOTTLE UPDATE PAGE - ADMIN ONLY
exports.bottle_update_post = [
  validator
    .body("product", "Product is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator
    .body("color", "Color is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator
    .body("inventory", "Product inventory is required")
    .trim()
    .isNumeric()
    .escape(),
  validator.body("image"),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      res.redirect(`/shop/bottle/${req.params.id}/update`);
    } else {
      Bottle.findById(req.params.id).exec((err, found_bottle) => {
        if (err) return next(err);

        const bottle = new Bottle({
          _id: req.params.id,
          product: req.body.product,
          color: req.body.color,
          inventory: req.body.inventory,
          file:
            req.file !== undefined
              ? `images/${req.file.filename}`
              : found_bottle.file,
        });

        if (found_bottle.length) {
          res.redirect("/shop/admin");
        } else {
          Bottle.findByIdAndUpdate(req.params.id, bottle, {}, (err, bottle) => {
            if (err) return next(err);
            res.redirect(bottle.url);
          });
        }
      });
    }
  },
];

// DELETE BOTTLE
exports.bottle_delete = (req, res, next) => {
  Bottle.findById(req.params.id).exec((err, bottle) => {
    if (err) return next(err);

    if (bottle === null) {
      const err = new Error("BOTTLE NOT FOUND");
      err.status = 404;
      return next(err);
    }

    Bottle.findByIdAndDelete(req.params.id, (err) => {
      if (err) return next(err);
    });

    res.redirect("/shop/admin");
  });
};
