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
    const usuario = await Banco.entrar(email.value, senha.value);
    if (!usuario) throw new Error("E-mail ou senha incorretos.");

    localStorage.setItem("usuarioLosPitchulos", JSON.stringify(usuario));
    window.location.href = "../home/index.html";
  } catch (erro) {
    setError(senha, erro.message);
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
});
