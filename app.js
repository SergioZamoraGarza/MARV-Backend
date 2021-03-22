'use strict'

//Cargar modulos de node para crear servidor
var express = require("express");
var bodyParser = require("body-parser");

//Ejecturar express (http)
var app = express();

//Cargar ficheros rutas

//Middlewares
//Convierte a json lo que llegue del body
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a rutas

//Ruta o metodo de prueba
app.get("/probando", (req,res)=>{
    res.status(200).send({
        curso:"Master en Frameworks JS",
        autor: "Sergio",
        url:"localhost.com"
    });
});


//Exportar modulo (fichero actual)
module.exports =app;