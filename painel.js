document.addEventListener("DOMContentLoaded", function() {
  // Recupera o paciente logado diretamente como objeto (já deve ter sido salvo assim no login)
  const pacienteLogado = JSON.parse(localStorage.getItem("pacienteLogado"));

  // Verifica se os dados estão disponíveis
  if (!pacienteLogado) {
    alert("Paciente não encontrado. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  // Saudação personalizada no topo do painel
  const header = document.querySelector("header");
  const saudacao = document.createElement("p");
  saudacao.textContent = `Olá, ${pacienteLogado.nome?.split(" ")[0]}! Seu portal está pronto para uso.`;
  saudacao.style.marginTop = "8px";
  saudacao.style.fontSize = "0.95rem";
  saudacao.style.color = "#555";
  header.appendChild(saudacao);

  // Preenchendo os dados do paciente na interface
  document.getElementById("nome").textContent = pacienteLogado.nome || "—";
  document.getElementById("cpf").textContent = pacienteLogado.cpf || "—";
  document.getElementById("email").textContent = pacienteLogado.email || "—";
  document.getElementById("endereco").textContent = pacienteLogado.endereco || "—";
  document.getElementById("dataNascimento").textContent = pacienteLogado.dataNascimento || "—";
  document.getElementById("telefone").textContent = pacienteLogado.telefone || "—";
  

  // Habilita botão de Receita Médica se houver histórico de consultas
  const btnReceita = document.getElementById("btnReceita");
  if (pacienteLogado.historicoConsultas && pacienteLogado.historicoConsultas.length > 0) {
    btnReceita.disabled = false;
    btnReceita.classList.add("receita-ativa");
    btnReceita.addEventListener("click", function() {
      alert("Receita médica disponível. (Funcionalidade em desenvolvimento)");
    });
  }

  // Funções de redirecionamento dos botões
  window.agendarConsulta = () => window.location.href = "agendar-consulta.html";
  window.cancelarConsulta = () => window.location.href = "cancelar-consulta.html";
  window.atualizarDados = () => window.location.href = "atualizar-dados.html";
  window.verPlano = () => window.location.href = "plano-saude.html";
  window.abrirDuvidas = () => window.location.href = "duvidas.html";
  window.verHistorico = () => window.location.href = "historico.html";

  // Inclusão de dependente
  window.incluirDependente = function() {
    window.location.href = "incluir-dependente.html";
  };
});
