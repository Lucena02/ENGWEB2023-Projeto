# Relatorio




## API de Dados

A definição da API de dados teve que ser dividida em duas partes:

1. Análise e Tratamento do Dataset
2. Definição do Modelo da BD e da API

### 1. Análise e Tratamento do Dataset 

Nesta parte, começamos por analisar o ficheiro .xls referente às ruas, que explica a sintaxe do ficheiro .xml de cada rua, pensando em como iria ser retratado isso na base de dados e como poderíamos tratar os mesmos para os importar para a base de dados.

O modelo que optamos por serguir será explicado mais à frente. Quanto ao tratamento, este foi feito em Python, tirando partido dos módulos padrão:

* [json]{https://docs.python.org/3/library/json.html} - utilizado para escrever _dicionários_ de python em notação json;
* [xml]{https://docs.python.org/3/library/xml.etree.elementtree.html} (usando deste apenas a classe xml.etree.ElementTree) - utilizado para fazer ra leitura da informação dos ficheiros .xml;
* [re]{https://docs.python.org/3/library/re.html} - utilizado para tratar alguns casos em que haviam mudanças de linha indevidas no ficheiro .xml;
* [os]{https://docs.python.org/3/library/os.html} - utilizado para listar todos os ficheiros que são precisos processar.

Foi criada ainda uma script que tira partido da API de dados desenvolvida para fazer a importação do dataset para a Base de Dados, podendo isso ser feito tirando partido do comando `bash mongoimport -d EWruasDeBraga -c ruas --file dataset.json --jsonArray`.

### 2. Definição do Modelo da BD e da API

Ao analisar os dados, maior parte dos dados presentes neles podem ser mantidos da mesma maneira que aparecem, havendo apenas um problema nos parágrafos, em que tinhamos tags dentro da tag `xml <para>`, introduzidos no meio do texto. Nesse caso decimos que as tags que aparecem dentro desses parágrafos vão ser tratadas como referências e armazenadas num objeto aparte, ficando o texto armazenado de forma corrrida.

Deste modo, o modelo da BD tem o seguinte formato:

```js
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
    enfiteutas: [String],
    foro: String,
    desc: [paraSchema],
    vista: String
});

var comentarioSchema = new mongoose.Schema({
    autor: String,
    data: String,
    texto: String
});

var ruaSchema = new mongoose.Schema({
    _id: Number,
    nome: String,
    pos: posSchema, 
    figuras: [figuraSchema],
    paragrafos: [paraSchema],
    casas: [casaSchema],
    comentarios: [comentarioSchema]
});
```

No que toca à API, permitimos que o utilizador obtenha a lista de ruas, podendo fazer querys para qualquer campo, e usando o sufixo _like para fazer uma procura por expressão regular. Pode obter a lista de nomes de ruas, obter uma rua pelo seu id, obter uma rua pelo seu nome, uma lista de ruas filtradas por data (se contém essa data ou não nas referências), obter uma lista de ruas filtrada por lugar (se contém esse lugarou não nas referências), obter uma casa pelo seu id, adicionar uma rua, adicionar uma casa a uma rua (identificada pelo seu id), modificar uma rua e apagar uma rua.
