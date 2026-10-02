const CHAVE_USUARIO = "usuarioLosPitchulos";
const CHAVE_FOTO = "fotoPerfilLosPitchulos";
const CHAVE_PEDIDO = "losPitchulosPedidoConfirmado";

const nomeUsuario = document.getElementById("nomeUsuario");
const emailUsuario = document.getElementById("emailUsuario");
const fotoPerfil = document.getElementById("fotoPerfil");
const iniciaisPerfil = document.getElementById("iniciaisPerfil");
const escolherFoto = document.getElementById("escolherFoto");
const formularioEdicao = document.getElementById("formEditarPerfil");
const botaoEditar = document.getElementById("editarPerfil");
const statusPedido = document.getElementById("statusPedido");
const resumoUltimoPedido = document.getElementById("resumoUltimoPedido");

function lerObjeto(chave) {
    try {
        return JSON.parse(localStorage.getItem(chave) || "null");
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

function atualizarUsuario(usuario) {
    const nome = usuario?.nome?.trim() || "Visitante";
    const email = usuario?.email?.trim() || "Entre para acessar sua conta.";
    nomeUsuario.textContent = nome;
    emailUsuario.textContent = email;
    iniciaisPerfil.textContent = nome === "Visitante"
        ? "LP"
        : nome.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join("").toLocaleUpperCase("pt-BR");
    document.getElementById("sairConta").hidden = !usuario;
}

function carregarFoto() {
    const fotoSalva = localStorage.getItem(CHAVE_FOTO);
    if (!fotoSalva) return;

    fotoPerfil.src = fotoSalva;
    fotoPerfil.hidden = false;
    iniciaisPerfil.hidden = true;
}

function mostrarUltimoPedido(pedido) {
    if (!pedido || !Array.isArray(pedido.itens) || pedido.itens.length === 0) return;

    resumoUltimoPedido.replaceChildren();
    pedido.itens.forEach((item) => {
        const linha = document.createElement("p");
        const nome = document.createElement("span");
        const subtotal = document.createElement("strong");
        const quantidade = Number(item.quantidade) || 0;

        linha.className = "item-ultimo-pedido";
        nome.textContent = `${quantidade}x ${item.nome || "Produto"}`;
        subtotal.textContent = formatarPreco((Number(item.preco) || 0) * quantidade);
        linha.append(nome, subtotal);
        resumoUltimoPedido.appendChild(linha);
    });

    const total = document.createElement("p");
    const rotuloTotal = document.createElement("span");
    const valorTotal = document.createElement("strong");
    total.className = "total-ultimo-pedido";
    rotuloTotal.textContent = `Pedido ${pedido.numero || "confirmado"}`;
    valorTotal.textContent = pedido.total || "R$ 0,00";
    total.append(rotuloTotal, valorTotal);
    resumoUltimoPedido.appendChild(total);
    statusPedido.textContent = "Confirmado";
    statusPedido.hidden = false;
}

const usuario = lerObjeto(CHAVE_USUARIO);
atualizarUsuario(usuario);
carregarFoto();
mostrarUltimoPedido(lerObjeto(CHAVE_PEDIDO));

botaoEditar.addEventListener("click", () => {
    const editando = !formularioEdicao.hidden;
    if (editando) {
        formularioEdicao.hidden = true;
        botaoEditar.textContent = "Editar perfil";
        return;
    }

    document.getElementById("editarNome").value = usuario?.nome || "";
    document.getElementById("editarEmail").value = usuario?.email || "";
    formularioEdicao.hidden = false;
    botaoEditar.textContent = "Fechar edição";
    document.getElementById("editarNome").focus();
});

formularioEdicao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const usuarioAtualizado = {
        nome: document.getElementById("editarNome").value.trim(),
        email: document.getElementById("editarEmail").value.trim(),
    };

    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuarioAtualizado));
    atualizarUsuario(usuarioAtualizado);
    formularioEdicao.hidden = true;
    botaoEditar.textContent = "Editar perfil";
});

document.getElementById("cancelarEdicao").addEventListener("click", () => {
    formularioEdicao.hidden = true;
    botaoEditar.textContent = "Editar perfil";
});

escolherFoto.addEventListener("change", () => {
    const arquivo = escolherFoto.files[0];
    if (!arquivo || !arquivo.type.startsWith("image/")) return;

    const leitor = new FileReader();
    leitor.addEventListener("load", () => {
        if (typeof leitor.result !== "string") return;
        try {
            localStorage.setItem(CHAVE_FOTO, leitor.result);
            carregarFoto();
        } catch {
            window.alert("A imagem é grande demais para ser salva neste navegador.");
        }
    });
    leitor.readAsDataURL(arquivo);
});

document.getElementById("sairConta").addEventListener("click", () => {
    localStorage.removeItem(CHAVE_USUARIO);
});
