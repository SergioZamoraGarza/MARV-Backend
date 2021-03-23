'use strict'

//Cargar modulos de node para crear servidor
var express = require("express");
/* var bodyParser = require("body-parser"); */

//Ejecturar express (http)
var app = express();

//Cargar ficheros rutas
var article_routes = require("./routes/article");

//Middlewares
//Convierte a json lo que llegue del body -bodyparser a express-
app.use(express.urlencoded({extended:false}));
app.use(express.json());

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
app.use("/api",article_routes);

//Exportar modulo (fichero actual)
module.exports =app;