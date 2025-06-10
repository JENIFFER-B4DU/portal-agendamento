// Dados e configurações iniciais
const medicosPorEspecialidade = {
  Cardiologia: ["Dra. Ana Cardoso", "Dr. Bruno Lima", "Dr. Carlos Torres"],
  Dermatologia: ["Dra. Fernanda Melo", "Dr. Igor Pires", "Dra. Júlia Fernandes"],
  Ortopedia: ["Dr. Lucas Rocha", "Dr. Marcelo Alves", "Dra. Sofia Martins"],
  Pediatria: ["Dra. Beatriz Ramos", "Dr. Rafael Nunes", "Dra. Camila Teixeira"]
};

const valorConsultaPadrao = 150.0;

const especialidadeSelect = document.getElementById("especialidade");
const medicoSelect = document.getElementById("medico");
const listaConsultas = document.getElementById("lista-consultas");
const mensagemFinal = document.getElementById("mensagem-final");
const respostaAgendamento = document.getElementById("resposta-agendamento");
const comPlanoRadio = document.getElementById("comPlano");
const avisoPlano = document.getElementById("aviso-plano");
const valorTotalEl = document.getElementById("valor-total");
const campoPagamento = document.getElementById("campo-pagamento");

// Dados do plano
let planoValido = false;
let planoNome = "";
let descontoPlano = 0;

const dadosPlano = JSON.parse(localStorage.getItem("planoPaciente"));
if (dadosPlano) {
  planoNome = dadosPlano.tipo || "";
  planoValido = true;

  switch (planoNome) {
    case "basico":
      descontoPlano = 30;
      break;
    case "premium":
      descontoPlano = 50;
      break;
    case "platinum":
      descontoPlano = 100;
      break;
  }
}

// Define limite de data
document.addEventListener("DOMContentLoaded", () => {
  const hoje = new Date();
  const dataMinima = hoje.toISOString().split("T")[0];
  document.getElementById("data").setAttribute("min", dataMinima);

  comPlanoRadio.disabled = false;

  if (planoValido) {
    avisoPlano.textContent = `✅ Seu plano (${planoNome}) foi validado com sucesso.`;
    avisoPlano.style.display = "block";
  } else {
    avisoPlano.style.display = "none";
  }
});

// Atualiza médicos ao trocar especialidade
especialidadeSelect.addEventListener("change", () => {
  const especialidade = especialidadeSelect.value;
  medicoSelect.innerHTML = "<option value=''>Selecione...</option>";

  if (medicosPorEspecialidade[especialidade]) {
    medicosPorEspecialidade[especialidade].forEach(medico => {
      const option = document.createElement("option");
      option.value = medico;
      option.textContent = medico;
      medicoSelect.appendChild(option);
    });
  }
});

// Utilitário: formata data para BR
function formatarDataISOParaBR(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Controle de agendamentos
let carrinhoConsultas = [];

function adicionarConsulta() {
  const especialidade = especialidadeSelect.value;
  const medico = medicoSelect.value;
  const dataISO = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;
  const tipoConsulta = document.querySelector('input[name="tipoConsulta"]:checked')?.value;

  if (!especialidade || !medico || !dataISO || !horario || !tipoConsulta) {
    alert("Preencha todos os campos antes de adicionar.");
    return;
  }

  if (tipoConsulta === "plano" && !planoValido) {
    alert("Para utilizar essa modalidade, valide seu plano na área do painel. Caso prefira, selecione a opção de Consulta Particular.");
    return;
  }

  let valor = valorConsultaPadrao;
  if (tipoConsulta === "plano") {
    valor = valorConsultaPadrao * (1 - descontoPlano / 100);
  }

  const novaConsulta = {
    especialidade,
    medico,
    data: formatarDataISOParaBR(dataISO),
    horario,
    valor: valorConsultaPadrao.toFixed(2),
    valorFinal: valor.toFixed(2),
    tipoConsulta,
    descontoAplicado: tipoConsulta === "plano" && descontoPlano > 0 && descontoPlano < 100,
    cobertoIntegral: tipoConsulta === "plano" && descontoPlano === 100
  };

  carrinhoConsultas.push(novaConsulta);
  atualizarCarrinho();
  limparFormulario();
}

function removerConsulta(index) {
  carrinhoConsultas.splice(index, 1);
  atualizarCarrinho();
}

// Atualiza lista e mostra/oculta forma de pagamento
function atualizarCarrinho() {
  listaConsultas.innerHTML = "";
  let total = 0;

  carrinhoConsultas.forEach((consulta, index) => {
    const li = document.createElement("li");
    li.textContent = `${consulta.data} - ${consulta.horario} | ${consulta.especialidade} com ${consulta.medico} | R$ ${consulta.valorFinal}`;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Excluir";
    btnRemover.onclick = () => removerConsulta(index);

    li.appendChild(btnRemover);
    listaConsultas.appendChild(li);

    total += parseFloat(consulta.valorFinal);
  });

  valorTotalEl.textContent = `Total: R$ ${total.toFixed(2)}`;

  // Exibe campo de pagamento se houver valor a pagar
  const totalPago = parseFloat(calcularTotal());
  campoPagamento.style.display = totalPago > 0 ? "block" : "none";
}

function calcularTotal() {
  return carrinhoConsultas
    .filter(c => c.tipoConsulta === "particular" || c.descontoAplicado)
    .reduce((soma, c) => soma + parseFloat(c.valorFinal), 0)
    .toFixed(2);
}

// Confirmação ao finalizar o agendamento
function confirmarAgendamento() {
  if (carrinhoConsultas.length === 0) {
    alert("Adicione pelo menos uma consulta antes de confirmar.");
    return;
  }

  const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked')?.value;
  const total = calcularTotal();

  if (total > 0 && !formaPagamento) {
    alert("Selecione uma forma de pagamento.");
    return;
  }

  let resumo = "Consulta(s) Agendada(s) com Sucesso!<br><br>";

  carrinhoConsultas.forEach((consulta) => {
    let modalidade = "";

    if (consulta.tipoConsulta === "particular") {
      modalidade = "Particular";
    } else if (consulta.cobertoIntegral) {
      modalidade = `Coberta pelo plano (${planoNome})`;
    } else if (consulta.descontoAplicado) {
      modalidade = `Plano com ${descontoPlano}% de desconto (${planoNome})`;
    }

    resumo += `
      Consulta com <strong>${consulta.medico}</strong> (${consulta.especialidade})<br>
      Data: <strong>${consulta.data}</strong> às <strong>${consulta.horario}</strong> – ${modalidade}<br><br>
    `;
  });

  if (total > 0) {
    resumo += `<strong>Total a pagar:</strong> R$ ${total} via <strong>${formaPagamento.toUpperCase()}</strong>`;
  } else {
    resumo += `Todas as consultas foram cobertas pelo plano de saúde.`;
  }

  mensagemFinal.innerHTML = resumo;
  respostaAgendamento.style.display = "block";

  // Salva histórico de agendamentos com dados extras
  const pacienteLogado = JSON.parse(localStorage.getItem("pacienteLogado"));
  const idPaciente = pacienteLogado?.cpf || "desconhecido";
  const timestamp = new Date().toISOString();

  const agendamentosComInfo = carrinhoConsultas.map(consulta => ({
    ...consulta,
    idPaciente,
    agendadoEm: timestamp
  }));

  const historicoExistente = JSON.parse(localStorage.getItem("historicoAgendamentos")) || [];
  const novoHistorico = [...historicoExistente, ...agendamentosComInfo];

  localStorage.setItem("historicoAgendamentos", JSON.stringify(novoHistorico));

  // Limpa carrinho e formulário
  carrinhoConsultas = [];
  atualizarCarrinho();
  document.getElementById("form-agendamento").reset();
  limparFormulario();
}

// Limpa campos do formulário
function limparFormulario() {
  especialidadeSelect.selectedIndex = 0;
  medicoSelect.innerHTML = "<option value=''>Selecione...</option>";
  document.getElementById("data").value = "";
  document.getElementById("horario").value = "";
  document.getElementById("particular").checked = true;
}

// Evento de clique no botão de confirmar
document
  .querySelector(".botoes-carrinho button")
  ?.addEventListener("click", confirmarAgendamento);
