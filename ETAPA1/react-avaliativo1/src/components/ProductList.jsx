import React, { useState } from "react";
import ProductCard from './ProductCard';

const ProductList = ({ tituloLista }) => {
  const [produtos, setProdutos] = useState([]);
  const [nomeNovoProduto, setNomeNovoProduto] = useState("");
  const [precoNovoProduto, setPrecoNovoProduto] = useState("");
  const [idEditando, setIdEditando] = useState(null);
  const [nomeEditando, setNomeEditando] = useState("");
  const [precoEditando, setPrecoEditando] = useState("");

  // Criar novo produto
  const adicionarProduto = () => {
    if (!nomeNovoProduto.trim() || !precoNovoProduto.trim()) return;
    setProdutos([
      ...produtos,
      { id: Date.now(), name: nomeNovoProduto, price: precoNovoProduto }
    ]);
    setNomeNovoProduto("");
    setPrecoNovoProduto("");
  };

  // Iniciar edição
  const iniciarEdicao = (id) => {
    setIdEditando(id);
    const produtoAtual = produtos.find((p) => p.id === Number(id));
    setNomeEditando(produtoAtual.name);
    setPrecoEditando(produtoAtual.price);
  };

  // Salvar edição
  const salvarEdicao = () => {
    setProdutos(
      produtos.map((p) =>
        p.id === idEditando ? { ...p, name: nomeEditando, price: precoEditando } : p
      )
    );
    cancelarEdicao();
  };

  // Excluir produto
  const excluirProduto = (id) =>
    setProdutos(produtos.filter((p) => p.id !== id));

  // Cancelar edição
  const cancelarEdicao = () => {
    setIdEditando(null);
    setNomeEditando("");
    setPrecoEditando("");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{tituloLista}</h2>
      <input
        type="text"
        value={nomeNovoProduto}
        onChange={(e) => setNomeNovoProduto(e.target.value)}
        placeholder="Digite o nome do produto..."
      />
      <input
        type="text"
        value={precoNovoProduto}
        onChange={(e) => setPrecoNovoProduto(e.target.value)}
        placeholder="Digite o preço do produto..."
      />
      <button onClick={adicionarProduto}>Adicionar Produto</button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {produtos.map((produto) => (
          <li key={produto.id} style={{ margin: "10px 0" }}>
            {idEditando === produto.id ? (
              <>
                <input
                  type="text"
                  value={nomeEditando}
                  onChange={(e) => setNomeEditando(e.target.value)}
                />
                <input
                  type="text"
                  value={precoEditando}
                  onChange={(e) => setPrecoEditando(e.target.value)}
                />
                <button onClick={salvarEdicao}>Salvar</button>
                <a href="#" onClick={cancelarEdicao}>Cancelar</a>
              </>
            ) : (
              <>
                <ProductCard product={produto} />
                <button onClick={() => iniciarEdicao(produto.id)}>Editar</button>
                <button onClick={() => excluirProduto(produto.id)}>Excluir</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
