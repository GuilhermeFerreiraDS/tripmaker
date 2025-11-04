<?php
// salvar_ponto_turistico.php

// Configurações simples
header("Content-Type: application/json; charset=UTF-8");

// Recebe os dados
$json = file_get_contents('php://input');
$dados = json_decode($json, true);

// Log simples
error_log("Dados recebidos no PHP");

if (!$dados) {
    echo json_encode(["success" => false, "message" => "Dados vazios"]);
    exit;
}

// Configurações do banco
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "turismo";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "INSERT INTO pontos_turisticos (
        nome, bairro, rua, numero, cidade, estado, cep, lat, lng, 
        descricao, imagens, categoria, preco_estimado, banheiros, 
        quartos, salas, cozinhas, hospedes, id_ambiente, id_espaco, 
        cards_selecionados, data_criacao
    ) VALUES (
        :nome, :bairro, :rua, :numero, :cidade, :estado, :cep, :lat, :lng,
        :descricao, :imagens, :categoria, :preco_estimado, :banheiros,
        :quartos, :salas, :cozinhas, :hospedes, :id_ambiente, :id_espaco,
        :cards_selecionados, NOW()
    )";
    
    $stmt = $conn->prepare($sql);
    
    // Bind dos parâmetros
    $stmt->bindValue(':nome', $dados['nome'] ?? 'Novo Ponto');
    $stmt->bindValue(':bairro', $dados['bairro'] ?? '');
    $stmt->bindValue(':rua', $dados['rua'] ?? '');
    $stmt->bindValue(':numero', $dados['numero'] ?? '');
    $stmt->bindValue(':cidade', $dados['cidade'] ?? '');
    $stmt->bindValue(':estado', $dados['estado'] ?? '');
    $stmt->bindValue(':cep', $dados['cep'] ?? '');
    $stmt->bindValue(':lat', $dados['lat'] ?? null);
    $stmt->bindValue(':lng', $dados['lng'] ?? null);
    $stmt->bindValue(':descricao', $dados['descricao'] ?? '');
    $stmt->bindValue(':imagens', json_encode($dados['imagens'] ?? []));
    $stmt->bindValue(':categoria', $dados['categoria'] ?? 'turismo');
    $stmt->bindValue(':preco_estimado', $dados['preco_estimado'] ?? 0);
    $stmt->bindValue(':banheiros', $dados['banheiros'] ?? '');
    $stmt->bindValue(':quartos', $dados['quartos'] ?? '');
    $stmt->bindValue(':salas', $dados['salas'] ?? '');
    $stmt->bindValue(':cozinhas', $dados['cozinhas'] ?? '');
    $stmt->bindValue(':hospedes', $dados['hospedes'] ?? '');
    $stmt->bindValue(':id_ambiente', $dados['id_ambiente'] ?? '');
    $stmt->bindValue(':id_espaco', $dados['id_espaco'] ?? '');
    $stmt->bindValue(':cards_selecionados', $dados['cards_selecionados'] ?? '');
    
    $stmt->execute();
    $id = $conn->lastInsertId();
    
    echo json_encode([
        "success" => true,
        "message" => "Salvo com sucesso!",
        "id" => $id
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erro BD: " . $e->getMessage()
    ]);
}
?>