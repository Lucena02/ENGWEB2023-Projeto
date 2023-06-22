var express = require('express');
var router = express.Router();
var Rua = require('../controllers/rua')

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

router.post('/ruas', function(req, res, next) {
    Rua.addRua(req.body)
    .then(resposta => {
        res.status(201).jsonp(resposta);
    })
    .catch(erro => {
        res.status(501).jsonp(erro);
    });
});

router.put('/ruas', function(req, res, next) {
    Rua.updateRua(req.body._id, req.body)
    .then(resposta => {
        res.status(204).jsonp(resposta);
    })
    .catch(erro => {
        res.status(505).jsonp(erro);
    });
});

router.put('/ruas/:id', function(req, res, next) {
    Rua.updateRua(req.params.id, req.body)
    .then(resposta => {
        res.status(200).jsonp(resposta);
    })
    .catch(erro => {
        res.status(505).jsonp(erro);
    });
});

router.delete('/ruas/:id', function(req, res, next) {
    Rua.deleteRua(req.params.id)
    .then(resposta => {
        res.status(200).jsonp(resposta);
    })
    .catch(erro => {
        res.status(507).jsonp(erro);
    });
});

module.exports = router;
