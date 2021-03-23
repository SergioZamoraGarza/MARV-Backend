"use strict";

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article');

var controller = {
  datosCurso: (req, res) => {
    var hola = req.body.hola;

    return res.status(200).send({
      curso: "Master en Frameworks Js",
      autor: "Sergio",
      url: "localhost.com",
      hola
    });
  },

  test: (req, res) => {
    return res.status(200).send({
      message: "soy la acción test de mi controlador de articulos",
    });
  },

  save: (req, res) => {
    var params = req.body;

    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);

      if (validate_title && validate_content) {
        var article = new Article();
        article.title = params.title;
        article.content = params.content;
        article.image = null;

        article.save((err, articleStored) => {
          if (err || !articleStored) {
            return res.status(404).send({
              status: "error",
              message: "El articulo no se ha guardado"
            });
          } else {
            return res.status(200).send({
              status: "success",
              article: articleStored
            });
          }
        });
      } else {
        return res.status(200).send({
          status: "error",
          message: "Los datos no son validos"
        });
      }
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar!!!"
      });
    }
  },

  getArticles: (req, res) => {
    var query = Article.find({});
    var last= req.params.last;

    if(last || last != undefined){
        query.limit(5);
    }

    query.sort('-_id').exec((err,articles)=>{

        if(err){
            return res.status(500).send({
                status:"error",
                message:"Error al devolver los articulos!!!"
            })
        }

        if(!articles){
            return res.status(404).send({
                status:"error",
                message:"No hay articulos para mostrar!!!"
            })
        }

        return res.status(200).send({
            status:"success",
            articles: articles
          });
    });
  },

  getArticle: (req, res) => {
      var articleId = req.params.id;

      if(!articleId||articleId==null){
        return res.status(404).send({
            status:"error",
            message:"No existe el articulo"
        })
      }

      Article.findById(articleId,(err,article)=>{
        if(!article || err){
            return res.status(404).send({
                status:"error",
                message:"No existe el articulo"
            });
        }

        return res.status(200).send({
            status:"success",
            article
        })
      });
  },

  updateArticle:(req,res)=>{
    var articleId = req.params.id;
    var params = req.body;

    try{
        var validate_title = !validator.isEmpty(params.title);
        var validate_content = !validator.isEmpty(params.content);
    }
    catch(err){
        return res.status(404).send({
            status:"error",
            message:"Faltan datos por enviar!!!"
        })
    }

    if (validate_title && validate_content) {
        Article.findOneAndUpdate({_id:articleId},params,{new:true},(err,articleUpdated)=>{
            if(err){
                return res.status(500).send({
                    status:"error",
                    message:"Error al actualizar"
                })
            }

            if(!articleUpdated){
                return res.status(404).send({
                    status:"error",
                    message:"No existe el articulo"
                })
            }

            return res.status(200).send({
                status:"success",
               article:articleUpdated
            })

        });
      }
      else{
        return res.status(200).send({
            status:"error",
            message:"Faltan datos por enviar!!!"
        })
      }

  },

  deleteArticle:(req,res)=>{
    var articleId=req.params.id;

    Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
        if(err){
            return res.status(500).send({
                message:"Error al borrar"
            });
        }
        if(!articleRemoved){
            return res.status(404).send({
                message:"No se ha borrado el articulo, posiblemente no exista."
            });
        }

        return res.status(200).send({
            article:articleRemoved,
            status:"success"
        });
    }); 
  },
  
  upload: (req, res) => {
    // Configurar el modulo connect multiparty router/article.js (hecho)

    // Recoger el fichero de la petición
    var file_name = 'Imagen no subida...';

    if(!req.files){
        return res.status(404).send({
            status: 'error',
            message: file_name
        });
    }

    // Conseguir nombre y la extensión del archivo
    var file_path = req.files.file0.path;
    var file_split = file_path.split('\\');

    // * ADVERTENCIA * EN LINUX O MAC
    // var file_split = file_path.split('/');

    // Nombre del archivo
    var file_name = file_split[2];

    // Extensión del fichero
    var extension_split = file_name.split('\.');
    var file_ext = extension_split[1];

    // Comprobar la extension, solo imagenes, si es valida borrar el fichero
    if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
        
        // borrar el archivo subido
        fs.unlink(file_path, (err) => {
            return res.status(200).send({
                status: 'error',
                message: 'La extensión de la imagen no es válida !!!'
            });
        });
    
    }else{
         // Si todo es valido, sacando id de la url
         var articleId = req.params.id;

         if(articleId){
            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {

                if(err || !articleUpdated){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen de articulo !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
         }else{
            return res.status(200).send({
                status: 'success',
                image: file_name
            });
         }
        
    }   
}, // end upload file

getImage: (req, res) => {
    var file = req.params.image;
    var path_file = './upload/articles/'+file;

    fs.exists(path_file, (exists) => {
        if(exists){
            return res.sendFile(path.resolve(path_file));
        }else{
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe !!!'
            });
        }
    });
},

search: (req, res) => {
    // Sacar el string a buscar
    var searchString = req.params.search;

    // Find or
    Article.find({ "$or": [
        { "title": { "$regex": searchString, "$options": "i"}},
        { "content": { "$regex": searchString, "$options": "i"}}
    ]})
    .sort([['date', 'descending']])
    .exec((err, articles) => {

        if(err){
            return res.status(500).send({
                status: 'error',
                message: 'Error en la petición !!!'
            });
        }
        
        if(!articles || articles.length <= 0){
            return res.status(404).send({
                status: 'error',
                message: 'No hay articulos que coincidan con tu busqueda !!!'
            });
        }

        return res.status(200).send({
            status: 'success',
            articles
        });

    });
}

};  // end controller

module.exports = controller;
