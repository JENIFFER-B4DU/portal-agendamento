-- FUNCTION e VIEW

USE clinica_agendamentos;

-- Criar a Function para validar planos de saúde (ativo ou vencido)
DELIMITER // 
CREATE FUNCTION validar_plano(plano_id INT) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE validade DATE;
    
    -- Buscar a data de vencimento do plano de saúde
    SELECT data_vencimento INTO validade FROM planos_saude WHERE id = plano_id;
    
    -- Comparar a validade com a data atual 
    RETURN validade >= CURDATE();
END //

DELIMITER ;

-- Inserir exemplos de planos de saúde
INSERT INTO planos_saude (nome, limite_cobertura, data_vencimento)
VALUES ('Plano Teste', 2000.00, '2025-12-31');  
INSERT INTO planos_saude (nome, limite_cobertura, data_vencimento)
VALUES ('Plano Teste', 1000.00, '2024-06-01'); 

-- Testar a FUNCTION com planos diferentes
SELECT validar_plano(1);
SELECT validar_plano(2); 

-- Conferir formato de retorno
SELECT validar_plano(1) AS status_plano;
SELECT validar_plano(2) AS status_plano;

-----------------------------------

USE clinica_agendamentos;

-- Criar VIEW
CREATE VIEW vw_consultas_financeiras AS
SELECT 
    c.id AS consulta_id,
    p.nome AS paciente,
    m.nome AS medico,
    c.data_consulta,
    COALESCE(SUM(pg.valor_pagamento), 0) AS valor_total_pago
FROM consultas c
JOIN pacientes p ON c.paciente_id = p.id
JOIN medicos m ON c.medico_id = m.id
LEFT JOIN pagamentos pg ON c.id = pg.consulta_id
GROUP BY c.id, p.nome, m.nome, c.data_consulta;

-- Teste VIEW
SELECT * FROM vw_consultas_financeiras;
