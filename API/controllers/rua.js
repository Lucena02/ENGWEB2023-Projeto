const Rua = require('../models/rua');

function parseQuery(query) 
{
    let r = {};
    for (var key in query)
    {
        let value = query[key];
        if (key.includes("_like"))
        {
            key = key.replace("_like", "");
            value =  new RegExp(`${value}`); 
        }
        r[key] = value;
    }
    return r;
}

// Retornar lista de ruas (query para filtros)
module.exports.listaRuas = (query) => {
    return Rua
    .find(parseQuery(query))
    .setOptions({ sanitizeFilter: true })
    .sort({_id:1})
    .then(lista => {
        return lista;
    })
    .catch(erro => {
        return erro;
    });
};

// Retornar uma rua
module.exports.getRua = id => {
    return Rua
    .findOne({_id:id})
    .then(rua => {
        return rua;
    })
    .catch(erro => {
        return erro;
    });
};

// Retornar uma rua pelo nome
module.exports.getRuaNome = (nome) => {
    return Rua
    .findOne({nome: nome})
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
module.exports.updateRua = (id, rua) => {
    return Rua
    .updateOne({_id: id}, rua)
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

module.exports.getNomesRuas = (query) => {
    return Rua
    .distinct("nome", parseQuery(query))
    .sort()
    .then(lista => {
        return lista;
    })
    .catch(erro => {
        return erro;
    });
};

module.exports.addCasa = (idRua, casa) => {
    return Rua
    .updateOne({_id : idRua}, {$push: {casas: casa}})
    .then(resposta => {
        return resposta;
    })
    .catch(erro => {
        return erro;
    });
};
