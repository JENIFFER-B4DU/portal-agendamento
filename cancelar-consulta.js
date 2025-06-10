document.addEventListener("DOMContentLoaded", () => {
  // const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const historicoAgendamento =
    JSON.parse(localStorage.getItem("historicoAgendamentos")) || [];
  const pacienteLogado =
    JSON.parse(localStorage.getItem("pacienteLogado")) || [];
  // pegar o histórico de agendamentos do paciente logado
  const pacienteHistorico = historicoAgendamento.filter(
    (p) => p.idPaciente === pacienteLogado.cpf
  );
  // const senha = localStorage.getItem("senha");
  // const pacienteIndex = pacientes.findIndex((p) => p.senha === senha);
  // const paciente = pacientes[pacienteIndex];
  const lista = document.getElementById("lista-consultas");

  if (!pacienteHistorico || pacienteHistorico.length === 0) {
    lista.innerHTML = "<li>📭 Nenhuma consulta agendada.</li>";
    return;
  }

  pacienteHistorico.forEach((consulta, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <span>
          📌 ${consulta.data} às ${consulta.horario}<br>
          🩺 ${consulta.especialidade} com ${consulta.medico}
        </span>
        <button onclick="cancelarConsulta(${index})">Cancelar</button>
      `;
    lista.appendChild(li);
  });

  window.cancelarConsulta = function (index) {
    if (confirm("Deseja mesmo cancelar esta consulta?")) {
      // remove a consulta do pacienteHistorico
      pacienteHistorico.splice(index, 1);

      // atualiza o histórico geral no localStorage
      const novoHistorico = historicoAgendamento
        .filter((p) => p.idPaciente !== pacienteLogado.cpf)
        .concat(pacienteHistorico);

      localStorage.setItem(
        "historicoAgendamentos",
        JSON.stringify(novoHistorico)
      );
      alert("Consulta cancelada com sucesso!");
      location.reload();
    }
  };
});

function voltar() {
  window.location.href = "painel.html";
}
