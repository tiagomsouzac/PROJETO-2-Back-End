const { MongoClient } = require('mongodb');

module.exports = class Database {

    static async connect() {
        // Conexão única com o mesmo banco usado em produtos
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        return client.db('banco1'); 
    }

    // Lista todos os usuários
    static async find() {
        const db = await this.connect();
        return await db.collection('login').find().toArray();
    }

    // Insere um novo usuário
    static async insert(usuario, senha) {
        const db = await this.connect();
        return await db.collection('login').insertOne({
            usuario,
            senha
        });
    }

    // Procura usuário específico
    static async findUser(usuario) {
        const db = await this.connect();
        return await db.collection('login').findOne({ usuario });
    }
}
