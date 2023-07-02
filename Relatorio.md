# Relatorio


# Introdução

Para a cadeira de Engenharia Web foi-nos proposto a realização de um trabalho prático. Para este trabalho foram-nos dados exatamente 4 temas, sendo que o escolhido foi o "Ruas de Braga". Assim, ficamos responsabilizados por desenvolver
um sistema capaz de armazenar, consultar e adicionar/remover/editar recursos relativos às ruas e casas de braga. Para além disso teriamos de fazer uma diferenciação entre utilizadores, cada um com permissões diferentes.




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
    desc: paraSchema,
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
    paragrafo: paraSchema,
    casas: [casaSchema],
    comentarios: [comentarioSchema]
});
```

No que toca à API, permitimos que o utilizador obtenha a lista de ruas, podendo fazer querys para qualquer campo, e usando o sufixo _like para fazer uma procura por expressão regular. Pode obter a lista de nomes de ruas, obter uma rua pelo seu id, obter uma rua pelo seu nome, uma lista de ruas filtradas por data (se contém essa data ou não nas referências), obter uma lista de ruas filtrada por lugar (se contém esse lugarou não nas referências), obter uma casa pelo seu id, adicionar uma rua, adicionar uma casa a uma rua (identificada pelo seu id), modificar uma rua e apagar uma rua.


## Funcionalidades da plataforma 

Agora iremos explorar todas as funcionalidades implementadas no nosso trabalho.

### Inserção de novas ruas e casas

Todos os utilizadores são capazes de adicionar novos registos para a lista de casas ou de ruas, adicionando informações básicas sobre as mesmas. Quando se adicionam ruas. É possível mais tarde entrar na página da rua para editar os restantes parâmetros (casas, posts, entre outros)

### Utilização da Google API

Achamos que seria uma boa ideia implementar a API da Google de forma a facilitar a visualização das ruas no Google Maps.

### Upload de Imagens

Para além da implementação da API da Google, todos os utilizadores podem adicionar imagens à rua.

### Search Bar



## Autenticação

Esta camada aplicacional está, principalmente, responsável por todas as questões relacionadas com a autenticação e registo de utilizadores da plataforma. Como referido acima, recorremos à utilização de **jsonwebtoken** para realizar a autenticação de todos os utilizadores, recorrendo, depois, a esse token para obter dados da API.

A cada utilizador é também associado um nível de acesso( Utilizador ou Admin), sendo que os Utilizadores podem fazer todas as funcionalidades exceto a eliminação de comentários que é exclusiva dos Admins.


# Conclusão

Chegando ao fim do nosso trabalho prático achamos que conseguimos aplicar os conhecimentos que ganhamos ao longo do decorrer do ano nesta Unidade Curricular.
Achamos que conseguimos alcançar todos os objetivos estabelecidos por nós, com exceção da implementação do docker que deveríamos ter reservado algum tempo para o setup do mesmo.
