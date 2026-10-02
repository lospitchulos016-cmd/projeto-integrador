const form = document.getElementById("login");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const btn = document.getElementById("entrar");

function setError(input, msg) {
  document.getElementById(input.id + "-error").textContent = msg;
  input.setAttribute("aria-invalid", msg ? "true" : "false");
}

[email, senha].forEach(i => i.addEventListener("input", () => setError(i, "")));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let ok = true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, "Email inválido, digite novamente.");
    ok = false;
  }
  if (senha.value.length < 6) {
    setError(senha, "A senha no mínimo precisa ter 6 caracteres.");
    ok = false;
  }
  if (!ok) return (email.getAttribute("aria-invalid") === "true" ? email : senha).focus();

  btn.disabled = true;
  btn.textContent = "Entrando...";
  try {
    await new Promise(r => setTimeout(r, 800));
    const emailUsuario = email.value.trim();
    const nomeUsuario = emailUsuario.split("@")[0].replace(/[._-]+/g, " ");
    localStorage.setItem("usuarioLosPitchulos", JSON.stringify({
      nome: nomeUsuario,
      email: emailUsuario
    }));
    window.location.href = "../home/index.html";
  } catch {
    setError(senha, "E-mail ou senha incorretos.");
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
});
