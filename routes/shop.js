const express = require("express");
const router = express.Router();

// CONTROLLER MODULES
const bottle_controller = require("../controllers/bottleController");
const product_controller = require("../controllers/productController");
const color_controller = require("../controllers/colorController");

// IMAGE UPLOAD
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./public/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
}).single("file");

/// BOTTLE ROUTES ///

// GET HOME PAGE
router.get("/", bottle_controller.index);

//GET ADMIN PAGE
router.get("/admin", bottle_controller.admin);

//POST ADMIN PAGE
router.post("/admin", bottle_controller.admin_login);

// GET BOTTLE CREATE
router.get("/bottle/create", bottle_controller.bottle_create_get);

// POST BOTTLE CREATE
router.post("/bottle/create", upload, bottle_controller.bottle_create_post);

// GET BOTTLE UPDATE
router.get("/bottle/:id/update", bottle_controller.bottle_update_get);

// POST BOTTLE UPDATE
router.post("/bottle/:id/update", upload, bottle_controller.bottle_update_post);

// DELETE BOTTLE
router.get("/bottle/:id/delete", bottle_controller.bottle_delete);

// GET DISPLAY BOTTLE W/ ID
router.get("/bottle/:id", bottle_controller.bottle_detail);

// POST BOTTLE BUY
router.post("/bottle/:id", bottle_controller.bottle_buy);

// GET ALL BOTTLE
router.get("/bottle", bottle_controller.bottle_list);

/// PRODUCT ROUTES ///
// GET PRODUCT CREATE
router.get("/product/create", product_controller.product_create_get);

// POST PRODUCT CREATE
router.post("/product/create", product_controller.product_create_post);

// GET PRODUCT UPDATE
router.get("/product/:id/update", product_controller.product_update_get);

// POST PRODUCT UPDATE
router.post("/product/:id/update", product_controller.product_update_post);

// DELETE PRODUCT
router.get("/product/:id/delete", product_controller.product_delete);

// GET FILTERED PRODUCT SELECTION
router.get("/product/:filter", product_controller.product_select);

/// COLOR ROUTES ///
// GET COLOR  CREATE
router.get("/color/create", color_controller.color_create_get);

// POST COLOR  CREATE
router.post("/color/create", color_controller.color_create_post);

// GET COLOR  UPDATE
router.get("/color/:id/update", color_controller.color_update_get);

// DELETE COLOR
router.get("/color/:id/delete", color_controller.color_delete);

// POST COLOR  UPDATE
router.post("/color/:id/update", color_controller.color_update_post);

// GET FILTERED COLOR SELECTION
router.get("/color/:id", color_controller.color_select);

module.exports = router;
