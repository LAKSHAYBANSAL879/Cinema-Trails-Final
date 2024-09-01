const express = require('express');
const PaymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');
PaymentRouter.post('/payment',paymentController.createPaymentIntent);
module.exports=PaymentRouter;