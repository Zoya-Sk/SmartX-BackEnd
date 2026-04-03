const express = require("express");
const router = express.Router();
const { uploadProduct, homePageProducts, getProductDetails, searchProducts, userProducts, deleteProduct, editProduct, updatedProduct } = require("../controllers/productController");
const { checkAuth } = require("../middleware/authMiddleware");

router.post("/upload-product",checkAuth, uploadProduct);
router.get("/get-product",homePageProducts);
router.get("/product-details/:productId",getProductDetails);
router.get("/search-products/:textSearch",searchProducts);
router.get("/user-products", checkAuth, userProducts);
router.delete("/delete-products/:productId", checkAuth, deleteProduct);
router.put("/edit-products/:productId", checkAuth, editProduct);
router.put("/update-products/:productId", checkAuth, updatedProduct);

module.exports = router;