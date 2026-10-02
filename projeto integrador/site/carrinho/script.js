const CHAVE_CARRINHO = "losPitchulosCarrinho";
const listaCarrinho = document.getElementById("listaCarrinho");
const subtotalCarrinho = document.getElementById("subtotalCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const linkCheckout = document.getElementById("irCheckout");
const mensagemCarrinho = document.getElementById("mensagemCarrinho");

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

function escaparHtml(valor) {
	return String(valor).replace(/[&<>"']/g, (caractere) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
	})[caractere]);
}

function desenharCarrinho() {
	const itens = lerCarrinho();
	const subtotal = itens.reduce((soma, item) => soma + Number(item.preco) * Number(item.quantidade), 0);

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
					<h3>${escaparHtml(item.nome)}</h3>
					<p>${escaparHtml(item.descricao || "")}</p>
					<p class="preco-item">${formatarPreco(item.preco)} cada</p>
					<button class="remover-item" type="button" data-remover="${escaparHtml(item.id)}">Remover</button>
				</div>
				<div class="controle-quantidade" aria-label="Quantidade de ${escaparHtml(item.nome)}">
					<button type="button" data-alterar="${escaparHtml(item.id)}" data-valor="-1" aria-label="Diminuir quantidade">−</button>
					<span>${Number(item.quantidade)}</span>
					<button type="button" data-alterar="${escaparHtml(item.id)}" data-valor="1" aria-label="Aumentar quantidade">+</button>
				</div>
				<strong class="subtotal-item">${formatarPreco(Number(item.preco) * Number(item.quantidade))}</strong>
			</article>
		`).join("");
	}

	subtotalCarrinho.textContent = formatarPreco(subtotal);
	totalCarrinho.textContent = formatarPreco(subtotal);
	linkCheckout.setAttribute("aria-disabled", String(itens.length === 0));
	linkCheckout.tabIndex = itens.length === 0 ? -1 : 0;
}

listaCarrinho.addEventListener("click", (evento) => {
	const botaoRemover = evento.target.closest("[data-remover]");
	const botaoQuantidade = evento.target.closest("[data-alterar]");
	const id = botaoRemover?.dataset.remover || botaoQuantidade?.dataset.alterar;
	if (!id) return;

	let itens = lerCarrinho();
	if (botaoRemover) {
		itens = itens.filter((item) => item.id !== id);
		mensagemCarrinho.textContent = "Produto removido do carrinho.";
	} else {
		const item = itens.find((produto) => produto.id === id);
		if (!item) return;

		item.quantidade = Number(item.quantidade) + Number(botaoQuantidade.dataset.valor);
		itens = itens.filter((produto) => Number(produto.quantidade) > 0);
		mensagemCarrinho.textContent = "Quantidade atualizada.";
	}

	salvarCarrinho(itens);
	desenharCarrinho();
});

linkCheckout.addEventListener("click", (evento) => {
	if (linkCheckout.getAttribute("aria-disabled") === "true") {
		evento.preventDefault();
		mensagemCarrinho.textContent = "Adicione um produto antes de continuar.";
	}
});

window.addEventListener("storage", (evento) => {
	if (evento.key === CHAVE_CARRINHO) desenharCarrinho();
});

desenharCarrinho();
