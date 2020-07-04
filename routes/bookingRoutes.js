const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:tourId', //We need to send along the tour being booking, so the relevant data can be passed along.
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
