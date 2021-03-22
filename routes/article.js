'use strict'

var express = require('express');
var ArticleController = require("../controllers/article");

var router = express.Router();

router.get('/test-de-controlador',ArticleController.datosCurso);
router.post('/datos-curso',ArticleController.test);