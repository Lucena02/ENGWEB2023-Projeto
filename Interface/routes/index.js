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

// Tratamento do Register
router.get('rua/register', function(req,res,next) {
  res.render('registerForm')
})

router.post('/login', function(req, res){
  axios.post('http://localhost:8003/users/register', req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/')
    })
    .catch(e =>{
      res.render('error', {error: e, message: "Credenciais inválidas"})
    })
})

// Tratamento do Login
router.get('/login', function(req, res){
  res.render('loginForm')
})

router.post('/login', function(req, res){
  axios.post('http://localhost:8003/users/login', req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/')
    })
    .catch(e =>{
      res.render('error', {error: e, message: "Credenciais inválidas"})
    })
})


module.exports = router;
