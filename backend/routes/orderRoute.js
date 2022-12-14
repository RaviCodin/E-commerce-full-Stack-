const express = require("express");
const { isAuthanticatedUser, authourizRoles } = require("../middleWare/auth");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderControl");

const router = express.Router();

router.route("/order/new").post(isAuthanticatedUser, newOrder);

router.route("/order/:id").get(isAuthanticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthanticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthanticatedUser, authourizRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthanticatedUser, authourizRoles("admin"), updateOrder)
  .delete(isAuthanticatedUser, authourizRoles("admin"), deleteOrder);

module.exports = router;
