const formBusca = document.getElementById("form-busca");
const campoBusca = document.getElementById("busca-pratos");
const botaoEndereco = document.getElementById("editar-endereco");

const enderecoSalvo = localStorage.getItem("enderecoEntrega");
if (enderecoSalvo) {
    botaoEndereco.textContent = enderecoSalvo;
}

botaoEndereco.addEventListener("click", () => {
    const novoEndereco = window.prompt(
        "Digite seu endereço de entrega:",
        botaoEndereco.textContent.trim()
    );

    if (novoEndereco && novoEndereco.trim()) {
        const endereco = novoEndereco.trim();
        botaoEndereco.textContent = endereco;
        localStorage.setItem("enderecoEntrega", endereco);
    }
});

formBusca.addEventListener("submit", (event) => {
    event.preventDefault();
    const consulta = campoBusca.value.trim();

    if (!consulta) {
        campoBusca.focus();
        return;
    }

    const termoNormalizado = consulta.toLocaleLowerCase("pt-BR");
    const paginaCardapio = termoNormalizado.includes("burrito")
        ? "../desc_prod/index.html"
        : "../cardapio/index.html";

    window.location.href = `${paginaCardapio}?q=${encodeURIComponent(consulta)}`;
});
