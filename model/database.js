const { MongoClient } = require('mongodb');

module.exports = class Database {
    static async connect() {
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        return client.db('banco1');
    }

    static async find() {
        const db = await this.connect();
        return await db.collection('login').find().toArray();
    }

    static async insert(usuario, senha) {
        const db = await this.connect();
        return await db.collection('login').insertOne({ usuario, senha });
    }

    static async findUser(usuario) {
        const db = await this.connect();
        return await db.collection('login').findOne({ usuario });
    }
}
