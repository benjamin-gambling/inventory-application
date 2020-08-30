#! /usr/bin/env node

console.log(
  "This script populates some test bottles, products and colors to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require("async");
const Bottle = require("./models/bottle");
const Product = require("./models/product");
const Color = require("./models/color");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const bottles = [];
const products = [];
const colors = [];

function colorCreate(name, hex, cb) {
  const color = new Color({ name, hex });

  color.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Color: " + color);
    colors.push(color);
    cb(null, color);
  });
}

function productCreate(size, type, price, cb) {
  const product = new Product({ size, type, price });

  product.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Product: " + product);
    products.push(product);
    cb(null, product);
  });
}

function bottleCreate(product, color, inventory, file, cb) {
  const bottle = new Bottle({ product, color, inventory, file });

  bottle.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Bottle: " + bottle);
    bottles.push(bottle);
    cb(null, bottle);
  });
}

function createColorProducts(cb) {
  async.series(
    [
      function (callback) {
        colorCreate("Black", "#2b2c2e", callback);
      },
      function (callback) {
        colorCreate("White", "#dedede", callback);
      },
      function (callback) {
        colorCreate("Cobalt", "#1a5c90", callback);
      },
      function (callback) {
        colorCreate("Watermelon", "#fa6288", callback);
      },
      function (callback) {
        colorCreate("Pacific", "#00b0e2", callback);
      },
      function (callback) {
        colorCreate("Sunflower", "#f5ba02", callback);
      },
      function (callback) {
        productCreate("18oz", "Standard Mouth", 29.95, callback);
      },
      function (callback) {
        productCreate("21oz", "Standard Mouth", 32.95, callback);
      },
      function (callback) {
        productCreate("21oz", "Standard Mouth w/ Sports Cap", 35.95, callback);
      },
      function (callback) {
        productCreate("20oz", "Wide Mouth", 37.95, callback);
      },
      function (callback) {
        productCreate("40oz", "Wide Mouth", 49.95, callback);
      },
    ],
    // optional callback
    cb
  );
}

function createBottles(cb) {
  async.parallel(
    [
      function (callback) {
        bottleCreate(
          products[0],
          colors[0],
          43,
          "images/18sm-black.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[0],
          colors[1],
          12,
          "images/18sm-white.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[0],
          colors[3],
          3,
          "images/18sm-watermelon.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[0],
          colors[4],
          33,
          "images/18sm-pacific.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[0],
          colors[5],
          13,
          "images/18sm-sunflower.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[1],
          colors[0],
          23,
          "images/21sm-black.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[1],
          colors[1],
          7,
          "images/21sm-white.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[2],
          colors[0],
          5,
          "images/21sm-black-sports-cap.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[3],
          colors[0],
          20,
          "images/20wm-black.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[3],
          colors[1],
          20,
          "images/20wm-white.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[3],
          colors[2],
          20,
          "images/20wm-cobalt.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[3],
          colors[3],
          20,
          "images/20wm-watermelon.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[3],
          colors[4],
          20,
          "images/20wm-pacific.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[3],
          colors[5],
          20,
          "images/20wm-sunflower.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[4],
          colors[0],
          11,
          "images/40wm-black.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[4],
          colors[1],
          11,
          "images/40wm-white.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[4],
          colors[3],
          11,
          "images/40wm-watermelon.jpg",
          callback
        );
      },
      function (callback) {
        bottleCreate(
          products[4],
          colors[4],
          11,
          "images/40wm-pacific.jpg",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createColorProducts, createBottles],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("BOOKInstances: " + bottles);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
