var express = require('express');
var router = express.Router();
var Rua = require('../controllers/rua')
var jwt = require('jsonwebtoken')

function verificaToken(req, res, next){
    console.log("oiii")
    var myToken 
    if(req.query && req.query.token)
        myToken = req.query.token;
    else if(req.body && req.body.token) 
        myToken = req.body.token;
    else
        myToken = false;
  
    if(myToken){
        jwt.verify(myToken, "EngWeb2023", function(e, payload){
        if(e){
            res.status(401).jsonp({error: e})
        }
        else{
            next()
        }
      })
    }
}

/* GET home page. */
router.get('/ruas', function(req, res, next) {
    Rua.listaRuas(req.query)
    .then(ruas => {
        res.status(200).jsonp(ruas);
    })
    .catch(erro => {
        res.status(500).jsonp(erro);
    });
});

router.get('/ruas/nomes', function(req, res, next) {
    Rua.getNomesRuas(req.query)
    .then(ruas => {
        res.status(200).jsonp(ruas);
    })
    .catch(erro => {
        res.status(500).jsonp(erro);
    });
});

router.get('/ruas/:id', function(req, res, next) {
    Rua.getRua(req.params.id)
    .then(rua => {
        res.status(200).jsonp(rua);
    })
    .catch(erro => {
        res.status(500).jsonp(erro);
    });
});

router.get('/ruas/nome/:nome', function(req, res, next) {
    Rua.getRuaNome(req.params.nome)
    .then(rua => {
        res.status(200).jsonp(rua);
    })
    .catch(erro => {
        res.status(500).jsonp(erro);
    });
});

router.post('/ruas', verificaToken, function(req, res, next) {
    Rua.addRua(req.body)
    .then(resposta => {
        res.status(201).jsonp(resposta);
    })
    .catch(erro => {
        res.status(501).jsonp(erro);
    });
});

router.post('/ruas/addCasa/:id', verificaToken, function(req, res, next) {
    Rua.addCasa(req.params.id, req.body)
    .then(resposta => {
        res.status(201).jsonp(resposta);
    })
    .catch(erro => {
        res.status(501).jsonp(erro);
    });
});

router.put('/ruas', verificaToken, function(req, res, next) {
    Rua.updateRua(req.body._id, req.body)
    .then(resposta => {
        res.status(204).jsonp(resposta);
    })
    .catch(erro => {
        res.status(505).jsonp(erro);
    });
});

router.put('/ruas/:id', verificaToken, function(req, res, next) {
    Rua.updateRua(req.params.id, req.body)
    .then(resposta => {
        res.status(200).jsonp(resposta);
    })
    .catch(erro => {
        res.status(505).jsonp(erro);
    });
});

router.delete('/ruas/:id', verificaToken, function(req, res, next) {
    Rua.deleteRua(req.params.id)
    .then(resposta => {
        res.status(200).jsonp(resposta);
    })
    .catch(erro => {
        res.status(507).jsonp(erro);
    });
});

module.exports = router;
