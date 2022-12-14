const express = require('express');
// const { get } = require('mongoose');
const { getAllProducts,createProduct, 
        updateProduct,deleteProduct, 
        getProductDetails, 
        createProductReview,
        getProductReviews,
        deleteProductReviews,
        getAdminProducts} = require("../controllers/productControl");
        
const { isAuthanticatedUser ,authourizRoles} = require('../middleWare/auth');

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/admin/products").get(isAuthanticatedUser, authourizRoles("admin"),getAdminProducts)

router.route("/admin/products/new").post(isAuthanticatedUser, authourizRoles("admin"), createProduct);

router.route("/admin/products/:id")
.put(isAuthanticatedUser, authourizRoles("admin"),updateProduct)
.delete(isAuthanticatedUser, authourizRoles("admin"),deleteProduct)
router.route("/product/:id").get(getProductDetails)


router.route("/review").put(isAuthanticatedUser , createProductReview)
router.route("/reviews").get( getProductReviews).delete(isAuthanticatedUser ,  deleteProductReviews)


module.exports = router;