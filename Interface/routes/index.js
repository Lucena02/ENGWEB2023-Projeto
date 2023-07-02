var express = require('express');
var router = express.Router();
var axios = require("axios");
var jwt = require('jsonwebtoken')

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const fs = require('fs');

function verificaToken(req, res, next){
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
router.get('/', function(req, res) {
  levelUser = "Utilizador"
  tokenBool = false


  if(req.cookies && req.cookies.token){
    token = req.cookies.token
    tokenBool = true

    jwt.verify(token, 'EngWeb2023RuasDeBraga',(e, payload)=>{
      if(e){
        console.log('Token is expired');
        tokenBool= false
      }
    })

  }

  res.render('index', {t: tokenBool, level: levelUser});
});


router.get('/rua', function(req, res) {
  levelUser= "Utilizador"
  tokenBool = false
  if(req.cookies && req.cookies.token){
    token = req.cookies.token
    tokenBool = true

    try {
      const tk = jwt.verify(token, 'EngWeb2023RuasDeBraga');
      levelUser = tk.level;
    } catch (e) {
      tokenBool=false
    }
  }

  let q = ""
    
  if (req.query && "field" in req.query && "text" in req.query && req.query.text.trim().length > 0)
  {
    if (req.query.field == "nome")
      q = `?nome_like=.*(?i)${req.query.text}.*`
    else
      q = `/${req.query.field}/${req.query.text}`
  }
 

  axios.get("http://localhost:8000/ruas" + q)
    .then(response => {
      res.render('ruasTodas', { data: response.data, t: tokenBool, level: levelUser});
    })
    .catch(erro => {
      res.render("error", {message: "Erro ao obter pagina inicial", error : erro})
    })
});

router.get('/rua/register', function(req,res) {
  tokenBool = false
  if(req.cookies && req.cookies.token){
    token = req.cookies.token
    tokenBool = true

    jwt.verify(token, 'EngWeb2023RuasDeBraga',(e, payload)=>{
      if(e){
        console.log('Token is expired');
        tokenBool= false
      }
    })
  }
  res.render('addRua', {t: tokenBool});
})


router.get('/rua/ultraremove/:id', verificaToken, function(req,res,next) {
  axios.delete("http://localhost:8000/ruas/" + req.params.id)
    .then(response => {
        res.redirect("/rua");
    })
    .catch(erro => {
      res.render("error", {message: "erro ao eliminar uma rua", error : erro})
    })
});






router.post('/rua/register', upload.single('myFile'), function(req, res) {

  console.log(req.body)

  let para = {refs: {}, texto: req.body.texto }
  delete req.body.texto
  req.body.paragrafo = para
  let pos = {latitude: req.body.latitude, longitude: req.body.longitude}
  delete req.body.latitude
  delete req.body.longitude
  req.body.pos = pos
  
  console.log('cdir: ' + __dirname)
  let oldPath = __dirname + '/../' + req.file.path
  console.log('old: ' + oldPath)
  let newPath = __dirname + "/../public/atual/"+req.file.originalname
  console.log('new: ' + newPath)

  fs.rename(oldPath, newPath, erro => {
      if(erro) console.log(erro)
  })

  let imagem = {
    _id  : oldPath,
    legenda : req.body.legenda,
    imagem : {
      path: "../atual/" + req.file.originalname,
      largura : null
    }
  }
  
  req.body.figuras = [imagem]

  delete req.body.legenda
  console.log(req.body)
  console.log(req.body.figuras[0].imagem)

  axios.post("http://localhost:8000/ruas", req.body)
    .then(response => {
        res.redirect('/rua');
    })
    .catch(erro => {
      res.render("error", {message: "erro ao adicionar uma rua", error : erro})
    })
});


router.get('/rua/:id', function(req, res) {
  levelUser="Utilizador"
  tokenBool = false
  if(req.cookies && req.cookies.token){
    token = req.cookies.token
    tokenBool = true

    try {
      const tk = jwt.verify(token, 'EngWeb2023RuasDeBraga');
      levelUser = tk.level;
      // Perform additional actions or logic here
    } catch (e) {
      tokenBool=false
    }
  }

  console.log(req.body)
  
  axios.get("http://localhost:8000/ruas/" + req.params.id)
    .then(response => {
        res.render('infoCasas', { data: response.data, t: tokenBool, level: levelUser});
    })
    .catch(erro => {
      res.render("error", {message: "erro ao obter a pagina da rua", error : erro})
    })
});

// Publicar Comentário
router.post('/rua/:id', verificaToken, function(req, res) {
  req.body.data = Date().substring(0,24);
  levelUser = "Utilizador"
  tokenBool = false

  if(req.cookies && req.cookies.token){
    token = req.cookies.token
    tokenBool = true
    username= ""
    try {
      const tk = jwt.verify(token, 'EngWeb2023RuasDeBraga');
      username = tk.username;
      // Perform additional actions or logic here
    } catch (e) {
      tokenBool=false
    }
  }

  req.body.autor = username
  console.log("oi")
  console.log(req.body)
  axios.post("http://localhost:8000/ruas/post/" + req.params.id, req.body)
    .then(response => {
        res.redirect("/rua/" + req.params.id);
    })
    .catch(erro => {
      res.render("error", {message: "erro ao publicar comentário na rua", error : erro})
    })
});


router.get('/rua/:idR/unpost/:id', verificaToken, function(req,res,next) {
  axios.delete("http://localhost:8000/ruas/unpost/" + req.params.id)
    .then(response => {
        res.redirect("/rua/" + req.params.idR);
    })
    .catch(erro => {
      res.render("error", {message: "erro ao eliminar uma casa da respetiva rua", error : erro})
    })
});




// Registar uma casa (GET)
router.get('/rua/:id/regCasa', verificaToken, function(req,res) {
  
  tokenBool = false
  if(req.cookies && req.cookies.token){
    token = req.cookies.token
    tokenBool = true

    jwt.verify(token, 'EngWeb2023RuasDeBraga',(e, payload)=>{
      if(e){
        console.log('Token is expired');
        tokenBool= false
      }
    })
  }

  res.render('addCasa', {t:tokenBool});
})


// Eliminar uma casa
router.get('/rua/:id/deleteCasa/:idC', verificaToken, function(req,res,next) {
  tokenBool=true
  res.render('addCasaR', {idCasa: req.params.idC, idRua: req.params.id, t:tokenBool});
})

router.get('/rua/:id/deleteCasa/:idC/S', verificaToken, function(req,res,next) {
  axios.delete("http://localhost:8000/ruas/deleteCasa/" + req.params.idC)
    .then(response => {
        res.redirect("/rua/" + req.params.id);
    })
    .catch(erro => {
      res.render("error", {message: "erro ao eliminar uma casa da respetiva rua", error : erro})
    })
});



// Registar uma casa (POST)
router.post('/rua/:id/regCasa', verificaToken, function(req, res) {
  let para = {refs: {}, texto: req.body.texto }
  delete req.body.texto
  req.body.desc = para
  axios.post("http://localhost:8000/ruas/addCasa/" + req.params.id, req.body)
    .then(response => {
        res.render('addCasaC', {j: req.params.id});
    })
    .catch(erro => {
      res.render("error", {message: "erro ao adicionar a rua", error : erro})
    })
});


// Atualizar uma casa

router.get('/rua/:id/updateCasa/:idC', verificaToken, function(req, res, next) {
  axios.get("http://localhost:8000/ruas/casa/" + req.params.idC)
    .then(response => {
        res.render('addCasaU', {data: response.data});
    })
    .catch(erro => {
      res.render("error", {message: "erro ao adicionar a rua", error : erro})
    })
});

router.post('/rua/:id/updateCasa/:idC', verificaToken, function(req,res,next) {
  let teste = req.params.id;
  let para = {refs: {}, texto: req.body.texto }
  delete req.body.texto
  req.body.desc = para
  axios.post("http://localhost:8000/ruas/editCasa/" + req.params.idC, req.body)
    .then(response => {
        res.render('addCasaC', {i: teste});
    })
    .catch(erro => {
      res.render("error", {message: "erro ao tentar editar a Casa", error : erro})
    })
})





// AUTENTICAÇAO

// Tratamento do Register
router.get('/register', function(req,res) {

  tokenBool = false
  if(req.cookies && req.cookies.token){
    token = req.cookies.token
    tokenBool = true

    jwt.verify(token, 'EngWeb2023RuasDeBraga',(e, payload)=>{
      if(e){
        console.log('Token is expired');
        tokenBool= false
      }
    })
  }

  res.render('registerForm', {t: tokenBool})
})

// Tratamento do Login
router.get('/logout', function(req, res){
  
  tokenBool = false
  if(req.cookies && req.cookies.token){
    token = req.cookies.token
    tokenBool = true

    jwt.verify(token, 'EngWeb2023RuasDeBraga',(e, payload)=>{
      if(e){
        console.log('Token is expired');
        tokenBool= false
      }
    })
  }

  res.render('testeLogout', {t:tokenBool})
})

// Tratamento do Login
router.get('/login', function(req, res){

  tokenBool = false
  if(req.cookies && req.cookies.token){
    token = req.cookies.token
    tokenBool = true

    jwt.verify(token, 'EngWeb2023RuasDeBraga',(e, payload)=>{
      if(e){
        console.log('Token is expired');
        tokenBool= false
      }
    })
  }

  res.render('loginForm', {t: tokenBool})
})

router.post('/register',verificaToken, function(req, res){
  
  if(req.cookies && req.cookies.token){
    token = req.cookies.token
  }

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
