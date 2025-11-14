let path = require('path');
let express = require('express');
let app = express();

let Database = require('./model/database');
let ProdutosDB = require('./model/produtos');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.urlencoded({ extended: false }));


app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/main', async (req, res) => {
    const data = await ProdutosDB.find();
    res.render('main', { database: data });
});


app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    const user = await Database.findUser(usuario);

    if (!user) {
        return res.render('login', { error: "Usuário não encontrado!" });
    }

    if (user.senha !== senha) {
        return res.render('login', { error: "Senha incorreta!" });
    }

    res.redirect('/main');
});


app.post('/addProduto', async (req, res) => {
    const { nome, preco, tamanho } = req.body;

    await ProdutosDB.insert(nome, preco, tamanho);

    res.redirect('/main');
});


app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
