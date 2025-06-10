// Seleção de elementos do DOM
const tipoPlano = document.getElementById("tipo-plano");
const dataVencimento = document.getElementById("data-vencimento");
const btnValidar = document.getElementById("btn-validar");
const editarCheckbox = document.getElementById("editar-plano");
const resumoPlano = document.getElementById("resumo-plano");
const mensagemResumo = document.getElementById("mensagem-resumo");

// Função que bloqueia ou libera os campos após validação
function toggleCamposPlano(habilitar) {
  tipoPlano.disabled = !habilitar;
  dataVencimento.disabled = !habilitar;
  btnValidar.disabled = !habilitar;
}

// Validação do plano
btnValidar.addEventListener("click", () => {
  const plano = tipoPlano.value;
  const vencimento = new Date(dataVencimento.value);
  const hoje = new Date();
  const diasParaVencer = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));

  if (!plano || isNaN(vencimento)) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Armazena os dados no localStorage
  localStorage.setItem("planoPaciente", JSON.stringify({
    tipo: plano,
    vencimento: dataVencimento.value
  }));

  // Define cobertura com base no plano
  let cobertura = "";
  if (diasParaVencer <= 30) {
    cobertura = "Seu plano está para vencer nos próximos 30 dias. Caso queira prosseguir com agendamento, finalize com a opção de consultas particulares. Temos valores acessíveis para você.";
  } else {
    switch (plano) {
      case "basico":
        cobertura = "Plano Básico validado com sucesso. Você terá até 30% de desconto em nossas especialidades.";
        break;
      case "premium":
        cobertura = "Plano Premium validado com sucesso. Você terá até 50% de desconto em nossas especialidades.";
        break;
      case "platinum":
        cobertura = "Plano Platinum validado com sucesso. Cobertura total para agendamentos disponíveis.";
        break;
    }
  }

  // Mostra resumo e bloqueia os campos
  mensagemResumo.textContent = cobertura;
  resumoPlano.style.display = "block";
  toggleCamposPlano(false);
  editarCheckbox.checked = false;
});

// Permite que o paciente edite os dados novamente se desejar
editarCheckbox.addEventListener("change", (e) => {
  const permitirEdicao = e.target.checked;
  toggleCamposPlano(permitirEdicao);
});
