import * as paymentController from '../controller/payment.controller.js';
import { Router } from 'express';

const v1RouterPayment = new Router();

v1RouterPayment.get('/', paymentController.getPaymentController)
v1RouterPayment.get('/success', paymentController.getSuccessController)
v1RouterPayment.get('/failure', paymentController.getFailureController)
v1RouterPayment.post('/notification', paymentController.getNotificationController)

export {v1RouterPayment};
