const { MongoClient } = require('mongodb');

module.exports = class ProdutosDB {
    static async connect() {
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        return client.db('produtosdb'); // nome do seu banco
    }

    static async find() {
        const db = await this.connect();
        return await db.collection('produtosdb').find().toArray(); 
        // coleção: produtos
    }

    static async insert(nome, preco, tamanho) {
        const db = await this.connect();
        return await db.collection('produtosdb').insertOne({
            nome,
            preco,
            tamanho
        });
    }
}
