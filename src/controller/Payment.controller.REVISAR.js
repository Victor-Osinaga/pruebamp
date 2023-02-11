class PaymentController {
    constructor(paymentService){
        this.paymentService = paymentService;
        // console.log(paymentService.getHolaService());
    }
    async getHolaController(req, res){
        try {
            const hola = await this.paymentService.getHolaService();
            console.log("hola");
            res.send(hola);
        } catch (error) {
            console.log("error desde controller", error);
        }
    }
}

export { PaymentController }