const { MongoClient, ObjectId } = require('mongodb');

module.exports = class EstoqueDB {

    static async connect() {
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        return client.db('banco1');
    }

    static async find() {
        const db = await this.connect();
        return await db.collection('estoque').find().toArray();
    }

    static async insert(estoque) {
        const db = await this.connect();

        // 🔒 Validação
        if (!estoque || !estoque.produtoId || estoque.quantidade == null) {
            throw new Error("Estoque inválido: produtoId e quantidade são obrigatórios.");
        }

        const doc = {
            produtoId: new ObjectId(estoque.produtoId), // conversão correta
            quantidade: estoque.quantidade,
            local: estoque.local || "Não informado",
            updatedAt: estoque.updatedAt || new Date()
        };

        return await db.collection('estoque').insertOne(doc);
    }

    static async updateQuantidade(produtoId, novaQuantidade) {
        const db = await this.connect();

        // Conversão para ObjectId se vier string
        const id = typeof produtoId === "string" ? new ObjectId(produtoId) : produtoId;

        return await db.collection('estoque').updateOne(
            { produtoId: id },
            { 
                $set: { 
                    quantidade: novaQuantidade,
                    updatedAt: new Date()
                } 
            },
            { upsert: true }
        );
    }
}
