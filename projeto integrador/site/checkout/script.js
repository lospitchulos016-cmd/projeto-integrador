const CHAVE_CARRINHO = "losPitchulosCarrinho";
const TAXA_ENTREGA = 0;
const listaCarrinho = document.getElementById("listaCarrinho");
const subtotalPedido = document.getElementById("subtotalPedido");
const totalPedido = document.getElementById("totalPedido");
const campoEndereco = document.getElementById("enderecoEntrega");
const formulario = document.getElementById("formCheckout");
const botaoFinalizar = document.querySelector(".botao-finalizar");
const mensagemCheckout = document.getElementById("mensagemCheckout");

function lerCarrinho() {
    try {
        const itens = JSON.parse(localStorage.getItem(CHAVE_CARRINHO) || "[]");
        return Array.isArray(itens) ? itens.filter((item) =>
            item && typeof item.id === "string" &&
            typeof item.nome === "string" &&
            Number.isFinite(Number(item.preco)) &&
            Number.isFinite(Number(item.quantidade)) && Number(item.quantidade) > 0
        ) : [];
    } catch {
        return [];
    }
}

function salvarCarrinho(itens) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function desenharCarrinho() {
    const itens = lerCarrinho();
    const subtotal = itens.reduce((soma, item) => soma + Number(item.preco) * Number(item.quantidade), 0);
    const total = subtotal + TAXA_ENTREGA;

    if (itens.length === 0) {
        listaCarrinho.innerHTML = `
            <div class="estado-vazio">
                <p>Seu carrinho está vazio.</p>
                <a href="../cardapio/index.html">Escolher tacos</a>
                <span> ou </span>
                <a href="../desc_prod/index.html">escolher burritos</a>
            </div>
        `;
    } else {
        listaCarrinho.innerHTML = itens.map((item) => `
            <article class="item-carrinho">
                <div class="item-detalhes">
                    <h3>${item.nome}</h3>
                    <p>${item.descricao || ""}</p>
                    <p class="preco-item">${formatarPreco(item.preco)} cada</p>
                </div>
                <div class="controle-quantidade" aria-label="Quantidade de ${item.nome}">
                    <button type="button" data-alterar="${item.id}" data-valor="-1" aria-label="Diminuir quantidade de ${item.nome}">−</button>
                    <span>${item.quantidade}</span>
                    <button type="button" data-alterar="${item.id}" data-valor="1" aria-label="Aumentar quantidade de ${item.nome}">+</button>
                </div>
                <strong class="subtotal-item">${formatarPreco(Number(item.preco) * Number(item.quantidade))}</strong>
            </article>
        `).join("");
    }

    subtotalPedido.textContent = formatarPreco(subtotal);
    totalPedido.textContent = formatarPreco(total);
    botaoFinalizar.disabled = itens.length === 0;
}

const enderecoSalvo = localStorage.getItem("enderecoEntrega");
if (enderecoSalvo) {
    campoEndereco.value = enderecoSalvo;
}

listaCarrinho.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-alterar]");
    if (!botao) return;

    const id = botao.dataset.alterar;
    const variacao = Number(botao.dataset.valor);
    const itens = lerCarrinho();
    const item = itens.find((produto) => produto.id === id);
    if (!item) return;

    item.quantidade = Number(item.quantidade) + variacao;
    salvarCarrinho(itens.filter((produto) => Number(produto.quantidade) > 0));
    desenharCarrinho();
});

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mensagemCheckout.textContent = "";

    const itens = lerCarrinho();
    if (itens.length === 0) {
        mensagemCheckout.textContent = "Adicione produtos antes de confirmar o pedido.";
        return;
    }

    const endereco = campoEndereco.value.trim();
    if (!endereco) {
        campoEndereco.focus();
        return;
    }

    localStorage.setItem("enderecoEntrega", endereco);
    const pedido = {
        numero: `LP-${Date.now().toString().slice(-6)}`,
        endereco,
        itens,
        subtotal: totalPedido.textContent,
        entrega: "Grátis",
        total: totalPedido.textContent,
        criadoEm: new Date().toISOString(),
    };
    localStorage.setItem("losPitchulosPedidoConfirmado", JSON.stringify(pedido));
    salvarCarrinho([]);
    window.location.href = "../confirma_pedido/index.html";
});

desenharCarrinho();
