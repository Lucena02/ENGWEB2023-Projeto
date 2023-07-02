const mongoose = require('mongoose')

var posSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number
});

var imagemSchema = new mongoose.Schema({
    path: String,
    largura: Number
});

var figuraSchema = new mongoose.Schema({
    _id: String,
    legenda: String,
    imagem: imagemSchema
});

var entidadeSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum : ['pessoa', 'instituição', 'empresa', 'família'],
        default: 'pessoa'
    },
    nome: String
});

var lugarSchema = new mongoose.Schema({
    nome: String,
    norm: String
});

var refSchema = new mongoose.Schema({
    entidades: [entidadeSchema],
    lugares: [lugarSchema],
    datas: [String]
});

var paraSchema = new mongoose.Schema({
    refs: refSchema,
    texto: String
});

var casaSchema = new mongoose.Schema({
    numero: String,
    enfiteutas: String,
    foro: String,
    desc: paraSchema,
    vista: String
});

var comentarioSchema = new mongoose.Schema({
    autor: String,
    data: String,
    texto: String
});

var ruaSchema = new mongoose.Schema({
    numero: Number,
    nome: String,
    pos: posSchema, 
    figuras: [figuraSchema],
    paragrafo: paraSchema,
    casas: [casaSchema],
    comentarios: [comentarioSchema]
});

module.exports = mongoose.model('rua', ruaSchema);
