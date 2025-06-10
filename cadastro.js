document.addEventListener('DOMContentLoaded', () => {
  const cpfInput = document.getElementById('cpf');
  const telefoneInput = document.getElementById('telefone');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const dataNascimentoInput = document.getElementById('dataNascimento');

  // Máscara de CPF (ex: 000.000.000-00)
  cpfInput.addEventListener('input', () => {
    let cpf = cpfInput.value.replace(/\D/g, '').slice(0, 11);
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    cpfInput.value = cpf;
  });

  // Apenas letras no nome
  nomeInput.addEventListener('input', () => {
    nomeInput.value = nomeInput.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
  });

  // E-mail minúsculo
  emailInput.addEventListener('input', () => {
    emailInput.value = emailInput.value.toLowerCase();
  });

  // Máscara de telefone (até 11 dígitos + máscara)
  telefoneInput.addEventListener('input', () => {
    let tel = telefoneInput.value.replace(/\D/g, '').slice(0, 11);
    if (tel.length <= 10) {
      tel = tel.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      tel = tel.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    telefoneInput.value = tel;
  });

  // Limita datas futuras
  const hoje = new Date().toISOString().split('T')[0];
  dataNascimentoInput.setAttribute('max', hoje);
});

document.getElementById('form-cadastro').addEventListener('submit', function(event) {
  event.preventDefault();

  const cpfInput = document.getElementById('cpf');
  const cpf = cpfInput.value.replace(/\D/g, '');
  const senha = document.getElementById('senha').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const dataNascimento = document.getElementById('dataNascimento').value;

  // CPF deve conter exatamente 11 dígitos numéricos
  if (!/^\d{11}$/.test(cpf)) {
    alert('O CPF deve conter exatamente 11 números.');
    cpfInput.focus();
    return;
  }

  // Validação de idade mínima (18 anos)
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  const idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  const dia = hoje.getDate() - nascimento.getDate();

  if (idade < 18 || (idade === 18 && (m < 0 || (m === 0 && dia < 0)))) {
    alert('Apenas maiores de 18 anos podem realizar o cadastro.');
    document.getElementById('dataNascimento').focus();
    return;
  }

  // Validação de senha
  if (senha.length < 4) {
    alert('A senha deve ter no mínimo 4 caracteres.');
    document.getElementById('senha').focus();
    return;
  }

  // Verifica se o e-mail já está cadastrado
  let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
  const emailJaExiste = pacientes.some(p => p.email === email);

  if (emailJaExiste) {
    alert('Este e-mail já está cadastrado. Tente outro ou faça login.');
    document.getElementById('email').focus();
    return;
  }

  // Criação do objeto paciente
  const paciente = {
    nome: document.getElementById('nome').value.trim(),
    cpf: cpfInput.value.trim(),
    email: email,
    telefone: document.getElementById('telefone').value.trim(),
    dataNascimento: dataNascimento,
    endereco: document.getElementById('endereco').value.trim(),
    senha: senha,
    historicoConsultas: []
  };

  //localStorage PK
  pacientes.push(paciente);
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
  localStorage.setItem(`paciente_${paciente.cpf}`, JSON.stringify(paciente));


  document.getElementById('resposta-cadastro').innerHTML = `
    <p style="color: green;">Cadastro realizado com sucesso!</p>
    <p><a href="login.html" style="color: #0056b3; text-decoration: underline;">Ir para o Login</a></p>
  `;

  document.getElementById('form-cadastro').reset();
});
