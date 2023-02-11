import * as dotenv from 'dotenv'
dotenv.config()
import {app} from './app.js'

const PORT = process.env.PORT || 8080

const connectServer = app.listen(PORT, ()=> {
    console.log(`Servidor escuchando en el puerto ${connectServer.address().port}`);
});

connectServer.on('error', (error)=>{
    console.log(`Error en el servidor ${error}`);
})