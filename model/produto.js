module.exports = class Produto {
    constructor(nome, preco, tamanho, categoria) {
        this.nome = nome;
        this.preco = preco;
        this.tamanho = tamanho;
        this.categoria = categoria; // ligação com a classe Categoria
    }
};
