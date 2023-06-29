var express = require('express');
var router = express.Router();
var axios = require("axios");
var jwt = require('jsonwebtoken')


const fs = require('fs');
const { verificaAcesso } = require('../../Auth/auth/auth');

function verificaToken(req, res, next){
  console.log("oiii")
  var myToken 
  if(req.query && req.query.token)
      myToken = req.query.token;
  else if(req.body && req.body.token) 
      myToken = req.body.token;
  else if(req.cookies && req.cookies.token)
      myToken = req.cookies.token
  else
      myToken = false;

  if(myToken){
      jwt.verify(myToken, "EngWeb2023RuasDeBraga", function(e, payload){
      if(e){
          res.status(401).jsonp({error: e})
      }
      else{
          next()
      }
    })
  }else{
      res.status(401).jsonp({error: "Token inexistente!!"})
    }
}


// Function to check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/rua', function(req, res, next) {
  axios.get("http://localhost:8000/ruas")
    .then(response => {
      res.render('ruasTodas', { data: response.data});
    })
    .catch(erro => {
      res.render("error", {message: "Erro ao obter pagina inicial", error : erro})
    })
});

router.get('/rua/register', function(req,res,next) {
  res.render('addRua', {});
})

router.get('/rua/:id', function(req, res, next) {
  axios.get("http://localhost:8000/ruas/" + req.params.id)
    .then(response => {
        res.render('infoCasas', { data: response.data});
    })
    .catch(erro => {
      res.render("error", {message: "erro ao obter a pagina da rua", error : erro})
    })
});


// Registar uma casa (GET)
router.get('/rua/:id/regCasa', function(req,res,next) {
  res.render('addCasa');
})


// Atualizar uma casa
router.get('/rua/:id/updateCasa/:idC', function(req,res,next) {
  res.render('addCasaU');
})

// Registar uma casa (POST)
router.post('/rua/:id/regCasa', verificaToken, function(req, res, next) {
  axios.post("http://localhost:8000/ruas/addCasa/" + req.params.id)
    .then(response => {
        res.render('addCasaC');
    })
    .catch(erro => {
      res.render("error", {message: "erro ao adicionar a rua", error : erro})
    })
});







// AUTENTICAÇAO

// Tratamento do Register
router.get('/register', function(req,res) {
  res.render('registerForm')
})

// Tratamento do Login
router.get('/logout', function(req, res){
  res.render('testeLogout')
})

// Tratamento do Login
router.get('/login', function(req, res){
  res.render('loginForm')
})

router.post('/register',verificaToken, function(req, res){
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  axios.post('http://localhost:8003/users/register?token='+token, req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/')
    })
    .catch(e =>{
      res.render('error', {error: e, message: "Credenciais inválidas"})
    })
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


router.post('/logout', verificaToken, function(req, res){
      res.clearCookie('token')
      res.redirect('/')
})

module.exports = router;
