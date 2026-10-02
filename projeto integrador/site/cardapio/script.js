

const produtos = [

    {
        id: 1,
        nome: "Taco de Carnitas",

        descricao: "Carne de porco..",

        preco: 22,



        categorias: [
            "picante"
        ]
    },

    {
        id: 2,

        nome: "Taco Baja (peixe)",

        descricao: "Peixe empanado",

        preco: 26,

        categorias: [
            "picante"
        ]
    },

    {
        id: 3,

        nome: "Taco Vegano",

        descricao: "Cogumelos e legumes",

        preco: 20,

        categorias: [
            "vegano"
        ]
    }

];




const CHAVE_CARRINHO_COMPARTILHADO = "losPitchulosCarrinho";

function lerCarrinhoCompartilhado() {
    try {
        const itens = JSON.parse(
            localStorage.getItem(CHAVE_CARRINHO_COMPARTILHADO) || "[]"
        );
        return Array.isArray(itens) ? itens : [];
    } catch {
        return [];
    }
}

function carregarCarrinhoTacos() {
    return lerCarrinhoCompartilhado()
        .filter(item => item.type === "taco")
        .reduce((itens, item) => {
            const id = Number(String(item.id).replace("taco-", ""));
            const quantidade = Number(item.quantidade);
            if (produtos.some(produto => produto.id === id) && quantidade > 0) {
                itens[id] = quantidade;
            }
            return itens;
        }, {});
}

function salvarCarrinhoTacos() {
    const outrosItens = lerCarrinhoCompartilhado()
        .filter(item => item.type !== "taco");
    const itensTacos = Object.entries(carrinho).map(([id, quantidade]) => {
        const produto = produtos.find(item => item.id === Number(id));
        return {
            id: `taco-${produto.id}`,
            type: "taco",
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            quantidade,
        };
    });

    localStorage.setItem(
        CHAVE_CARRINHO_COMPARTILHADO,
        JSON.stringify([...outrosItens, ...itensTacos])
    );
}


let filtroAtual = "todos";

let carrinho = carregarCarrinhoTacos();




const listaProdutos =
    document.getElementById(
        "listaProdutos"
    );

const filtrosAtivos =
    document.getElementById(
        "filtrosAtivos"
    );

const quantidadeCarrinho =
    document.getElementById(
        "quantidadeCarrinho"
    );

const totalCarrinho =
    document.getElementById(
        "totalCarrinho"
    );

const modalCarrinho =
    document.getElementById(
        "modalCarrinho"
    );

const itensCarrinho =
    document.getElementById(
        "itensCarrinho"
    );

const totalModal =
    document.getElementById(
        "totalModal"
    );

const toast =
    document.getElementById(
        "toast"
    );




function formatarPreco(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}



function mostrarProdutos() {

    let produtosFiltrados;


    if (filtroAtual === "todos") {

        produtosFiltrados = produtos;

    } else {

        produtosFiltrados =
            produtos.filter(
                produto =>
                    produto.categorias
                        .includes(
                            filtroAtual
                        )
            );

    }


    if (produtosFiltrados.length === 0) {

        listaProdutos.innerHTML = `

            <p style="
                text-align:center;
                padding:60px 20px;
                color:#666;
                font-size:20px;
            ">

                Nenhum taco encontrado.

            </p>

        `;

        return;

    }


    listaProdutos.innerHTML =
        produtosFiltrados.map(
            produto => `

        <article class="produto">

            <div class="imagem-produto">

                🌮

            </div>


            <div>

                <h2 class="nome-produto">

                    ${produto.nome}

                </h2>


                <p class="descricao-produto">

                    ${produto.descricao}

                </p>


                <div class="produto-bottom">

                    <span class="preco">

                        ${formatarPreco(produto.preco)}

                    </span>

                    <button
                        class="btn-adicionar"
                        type="button"
                        onclick="adicionarCarrinho(${produto.id})"
                        aria-label="Adicionar ${produto.nome} ao pedido"
                    >

                        +

                    </button>

                </div>

            </div>

        </article>

    `
        ).join("");

}


const botoesFiltro = document.querySelectorAll(".filtro");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        filtroAtual = botao.dataset.filtro;
        botoesFiltro.forEach(item => item.classList.remove("ativo"));
        botao.classList.add("ativo");
        atualizarTextoFiltro();
        mostrarProdutos();
    });
});




function atualizarTextoFiltro() {

    if (filtroAtual === "todos") {

        filtrosAtivos.textContent =
            "[Todos]";

    }

    else if (
        filtroAtual === "picante"
    ) {

        filtrosAtivos.textContent =
            "[Picante]";

    }

    else if (
        filtroAtual === "vegano"
    ) {

        filtrosAtivos.textContent =
            "[Vegano]";

    }

}




function adicionarCarrinho(id) {

    if (carrinho[id]) {

        carrinho[id]++;

    }

    else {

        carrinho[id] = 1;

    }


    atualizarCarrinho();


    mostrarToast(
        "Taco adicionado ao pedido!"
    );

}



function alterarQuantidade(
    id,
    quantidade
) {

    if (!carrinho[id]) {

        return;

    }


    carrinho[id] += quantidade;


    if (carrinho[id] <= 0) {

        delete carrinho[id];

    }


    atualizarCarrinho();

    mostrarCarrinho();

}




function atualizarCarrinho() {

    let quantidade = 0;

    let total = 0;


    Object.entries(
        carrinho
    ).forEach(
        ([id, qtd]) => {

            const produto =
                produtos.find(
                    produto =>
                        produto.id ===
                        Number(id)
                );


            quantidade += qtd;

            total +=
                produto.preco * qtd;

        }
    );


    quantidadeCarrinho.textContent =
        `${quantidade} ${
            quantidade === 1
                ? "item"
                : "itens"
        }`;


    totalCarrinho.textContent =
        formatarPreco(total);


    totalModal.textContent =
        formatarPreco(total);

    salvarCarrinhoTacos();

}




function abrirCarrinho() {

    mostrarCarrinho();

    modalCarrinho.classList.add(
        "aberto"
    );

}




function fecharCarrinho() {

    modalCarrinho.classList.remove(
        "aberto"
    );

}




function mostrarCarrinho() {

    const itens =
        Object.entries(
            carrinho
        );


    if (itens.length === 0) {

        itensCarrinho.innerHTML = `

            <p style="
                color:#666;
            ">

                Seu pedido está vazio.

            </p>

        `;

        atualizarCarrinho();

        return;

    }


    itensCarrinho.innerHTML =
        itens.map(
            ([id, quantidade]) => {

                const produto =
                    produtos.find(
                        produto =>
                            produto.id ===
                            Number(id)
                    );


                return `

                    <div class="item-carrinho">

                        <div>

                            <strong>

                                ${produto.nome}

                            </strong>

                            <div>

                                ${formatarPreco(
                                    produto.preco
                                )}

                                cada

                            </div>

                        </div>


                        <div
                            class="
                                controle-quantidade
                            "
                        >

                            <button
                                onclick="
                                    alterarQuantidade(
                                        ${produto.id},
                                        -1
                                    )
                                "
                            >

                                −

                            </button>


                            <span>

                                ${quantidade}

                            </span>


                            <button
                                onclick="
                                    alterarQuantidade(
                                        ${produto.id},
                                        1
                                    )
                                "
                            >

                                +

                            </button>

                        </div>


                        <strong>

                            ${formatarPreco(
                                produto.preco *
                                quantidade
                            )}

                        </strong>

                    </div>

                `;

            }
        ).join("");


    atualizarCarrinho();

}




function finalizarPedido() {

    if (
        Object.keys(carrinho).length === 0
    ) {

        mostrarToast(
            "Adicione algum taco primeiro."
        );

        return;

    }


    carrinho = {};


    atualizarCarrinho();


    fecharCarrinho();


    mostrarToast(
        "Pedido enviado! 🌮"
    );

}




function mostrarToast(
    mensagem
) {

    toast.textContent =
        mensagem;


    toast.classList.add(
        "mostrar"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "mostrar"
                );

            },

            1800
        );

}


function voltar() {

    if (
        window.history.length > 1
    ) {

        history.back();

    }

    else {

        mostrarToast(
            "Voltando..."
        );

    }

}


modalCarrinho.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modalCarrinho
        ) {

            fecharCarrinho();

        }

    }
);




mostrarProdutos();

atualizarCarrinho();

atualizarTextoFiltro();