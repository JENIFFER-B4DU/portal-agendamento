document.getElementById('form-login').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita o reload da página

    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value.trim();

    if (email === '' || senha === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Busca os pacientes salvos no localStorage
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    // Verifica se há pacientes cadastrados
    if (pacientes.length === 0) {
        alert('Nenhum paciente cadastrado. Por favor, cadastre-se primeiro.');
        return;
    }

    // Busca o paciente com e-mail e senha correspondentes
    const pacienteAutenticado = pacientes.find(paciente =>
        paciente.email === email && paciente.senha === senha
    );

    if (pacienteAutenticado) {
        // Salva os dados do paciente autenticado (objeto completo)
        localStorage.setItem('pacienteLogado', JSON.stringify(pacienteAutenticado));

        // Salva a chave primária (CPF limpo) separadamente
        localStorage.setItem('pacienteLogadoCPF', pacienteAutenticado.cpf.replace(/\D/g, ''));

        // Redireciona para o painel
        window.location.href = "painel.html";
    } else {
        alert('E-mail ou senha inválidos. Verifique suas credenciais ou cadastre-se.');
    }
});
