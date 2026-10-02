// Os burritos vêm do banco (../banco/banco.json), carregados no fim do arquivo.
let burritos = [];

const CHAVE_CARRINHO = "losPitchulosCarrinho";
let filtroAtual = "todos";
let termoBusca = new URLSearchParams(window.location.search).get("q")?.trim().toLocaleLowerCase("pt-BR") || "";

function lerCarrinho() {
    try {
        const itens = JSON.parse(localStorage.getItem(CHAVE_CARRINHO) || "[]");
        return Array.isArray(itens) ? itens : [];
    } catch {
        return [];
    }
}

function carregarBurritos() {
    return lerCarrinho()
        .filter((item) => item.type === "burrito")
        .reduce((carrinho, item) => {
            const id = Number(String(item.id).replace("burrito-", ""));
            const quantidade = Number(item.quantidade);
            if (burritos.some((produto) => produto.id === id) && quantidade > 0) {
                carrinho[id] = quantidade;
            }
            return carrinho;
        }, {});
}

let carrinho = carregarBurritos();
const listaProdutos = document.getElementById("listaProdutos");
const filtrosAtivos = document.getElementById("filtrosAtivos");
const quantidadeCarrinho = document.getElementById("quantidadeCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const campoBusca = document.getElementById("buscaBurritos");

campoBusca.value = new URLSearchParams(window.location.search).get("q") || "";

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function salvarCarrinho() {
    const outrosItens = lerCarrinho().filter((item) => item.type !== "burrito");
    const itensBurritos = Object.entries(carrinho).map(([id, quantidade]) => {
        const produto = burritos.find((item) => item.id === Number(id));
        return {
            id: `burrito-${produto.id}`,
            type: "burrito",
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            quantidade,
        };
    });
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify([...outrosItens, ...itensBurritos]));
}

function atualizarResumo() {
    const quantidade = Object.values(carrinho).reduce((total, atual) => total + atual, 0);
    const total = Object.entries(carrinho).reduce((soma, [id, atual]) => {
        const produto = burritos.find((item) => item.id === Number(id));
        return soma + produto.preco * atual;
    }, 0);
    quantidadeCarrinho.textContent = `${quantidade} ${quantidade === 1 ? "item" : "itens"}`;
    totalCarrinho.textContent = formatarPreco(total);
    salvarCarrinho();
}

function mostrarProdutos() {
    const encontrados = burritos.filter((produto) => {
        const filtroOk = filtroAtual === "todos" || produto.tags.includes(filtroAtual);
        const texto = `${produto.nome} ${produto.descricao}`.toLocaleLowerCase("pt-BR");
        return filtroOk && texto.includes(termoBusca);
    });

    if (encontrados.length === 0) {
        listaProdutos.innerHTML = '<p class="nenhum-produto">Nenhum burrito encontrado.</p>';
        return;
    }

    listaProdutos.innerHTML = encontrados.map((produto) => `
        <article class="produto">
            <div class="imagem-produto" role="img" aria-label="Burrito">${produto.imagem}</div>
            <div class="detalhes-produto">
                <h2 class="nome-produto">${produto.nome}</h2>
                <p class="descricao-produto">${produto.descricao}</p>
                <div class="produto-bottom">
                    <span class="preco">${formatarPreco(produto.preco)}</span>
                    <button class="btn-adicionar" type="button" data-adicionar="${produto.id}" aria-label="Adicionar ${produto.nome} ao pedido">+</button>
                </div>
            </div>
        </article>
    `).join("");
}

function atualizarFiltro() {
    const nomes = { todos: "Todos", carne: "Carne", vegano: "Vegano" };
    filtrosAtivos.textContent = `[${nomes[filtroAtual]}]`;
}

document.querySelectorAll(".filtro").forEach((botao) => {
    botao.addEventListener("click", () => {
        filtroAtual = botao.dataset.filtro;
        document.querySelectorAll(".filtro").forEach((item) => {
            const ativo = item === botao;
            item.classList.toggle("ativo", ativo);
            item.setAttribute("aria-pressed", String(ativo));
        });
        atualizarFiltro();
        mostrarProdutos();
    });
});

document.getElementById("formBuscaBurritos").addEventListener("submit", (evento) => {
    evento.preventDefault();
    termoBusca = campoBusca.value.trim().toLocaleLowerCase("pt-BR");
    mostrarProdutos();
});

listaProdutos.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-adicionar]");
    if (!botao) return;

    const id = Number(botao.dataset.adicionar);
    carrinho[id] = (carrinho[id] || 0) + 1;
    atualizarResumo();
});

document.getElementById("abrirCarrinho").addEventListener("click", () => {
    window.location.href = "../carrinho/index.html";
});

atualizarFiltro();
Banco.listarProdutos("burrito")
    .then((lista) => {
        burritos = lista;
        carrinho = carregarBurritos();
        mostrarProdutos();
        atualizarResumo();
    })
    .catch((erro) => {
        listaProdutos.innerHTML = `<p class="nenhum-produto">${erro.message}</p>`;
    });
