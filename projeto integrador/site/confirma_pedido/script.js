const CHAVE_PEDIDO = "losPitchulosPedidoConfirmado";
const mensagemSucesso = document.querySelector(".mensagem-sucesso");
const detalhesPedido = document.getElementById("detalhesPedido");
const pedidoAusente = document.getElementById("pedidoAusente");

function carregarPedido() {
    try {
        const pedido = JSON.parse(localStorage.getItem(CHAVE_PEDIDO) || "null");
        if (!pedido || !Array.isArray(pedido.itens) || pedido.itens.length === 0) {
            return null;
        }
        return pedido;
    } catch {
        return null;
    }
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function mostrarPedido(pedido) {
    document.getElementById("numeroPedido").textContent = pedido.numero || "—";
    document.getElementById("enderecoPedido").textContent = pedido.endereco || "Endereço não informado";
    document.getElementById("subtotalConfirmado").textContent = pedido.subtotal || "R$ 0,00";
    document.getElementById("entregaConfirmada").textContent = pedido.entrega || "Grátis";
    document.getElementById("totalConfirmado").textContent = pedido.total || "R$ 0,00";

    const listaItens = document.getElementById("itensConfirmados");
    pedido.itens.forEach((item) => {
        const linha = document.createElement("li");
        const nomeQuantidade = document.createElement("span");
        const subtotal = document.createElement("strong");
        const quantidade = Number(item.quantidade) || 0;
        const preco = Number(item.preco) || 0;

        nomeQuantidade.textContent = `${quantidade}x ${item.nome || "Produto"}`;
        subtotal.textContent = formatarPreco(preco * quantidade);
        linha.append(nomeQuantidade, subtotal);
        listaItens.appendChild(linha);
    });
}

const pedido = carregarPedido();
if (pedido) {
    mostrarPedido(pedido);
} else {
    mensagemSucesso.hidden = true;
    detalhesPedido.hidden = true;
    pedidoAusente.hidden = false;
}
