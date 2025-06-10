document.addEventListener("DOMContentLoaded", () => {
  const pacienteLogado = JSON.parse(localStorage.getItem("pacienteLogado"));
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

  // Localiza o paciente logado na lista
  const pacienteIndex = pacientes.findIndex(p => p.cpf === pacienteLogado.cpf && p.email === pacienteLogado.email);
  const paciente = pacientes[pacienteIndex];

  if (pacienteIndex === -1 || !paciente) {
    alert("Paciente não encontrado.");
    return;
  }

  // Preenche os campos com os dados atuais
  document.getElementById("nome").value = paciente.nome || "";
  document.getElementById("cpf").value = paciente.cpf || "";
  document.getElementById("email").value = paciente.email || "";
  document.getElementById("endereco").value = paciente.endereco || "";
  document.getElementById("dataNascimento").value = paciente.dataNascimento || "";
  document.getElementById("telefone").value = paciente.telefone || "";

  // Validação do campo nome - apenas letras e acentos
  document.getElementById("nome").addEventListener("input", e => {
    e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
  });

  // Atualiza os dados
  document.getElementById("formAtualizacao").addEventListener("submit", e => {
    e.preventDefault();

    paciente.nome = document.getElementById("nome").value;
    paciente.email = document.getElementById("email").value;
    paciente.endereco = document.getElementById("endereco").value;
    paciente.telefone = document.getElementById("telefone").value;
 
  //Alterar a senha
    const novaSenha = document.getElementById("novaSenha").value;
    if (novaSenha.trim() !== "") {
    paciente.senha = novaSenha;
}

  //Localstorage
    pacientes[pacienteIndex] = paciente;
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    localStorage.setItem("pacienteLogado", JSON.stringify(paciente));

    alert("Dados atualizados com sucesso!");
    window.location.href = "painel.html";
  });

  // Máscara para telefone
  const telefoneInput = document.getElementById("telefone");
  telefoneInput.addEventListener("input", () => {
    let tel = telefoneInput.value.replace(/\D/g, "").slice(0, 11);
    tel = tel.length <= 10
      ? tel.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
      : tel.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    telefoneInput.value = tel;
  });
});
