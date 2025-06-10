// Seletores das seções do HTML
const secaoFuturas = document.getElementById("consultas-futuras");
const secaoPassadas = document.getElementById("consultas-passadas");
const nenhumaConsulta = document.getElementById("nenhuma-consulta");

// Verifica se o paciente está logado
const pacienteLogado = JSON.parse(localStorage.getItem("pacienteLogado"));
if (!pacienteLogado || !pacienteLogado.cpf) {
  alert("Paciente não identificado. Faça login novamente.");
  window.location.href = "login.html";
}

// Dados do histórico salvos no localStorage
const historico = JSON.parse(localStorage.getItem("historicoAgendamentos")) || [];

// Filtra apenas as consultas do paciente logado
const consultasPaciente = historico.filter(
  consulta => consulta.idPaciente === pacienteLogado.cpf
);

// Se não houver nenhuma consulta, mostra mensagem
if (consultasPaciente.length === 0) {
  // nenhumaConsulta.style.display = "block";
  secaoFuturas.style.display = "none";
  secaoPassadas.style.display = "none";
} else {
  // nenhumaConsulta.style.display = "none";
  secaoFuturas.style.display = "block";
  secaoPassadas.style.display = "block";

  // Data/hora atual para comparação
  const agora = new Date();

  // Função auxiliar para criar item de consulta no DOM
  function criarItemConsulta(consulta) {
    const item = document.createElement("li");

    // Detalhes principais
    item.innerHTML = `
      <strong>${consulta.data}</strong> às <strong>${consulta.horario}</strong><br>
      Médico: <strong>${consulta.medico}</strong> (${consulta.especialidade})<br>
      Valor: R$ ${consulta.valorFinal} – Modalidade: ${consulta.tipoConsulta.toUpperCase()}<br>
      Agendado em: <small>${new Date(consulta.agendadoEm).toLocaleString("pt-BR")}</small>
    `;

    return item;
  }

  // Separa consultas passadas e futuras
  consultasPaciente.forEach(consulta => {
    const [dia, mes, ano] = consulta.data.split("/");
    const dataConsulta = new Date(`${ano}-${mes}-${dia}T${consulta.horario}:00`);

    const itemConsulta = criarItemConsulta(consulta);

    if (dataConsulta >= agora) {
      // Consulta futura
      secaoFuturas.querySelector("ul").appendChild(itemConsulta);
    } else {
      // Consulta passada
      secaoPassadas.querySelector("ul").appendChild(itemConsulta);
    }
  });
}
