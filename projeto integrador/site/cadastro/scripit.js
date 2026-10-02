document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const nomeInput = document.getElementById("nome");
  const mensagemSucesso = document.getElementById("mensagem-sucesso");
  const nomeUsuario = document.getElementById("nome-usuario");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); 

    const nomeCompleto = nomeInput.value.trim();
    const primeiroNome = nomeCompleto.split(" ")[0];

    
    form.style.display = "none";

    
    nomeUsuario.textContent = primeiroNome;
    mensagemSucesso.classList.remove("hidden");
  });
});