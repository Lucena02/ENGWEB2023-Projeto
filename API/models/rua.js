const mongoose = require('mongoose')

var imagemSchema = new Mongoose.Schema({
    path: String,
    largura: Number
});

var figuraSchema = new Mongoose.Schema({
    id: String,
    legenda: String,
    imagem: imagemSchema
});

var entidadeSchema = new Mongoose.Schema({
    tipo: ['pessoa', 'instituição', 'empresa', 'família'],
    nome: String
});

var lugarSchema = new Mongoose.Schema({
    nome: String,
    norm: String
});

var refSchema = new Mongoose.Schema({
    entidades: [entidadeSchema],
    lugares: [lugarSchema],
    datas: [String]
});

var paraSchema = new Mongoose.Schema({
    refs: refSchema,
    texto: String
});

var casaSchema = new Mongoose.Schema({
    id: String,
    enfiteuta: [String],
    foro: String,
    desc: [paraSchema],
    vista: String
});

var comentarioSchema = new Mongoose.Schema({
    autor: String,
    data: String,
    texto: String
});

var ruaSchema = new Mongoose.Schema({
    _id: String,
    nome: String,
    figuras: [figuraSchema],
    paragrafos: [paraSchema],
    casas: [casaSchema],
    comentarios: [comentarioSchema]
});

module.exports = mongoose.model('rua', ruaSchema);
