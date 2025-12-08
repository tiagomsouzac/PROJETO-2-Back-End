const { MongoClient } = require('mongodb');

module.exports = class CategoriasDB {
    static async connect() {
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        return client.db('banco1'); // mesmo banco dos outros
    }

    static async find() {
        const db = await this.connect();
        return await db.collection('categorias').find().toArray();
    }

    static async insert(categoria) {
        const db = await this.connect();

        // 🔒 Validação essencial
        if (!categoria || !categoria.nome) {
            throw new Error("Categoria inválida: é necessário informar o nome.");
        }

        const doc = {
            nome: categoria.nome,
            descricao: categoria.descricao || "",
            createdAt: categoria.createdAt || new Date()
        };

        return await db.collection('categorias').insertOne(doc);
    }
}
