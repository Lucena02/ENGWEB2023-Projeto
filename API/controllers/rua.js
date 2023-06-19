const Rua = require('../models/rua');

// Retornar lista de ruas (query para filtros)
module.exports.listaRuas = (query) => {
    return Rua
    .find(query)
    .sort({_id:1})
    .then(lista => {
        return lista;
    })
    .catch(erro => {
        return erro;
    });
};

// Retornar uma rua
module.exports.getRua = (id) => {
    return Rua
    .findOne({_id:id})
    .then(rua => {
        return rua;
    })
    .catch(erro => {
        return erro;
    });
};

// Adicionar um rua
module.exports.addRua = (rua) => {
    return Rua
    .create(rua)
    .then(resposta => {
        return resposta;
    })
    .catch(erro => {
        return erro;
    });
};

// Update a uma rua
module.exports.updateRua = (rua) => {
    return Rua
    .updateOne({_id:rua._id}, rua)
    .then(resposta => {
        return resposta;
    })
    .catch(erro => {
        return erro;
    });
};

// Delete a uma rua
module.exports.deleteRua = (id) => {
    return Rua
    .deleteOne({_id: id})
    .then(resposta => {
        return resposta;
    })
    .catch(erro => {
        return erro;
    });
};
