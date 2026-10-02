const EMAIL_SAC = "joao.pedrofsilva28@gmail.com";
const formulario = document.getElementById("formFeedback");
const campoMensagem = document.getElementById("mensagem");
const contadorMensagem = document.getElementById("contadorMensagem");
const statusEnvio = document.getElementById("statusEnvio");
const fallbackEmail = document.getElementById("fallbackEmail");

campoMensagem.addEventListener("input", () => {
    contadorMensagem.textContent = `${campoMensagem.value.length} / 3000`;
});

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;

    const dados = new FormData(formulario);
    const nome = String(dados.get("nome")).trim();
    const email = String(dados.get("email")).trim();
    const assunto = String(dados.get("assunto")).trim();
    const mensagem = String(dados.get("mensagem")).trim();
    const assuntoEmail = `Feedback SAC - ${assunto}`;
    const corpoEmail = [
        `Nome: ${nome}`,
        `E-mail para resposta: ${email}`,
        `Assunto: ${assunto}`,
        "",
        "Feedback:",
        mensagem,
    ].join("\n");
    const linkEmail = `mailto:${EMAIL_SAC}?subject=${encodeURIComponent(assuntoEmail)}&body=${encodeURIComponent(corpoEmail)}`;

    fallbackEmail.href = linkEmail;
    fallbackEmail.hidden = false;
    statusEnvio.textContent = "Abrindo seu aplicativo de e-mail com o feedback preenchido...";
    window.location.href = linkEmail;
});
