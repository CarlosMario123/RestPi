const express = require('express')
const mysql = require('mysql');
const cors = require('cors');
const myconn = require('express-myconnection');
const routesVenta = require('./routes/routesVenta');
const routesCliente = require('./routes/routesCliente');
const routesProducto = require('./routes/routesProducto');
const app = express();

app.set('port', process.env.PORT || 9000);

const dbOptions = {

    host: 'prueba.cgfgqrpgf8vd.us-east-1.rds.amazonaws.com',
    port:3306,
    user: 'admin',
    password: 'Lolasso2232',
    database:'proyecto'

}

    

http:///localhost:9000/
//middelwares--------------------------------------------
app.use(myconn(mysql,dbOptions,'single'));
app.use(express.json());
app.use(cors());


//rutas--------------------------------------------------
app.get('/',(req,res)=>{
    res.send('Bienvenido a la api')
})

app.use('/Cliente',routesCliente)
app.use('/Producto',routesProducto)
app.use('/Venta',routesVenta)


//Servidor corriendo--------------------------------------
app.listen(app.get('port'),()=>{
    console.log('server corriendo en el puerto', app.get('port'));
});