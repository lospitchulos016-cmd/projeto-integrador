document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const erroCadastro = document.getElementById("erro-cadastro");
  const botao = form.querySelector(".btn-submit");
  const mensagemSucesso = document.getElementById("mensagem-sucesso");
  const nomeUsuario = document.getElementById("nome-usuario");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    erroCadastro.textContent = "";
    botao.disabled = true;

    try {
      const usuario = await Banco.cadastrarUsuario({
        nome: nomeInput.value,
        email: emailInput.value,
        senha: senhaInput.value,
      });

      // Já deixa a pessoa logada depois do cadastro.
      localStorage.setItem("usuarioLosPitchulos", JSON.stringify(usuario));

      form.style.display = "none";
      nomeUsuario.textContent = usuario.nome.split(" ")[0];
      mensagemSucesso.classList.remove("hidden");
    } catch (erro) {
      erroCadastro.textContent = erro.message;
      botao.disabled = false;
    }
  });
});
