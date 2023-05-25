//Importando o modulo
const express = require("express");

//Copia do express para a variável app(criando uma instancia do express)
const app = express();

//Importando o bodyparser(biblioteca que pega os dados do formulário)
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/pergunta");
const Resposta = require("./database/Resposta");

//Database
connection 
    .authenticate()
    .then(() =>{
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) =>{
        console.log(msgErro);
    })

//Dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs');
//Dizendo para o Express aceitar arquivos estaticos(css, arquivos javascrit de front, arquivos de imagem)
app.use(express.static('public'));

//BodyParser
//Linkando o bodyparser no express
app.use(bodyParser.urlencoded({extended: false}));
//Permite ler dados de formulários enviados via json(utilizado quando trabalhando com API)
app.use(bodyParser.json());

//Rotas
app.get("/", (req, res) =>{
    //raw : true (pegar apenas os dados da tabela)
    //findAll equivalente a SELECT ALL FROM perguntas
    //order: ordenando o id de maneira decrescente
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC']    // ASC = Crescente || DESC = Decrescente
    ]}).then(perguntas =>{
        console.log(perguntas);
        res.render("index",{
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req, res) =>{
    res.render("perguntar");
});

//Rotas do tipo POST geralmente são utilizadas para receber dados de um formulario
app.post("/salvarpergunta", (req,res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    console.log("Formulário recebido! titulo " + titulo + " " +" descricao " + descricao);
    //"Insert"
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    });
});

app.get("/pergunta/:id", (req, res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where:{id: id}
    }).then(pergunta =>{
        if(pergunta != undefined){ //pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else{ //não encontrada
            res.redirect("/");
        }
    });  // "findOne" busca um dado no banco de dados com uma condição
});

app.post("/responder", (req,res)=>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect("/pergunta/"+perguntaId);
    });
});

//Rodar a aplicação
app.listen(8080, ()=>{
    console.log("App rodando!");
});