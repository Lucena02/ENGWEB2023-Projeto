var express = require('express');
var router = express.Router();
var axios = require("axios");

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get("http://localhost:8000/ruas")
    .then(response => {
      res.render('index', { data: response.data});
    })
    .catch(erro => {
      res.render("error", {message: "Erro ao obter pagina inicial", error : erro})
    })
});


router.get('/rua/:id', function(req, res, next) {
  axios.get("http://localhost:8000/ruas/" + req.params.id)
    .then(response => {
        res.render('infoCasas', { data: response.data});
    })
    .catch(erro => {
      res.render("error", {message: "erro ao obter a pagina da rua", error : erro})
    })
});

module.exports = router;
