import mercadopago from 'mercadopago';
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';

class PaymentService {
    constructor() { }
    async getPayment() {
        try {
            mercadopago.configure({
                access_token: 'APP_USR-378838892861807-012620-bd1cd0ab44e9b34d8e6f2e608c3d4f61-1296317932',
            })

            let preference = {
                items: [
                    {
                        id: 9999,
                        title: "Producto 1",
                        unit_price: 100,
                        quantity: 1,
                        currency_id: 'ARS',
                    },
                    {
                        id: 8888,
                        title: "Producto 2",
                        unit_price: 100,
                        quantity: 1,
                        currency_id: 'ARS',
                    }
                ],
                back_urls: {
                    success: 'http://localhost:8080/api/v1/payment/success',
                    failure: 'http://localhost:8080/api/v1/payment/failure',
                    // pending: 'https://localhost:800/api/v1/payment/pending'
                },
                notification_url: `https://4722-2803-9800-9401-7630-5081-58a2-982d-39e1.sa.ngrok.io/api/v1/payment/notification`
            };

            const response = await mercadopago.preferences.create(preference)
            const body = response.body
            // console.log(body)
            return body.init_point 
        } catch (error) {
            console.log('error desde service', error);
        }
    }

    async getNotificationService(req){
        try {
            let objSave = {}
            const {/*body,*/ query} = req;
            // console.log("desde query", query);
            const topic = query.topic || query.type;
            let merchantOrder;
            let payment
            switch (topic) {
                case 'payment':
                    const paymentID = query.id || query['data.id'];
                    payment = await mercadopago.payment.findById(paymentID);
                    // console.log("DESDE PAYMENT CASE:::", payment.body);
                    merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id)
    
                    // const infoPayment = await fs.promises.readFile('./data.json', 'utf-8');
                    // const dataPayment = JSON.parse(infoPayment)
                    // dataPayment.payment.push(payment.body.transaction_details)

                    // PARA IR DEPURANDO REVISAR PROPIEDADES DE PAYMENT LLEVAR ESTA VERIFICACION HACIA if(paidAmount >= merchantOrder.body.total_amount) PARA QUE SOLO ESCRIBA EN LA BD LOS PAGOS APROBADOS Y LOS QUE ESTEN PENDIENTES LUEGO CAPAS SALGAN APROBADOS (COSA DE MERCADO LIBRE)
                    // dataPayment.payment.NETO_RECIBIDO=payment.body.transaction_details.net_received_amount

                    // await fs.promises.writeFile('./data.json', JSON.stringify(dataPayment, null,' '));
                    break;
            
                case 'merchant_order':
                    const orderID = query.id; /* ORDER ID SERIA PAYMENT ID */
                    merchantOrder = await mercadopago.merchant_orders.findById(orderID)
                    // console.log("DESDE MERCHANT CASE:::", merchantOrder.body);
    
                    // const infoMerchant = await fs.promises.readFile('./data.json', 'utf-8');
                    // const dataMerchant = JSON.parse(infoMerchant)
                    // dataMerchant.merchant.push(merchantOrder.body.total_amount)

                    // PARA IR DEPURANDO REVISAR PROPIEDADES DE MERCHANT LLEVAR ESTA VERIFICACION HACIA if(paidAmount >= merchantOrder.body.total_amount) PARA QUE SOLO ESCRIBA EN LA BD LOS PAGOS APROBADOS Y LOS QUE ESTEN PENDIENTES LUEGO CAPAS SALGAN APROBADOS (COSA DE MERCADO LIBRE)
                    // dataMerchant.merchant.TOTAL_OPERACION=merchantOrder.body.total_amount;
                    
                    // await fs.promises.writeFile('./data.json', JSON.stringify(dataMerchant, null,' '));
                    break;
            }
    
            
            // const data = await fs.promises.readFile('./data.json', 'utf-8');
            // const data2 = JSON.parse(data)
            // console.log(data2);
            
            let paidAmount = 0;
            // En merchantOrder.body hay un array de payments
            merchantOrder.body.payments.forEach(payment=>{
                if(payment.status === 'approved'){
                    paidAmount += payment.transaction_amount;
                    
                }
            })
    
            if(paidAmount >= merchantOrder.body.total_amount){
                console.log("ti de pago", payment?.body.payment_method.type)
                if(payment?.body.payment_method.type === 'credit_card'){
                    objSave.id = uuidv4(), 
                    objSave.tipo_de_pago = 'tarjeta de credito' || "nada"
                    objSave.total_de_compra = merchantOrder.body.total_amount || "nada"
                    objSave.neto_recibido = payment.body.transaction_details.net_received_amount || "nada"
                    objSave.comision_mp = payment.body.fee_details[1].amount || "nada" /* collector [1]*/
                    objSave.tipo_de_tarjeta = payment.body.payment_method_id || "nada"
                    objSave.fecha_de_liberacion = payment.body.money_release_date || "nada"

                    const info = await fs.promises.readFile('./data.json', 'utf-8');
                    const data = JSON.parse(info)
                    data.pagos.push(objSave)
                    await fs.promises.writeFile('./data.json', JSON.stringify(data, null,' '));
                }else if(payment.body.payment_method.type === 'account_money'){
                    objSave.id = uuidv4();
                    objSave.tipo_de_pago = 'cuenta mp' || "nada";
                    objSave.total_de_compra = merchantOrder.body.total_amount || "nada";
                    objSave.neto_recibido = payment.body.transaction_details.net_received_amount || "nada";
                    objSave.comision_mp = payment.body.fee_details[0].amount || "nada" /* collector [1]*/
                    objSave.cuotas = payment.body.installments || "nada"
                    objSave.fecha_de_liberacion = payment.body.money_release_date || "nada"

                    const info = await fs.promises.readFile('./data.json', 'utf-8');
                    const data = JSON.parse(info)
                    data.pagos.push(objSave)
                    await fs.promises.writeFile('./data.json', JSON.stringify(data, null,' '));
                }
                
                    
                    // EL_COMPRADOR_PAGO: merchantOrder?.body.total_amount,
                    // PAYMENT_BODY_FEE_DETAILS_COMPRADOR: payment?.body.fee_details[0],
                    // PAYMENT_BODY_FEE_DETAILS_VENDEDOR: payment?.body.fee_details[1],
                    // PAYMENT_BODY_FEE: payment?.body.fee_details,
                
                // console.log("obj de merch order: ", objDeMerchantOrder);
                const info = await fs.promises.readFile('./data.json', 'utf-8');
                const data = JSON.parse(info)
                console.log("el DATA", data.pagos);
                return true
            }else{
                return false
            }
            
        } catch (error) {
            console.log("error desde controller", error);
        }
    }
}
export { PaymentService }