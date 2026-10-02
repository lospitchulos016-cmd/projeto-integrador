const Banco = (() => {
    const CHAVE_BANCO = "losPitchulosBanco";
    const URL_BANCO = new URL("banco.json", document.currentScript.src);

    function salvar(dados) {
        localStorage.setItem(CHAVE_BANCO, JSON.stringify(dados));
    }

    async function carregar() {
        const salvo = localStorage.getItem(CHAVE_BANCO);
        if (salvo) {
            try {
                return JSON.parse(salvo);
            } catch {
                // Banco corrompido: recarrega a partir do arquivo.
            }
        }

        let resposta;
        try {
            resposta = await fetch(URL_BANCO);
        } catch {
            throw new Error("Não foi possível abrir banco.json. Abra o site por um servidor local (ex.: Live Server do VS Code).");
        }
        if (!resposta.ok) throw new Error(`Erro ao carregar banco.json (${resposta.status}).`);

        const dados = await resposta.json();
        salvar(dados);
        return dados;
    }

    function proximoId(lista) {
        return lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
    }

    function normalizarEmail(email) {
        return String(email).trim().toLocaleLowerCase("pt-BR");
    }

    async function gerarHash(texto) {
        const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
        return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
    }

    function semSenha({ senhaHash, ...usuario }) {
        return usuario;
    }

    async function listarProdutos(tipoCategoria) {
        const dados = await carregar();
        const categoria = dados.categorias.find((item) => item.tipo === tipoCategoria);
        return dados.produtos.filter((produto) =>
            produto.ativo && (!tipoCategoria || produto.categoriaId === categoria?.id)
        );
    }

    async function cadastrarUsuario({ nome, email, senha }) {
        const dados = await carregar();
        const emailNormalizado = normalizarEmail(email);
        if (dados.usuarios.some((usuario) => usuario.email === emailNormalizado)) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        const usuario = {
            id: proximoId(dados.usuarios),
            nome: nome.trim(),
            email: emailNormalizado,
            senhaHash: await gerarHash(senha),
            criadoEm: new Date().toISOString(),
        };
        dados.usuarios.push(usuario);
        salvar(dados);
        return semSenha(usuario);
    }

    async function entrar(email, senha) {
        const dados = await carregar();
        const emailNormalizado = normalizarEmail(email);
        const senhaHash = await gerarHash(senha);
        const usuario = dados.usuarios.find((item) =>
            item.email === emailNormalizado && item.senhaHash === senhaHash
        );
        return usuario ? semSenha(usuario) : null;
    }

    async function atualizarUsuario(id, { nome, email }) {
        const dados = await carregar();
        const usuario = dados.usuarios.find((item) => item.id === id);
        if (!usuario) throw new Error("Usuário não encontrado.");

        const emailNormalizado = normalizarEmail(email);
        if (dados.usuarios.some((item) => item.id !== id && item.email === emailNormalizado)) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        usuario.nome = nome.trim();
        usuario.email = emailNormalizado;
        salvar(dados);
        return semSenha(usuario);
    }

    async function salvarPedido(pedido) {
        const dados = await carregar();
        const novoPedido = {
            id: proximoId(dados.pedidos),
            status: "confirmado",
            criadoEm: new Date().toISOString(),
            ...pedido,
        };
        dados.pedidos.push(novoPedido);
        salvar(dados);
        return novoPedido;
    }

    async function listarPedidos(usuarioId) {
        const dados = await carregar();
        return dados.pedidos.filter((pedido) => pedido.usuarioId === usuarioId);
    }

    async function salvarFeedback(feedback) {
        const dados = await carregar();
        const novoFeedback = {
            id: proximoId(dados.feedbacks),
            criadoEm: new Date().toISOString(),
            ...feedback,
        };
        dados.feedbacks.push(novoFeedback);
        salvar(dados);
        return novoFeedback;
    }

    function resetar() {
        localStorage.removeItem(CHAVE_BANCO);
    }

    async function exportar() {
        return carregar();
    }

    return {
        listarProdutos,
        cadastrarUsuario,
        entrar,
        atualizarUsuario,
        salvarPedido,
        listarPedidos,
        salvarFeedback,
        resetar,
        exportar,
    };
})();
