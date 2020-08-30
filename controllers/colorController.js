const Color = require("../models/color");
const Bottle = require("../models/bottle");

const async = require("async");
const validator = require("express-validator");

// DISPLAY LIST OF BOTTLES THAT COME IN SELECTED COLOR
exports.color_select = (req, res) => {
  console.log(req.params);
  res.send(`NA: LIST OF BOTTLES IN COLOR w/ ID: ${req.params.id}`);
};

/// CREATE ///
// GET - COLOR CREATE PAGE - ADMIN ONLY
exports.color_create_get = (req, res, next) =>
  res.render("color/form", { title: "ADD COLOR", class: "form" });

// POST - COLOR CREATE PAGE - ADMIN ONLY
exports.color_create_post = [
  validator
    .body("name", "Color name required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator.body("hex").trim().isHexColor().escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    const color = new Color({ name: req.body.name, hex: req.body.hex });

    if (!errors.isEmpty()) {
      res.render("color/form", {
        title: "ADD COLOR",
        class: "form",
        color: color,
        errors: errors.array(),
      });
      return;
    } else {
      Color.find({
        $or: [{ name: req.body.name }, { hex: req.body.hex }],
      }).exec((err, found_colors) => {
        if (err) return next(err);
        if (found_colors.length) {
          res.redirect("/shop/admin");
        } else {
          color.save((err) => {
            if (err) return next(err);
            res.redirect("/shop/admin");
          });
        }
      });
    }
  },
];

/// UPDATE ///
// GET - COLOR UPDATE PAGE - ADMIN ONLY
exports.color_update_get = (req, res, next) => {
  Color.findById(req.params.id).exec((err, color) => {
    if (err) return next(err);
    if (color === null) {
      let err = new Error("Color not found");
      err.status = 404;
      return next(err);
    }
    res.render("color/form", {
      title: "UPDATE COLOR",
      color: color,
      class: "form",
    });
  });
};

// POST - COLOR UPDATE PAGE - ADMIN ONLY
exports.color_update_post = [
  validator
    .body("name", "Color name required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator.body("hex").trim().isHexColor().escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    const color = new Color({
      _id: req.params.id,
      name: req.body.name,
      hex: req.body.hex,
    });

    if (!errors.isEmpty()) {
      res.redirect(`/shop/color/${req.params.id}/update`);
    } else {
      Color.findByIdAndUpdate(req.params.id, color, {}, (err) => {
        if (err) return next(err);
        res.redirect("/shop/admin");
      });
    }
  },
];

// DELETE COLOR
exports.color_delete = (req, res, next) => {
  async.parallel(
    {
      color: (callback) => Color.findById(req.params.id).exec(callback),
      bottles: (callback) =>
        Bottle.find({ color: req.params.id }).exec(callback),
    },
    (err, results) => {
      if (err) return next(err);

      if (results.color === null) {
        const err = new Error("COLOR NOT FOUND");
        err.status = 404;
        return next(err);
      }

      if (results.bottles.length > 0) {
        const err = new Error(
          "This color is in use, please delete all relevant bottles to continue!"
        );
        return next(err);
      }

      Color.findByIdAndDelete(req.params.id, (err) => {
        if (err) return next(err);
      });
      res.redirect("/shop/admin");
    }
  );
};
