import { paymentService } from '../service/payment.factory.service.js';

const getPaymentController = async (req, res)=>{
    try {
        const payment = await paymentService.getPayment();
        
        res.send(`<a target=BLANK href=${payment}>Pagar</a>`);
    } catch (error) {
        console.log("error desde controller", error);
    }
}

const getSuccessController = async (req, res) => {
    try {
        res.send(`<h1>SUCCESS</h1>`)
    } catch (error) {
        console.log("error desde controller", error);
    }
}

const getFailureController = async (req, res) => {
    try {
        res.send(`<h1>FAILURE</h1>`)
    } catch (error) {
        console.log("error desde controller", error);
    }
}
let arr = []


const getNotificationController = async (req, res) => {
    try {
        const notification = await paymentService.getNotificationService(req)
        notification ? console.log("SI SE COMPLETO") : console.log("NO SE COMPLETO");
        res.send()
    } catch (error) {
        console.log(error);
    }
}

export {
    getPaymentController,
    getSuccessController,
    getFailureController,
    getNotificationController
}

// EN EDGE PRINCIPAL CUENTA DE COMPRADOR, EN INCOGNITO CUENTA DE VENDEDOR, PARA ACTIVAR EL TUNEL ./ngrok http 8080 EN LA CONSOLA DEL PROYECTO

// PAGANDO CON TARJETA DE CREDITO MASTERCARD
    //  payment.body.payment_method;       devuelve: {id: 'master', type: 'credit_card'}
    //  payment.body.payment_method_id     devuelve: 'master'
    //  payment.body.payment_type_id       devuelve: 'credit_card'
    //  fee_details: [
    //     { amount: 52.3, fee_payer: 'payer', type: 'financing_fee' },
    //     { amount: 15.46, fee_payer: 'collector', type: 'mercadopago_fee' }
    //   ]

    // PAGANDO CON TARJETA DE CREDITO VISA
    // payment.body.payment_method         devuelve: {id: 'visa', type: 'credit_card'}
    // payment.body.payment_method_id      devuelve: 'visa'
    // payment.body.payment_type_id        devuelve: 'credit_card'

    //  PAGANDO CON AMERICAN EXPRESS
    //  payment.body.payment_method       devuelve: { id: 'amex', type: 'credit_card' },
    //  payment.body.payment_method_id    devuelve: 'amex',
    //  payment.body.payment_type_id      devuelve: 'credit_card',
    //  fee_details: [
    //     { amount: 55.64, fee_payer: 'payer', type: 'financing_fee' },
    //     { amount: 15.46, fee_payer: 'collector', type: 'mercadopago_fee' }
    //   ]

    //  PAGANDO CON PLATA DE MERCADO PAGO
    //  payment.body.payment_method        devuelve: { id: 'account_money', type: 'account_money' },
    //  payment.body.payment_method_id     devuelve: 'account_money',
    //  payment.body.payment_type_id       devuelve: 'account_money',
    //  payment.body.fee_details: [
    //    { amount: 15.46, fee_payer: 'collector', type: 'mercadopago_fee' }
    //  ]


    // PAYMENT PROPIEDADES
    //TODO ESTO ESTA EN 'payment.body' en payment.body.fee_details son las comisiones que se cobraron y en payer los datos del comprador, en installments cantidad de cuotas, money_release_date el dia que se libera la plata, notification_url, order.id para obtener la merchant_order, 
    
    // payment.body.installments           devuelve: 3
    // payment.body.payer                  devuelve: {  email: 'test_user_1296322434@testuser.com', <==en caso que  este registrado en MP
    //                                                  entity_type: null,
    //                                                  first_name: null,
    //                                                  id: '1296322434',
    //                                                  identification: { number: '23011111114', type: 'CUIL' },
    //                                                  last_name: null,
    //                                                  operator_id: null,
    //                                                  phone: { area_code: null, extension: null, number: null },
    //                                                  type: null
    //                                               }

    // payment.body.transaction_details: {
    //     acquirer_reference: null,
    //     external_resource_url: null,
    //     financial_institution: null,
    //     installment_amount: 85.21,
    //     net_received_amount: 184.54,      <=============== IMPORTANTE
    //     overpaid_amount: 0,
    //     payable_deferral_period: null,
    //     payment_method_reference_id: null,
    //     total_paid_amount: 255.64
    //   }