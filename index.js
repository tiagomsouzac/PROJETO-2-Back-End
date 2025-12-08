let path = require('path');
let express = require('express');
let session = require('express-session');
let app = express();

let Database = require('./model/database');

let ProdutosDB = require('./model/produtos');
let CategoriasDB = require('./model/categorias');
let EstoqueDB = require('./model/estoque');

let Produto = require('./model/produto');
let Categoria = require('./model/categoria');
let Estoque = require('./model/estoqueModel');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: "segredo123",
    resave: false,
    saveUninitialized: false
}));

function autenticar(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

app.get('/login', (req, res) => {
    res.render('login');
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

    req.session.user = { usuario: user.usuario };

    res.redirect('/main');
});

app.get('/main', autenticar, async (req, res) => {
    const produtos = await ProdutosDB.find();
    const categorias = await CategoriasDB.find();

    res.render('main', {
        produtos,
        categorias,
        usuario: req.session.user.usuario 
    });
});

app.post('/addProduto', autenticar, async (req, res) => {
    const { nome, preco, tamanho, categoria } = req.body;
    const novoProduto = new Produto(nome, preco, tamanho, categoria);
    
    await ProdutosDB.insert(novoProduto);
    res.redirect('/main');
});

app.get('/categorias', autenticar, async (req, res) => {
    const categorias = await CategoriasDB.find();
    res.render('categorias', { categorias });
});

app.post('/addCategoria', autenticar, async (req, res) => {
    const { nome } = req.body;
    const novaCategoria = new Categoria(nome);

    await CategoriasDB.insert(novaCategoria);
    res.redirect('/categorias');
});

app.get('/estoque', autenticar, async (req, res) => {
    const estoque = await EstoqueDB.find();
    const produtos = await ProdutosDB.find();

    res.render('estoque', {
        estoque,
        produtos
    });
});

app.post('/addEstoque', autenticar, async (req, res) => {
    const { produtoId, quantidade, local } = req.body;

    const novoEstoque = new Estoque(produtoId, quantidade, local);

    await EstoqueDB.insert(novoEstoque);
    res.redirect('/estoque');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
