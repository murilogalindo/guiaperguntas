const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//Data base
connection
    .authenticate()
    .then(() => {
        console.log('Conexao feita com o banco de dados');
    })
    .catch((mesgErro) => {
        console.log(mesgErro);
    })

//estou dizendo para o Express usar ejs como view engie
app.set('view engine', 'ejs');
app.use(express.static('public'));
//Body parser
app.use(bodyParser.urlencoded({extends:false}));
app.use(bodyParser.json());

//rotas
app.get("/", (req, res) => {
    //render automaticamente olha dentro da página Views
    Pergunta.findAll({raw: true, order:[
        ['id','DESC'] //ASC crescente
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
    
        });
    });

});

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() =>{
        res.redirect("/");
    });

    //res.send("Formulario recebido! Titulo " + titulo + " " + descricao);
});
app.get("/pergunta/:id", (req, res)  => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaid: pergunta.id},
                order:[
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        }else{//Pergunta nao encontrada
            res.redirect("/");

        }
    });

})
app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaid = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaid: perguntaid,
    }).then(() => {
        res.redirect("/pergunta/"+perguntaid); 
    });
});

app.listen(8080,() =>{
    console.log("App rodando");
});

