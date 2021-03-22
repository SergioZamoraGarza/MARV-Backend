'use strict'

//Conexión a BD MongoDB
var mongoose = require('mongoose');
var app = require('./app');
var port = '3900';

mongoose.set("useFindAndModify",false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://sergioZamora:klosedman20@cluster0.2unj2.gcp.mongodb.net/api_rest_blog?retryWrites=true&w=majority',{useNewUrlParser:true})
        .then(()=>{
            console.log("La conexión a la BD se ha realizado bien.");

             //Creación del servidor
            app.listen(port,()=>{
                console.log("servidor corriendo correctamente en la url :localhost:3900");
            })

}).catch(err=>console.log("Ha ocurrido el siguiente error en la conexión"+ err));