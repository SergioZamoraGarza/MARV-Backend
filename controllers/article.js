'use strict'

var controller = {
   datosCurso :(req,res) =>{
       var hola = req.body.hola;

       return res.status(200).send({
           curso:"Master en Frameworks Js",
           autor:"Sergio",
           url:"localhost.com",
           hola
       });
   },

   test: (req,res)=>{
       return res.status(200).send({
           message:"soy la acción test de mi controlador de articulos"
       });
   }
}//end controller

module.exports=controller;