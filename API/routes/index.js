var express = require('express');
var router = express.Router();
var Rua = require('../controllers/rua')

/* GET home page. */
router.get('/ruas', function(req, res, next) {
    Rua.listaRuas()
    .then(ruas => {
        res.jsonp(ruas);
    })
    .catch(erro => {
        res.jsonp(erro);
    });
});

router.get('/ruas/:id', function(req, res, next) {
    Rua.getRua(req.params.id)
    .then(rua => {
        res.jsonp(rua);
    })
    .catch(erro => {
        res.jsonp(erro);
    });
});

router.get('/ruas/nome/:nome', function(req, res, next) {
    Rua.getRuaNome(req.params.nome)
    .then(rua => {
        res.jsonp(rua);
    })
    .catch(erro => {
        res.jsonp(erro);
    });
});

router.post('/ruas', function(req, res, next) {
    Rua.addRua(req.body)
    .then(resposta => {
        res.jsonp(resposta);
    })
    .catch(erro => {
        res.jsonp(erro);
    });
});

router.put('/ruas', function(req, res, next) {
    Rua.updateRua(req.body._id, req.body)
    .then(resposta => {
        res.jsonp(resposta);
    })
    .catch(erro => {
        res.jsonp(erro);
    });
});

router.put('/ruas/:id', function(req, res, next) {
    Rua.updateRua(req.params.id, req.body)
    .then(resposta => {
        res.jsonp(resposta);
    })
    .catch(erro => {
        res.jsonp(erro);
    });
});

router.delete('/ruas/:id', function(req, res, next) {
    Rua.deleteRua(req.params.id)
    .then(resposta => {
        res.jsonp(resposta);
    })
    .catch(erro => {
        res.jsonp(erro);
    });
});

module.exports = router;
