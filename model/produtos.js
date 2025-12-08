const { MongoClient } = require('mongodb');

module.exports = class ProdutosDB {
    static async connect() {
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        return client.db('banco1'); // banco principal
    }

    static async find() {
        const db = await this.connect();
        return await db.collection('produtos').find().toArray();
    }

    // Agora recebe OBJETO Produto corretamente
    static async insert(produto) {
        const db = await this.connect();

        // Validação básica
        if (!produto || !produto.nome || !produto.preco || !produto.tamanho) {
            throw new Error("Produto inválido: falta nome, preço ou tamanho.");
        }

        const doc = {
            nome: produto.nome,
            preco: produto.preco,
            tamanho: produto.tamanho,
            categoria: produto.categoria || null, // corrigido
            createdAt: new Date()
        };

        return await db.collection('produtos').insertOne(doc);
    }
};
