import express from 'express';
import { v1RouterPayment } from './src/v1/payment.router.js';

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/v1/payment', v1RouterPayment)

app.all('*', (req, res) => {
    res.json({ error: `404 Not Found`, desc: `No encontamos la página que buscas.` });
});

export {app}