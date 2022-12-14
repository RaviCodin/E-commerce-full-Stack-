const express = require('express');
const { processPayment, sendStripeApiKey } = require('../controllers/paymentControllers')
const router = express.Router()

const { isAuthanticatedUser } = require("../middleWare/auth")


router.route("/payment/proccess").post( isAuthanticatedUser, processPayment)
router.route("/stripeApiKey").get(isAuthanticatedUser, sendStripeApiKey)

module.exports = router;