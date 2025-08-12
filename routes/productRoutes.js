const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById, getProductsByCategory, getTopOffers, getBestSellers} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/category", getProductsByCategory);
router.get("/top-offers", getTopOffers);
router.get("/best-sellers", getBestSellers);
router.get("/:id", getProductById);
module.exports = router;

