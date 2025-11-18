<?php
// salvar_ponto.php

// Ativar erros para debug
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Headers
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Receber dados JSON
$input = file_get_contents("php://input");
$dados = json_decode($input, true);

if (!$dados) {
    echo json_encode(["sucesso" => false, "erro" => "Nenhum dado recebido"]);
    exit;
}

// Conexão com banco
$mysqli = new mysqli("localhost", "root", "", "turismo");

if ($mysqli->connect_error) {
    echo json_encode(["sucesso" => false, "erro" => "Erro de conexão: " . $mysqli->connect_error]);
    exit;
}

// Preparar dados
$bairro = $dados['bairro'] ?? '';
$banheiros = intval($dados['banheiros'] ?? 0);
$cardsSelecionados = $dados['cardsSelecionados'] ?? '';
$cep = $dados['cep'] ?? '';
$cidade = $dados['cidade'] ?? '';
$cozinhas = intval($dados['cozinhas'] ?? 0);
$estado = $dados['estado'] ?? '';
$hospedes = intval($dados['hospedes'] ?? 0);
$idAmbiente = $dados['idAmbiente'] ?? '';
$idEspaco = $dados['idEspaco'] ?? '';
$lat = floatval($dados['lat'] ?? 0);
$lng = floatval($dados['lng'] ?? 0);
$numero = $dados['numero'] ?? '';
$quartos = intval($dados['quartos'] ?? 0);
$rua = $dados['rua'] ?? '';
$salas = intval($dados['salas'] ?? 0);
$descricao = $dados['descricao'] ?? '';
$valorImovel = floatval($dados['valorImovel'] ?? 0);

// Converter imagens para JSON
$imagensJSON = json_encode($dados['imagens'] ?? [], JSON_UNESCAPED_SLASHES);

// SQL com TODAS as colunas
$sql = "INSERT INTO pontos_turisticos (
    bairro, banheiros, cardsSelecionados, cep, cidade, cozinhas,
    estado, hospedes, idAmbiente, idEspaco, lat, lng, numero,
    quartos, rua, salas, descricao, imagens, valorImovel
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    echo json_encode(["sucesso" => false, "erro" => "Erro no prepare: " . $mysqli->error]);
    exit;
}

// Tipos corretos para 19 parâmetros
$tipos = "sisssisissddsisissd";

$stmt->bind_param(
    $tipos,
    $bairro, $banheiros, $cardsSelecionados, $cep, $cidade, $cozinhas,
    $estado, $hospedes, $idAmbiente, $idEspaco, $lat, $lng, $numero,
    $quartos, $rua, $salas, $descricao, $imagensJSON, $valorImovel
);

if ($stmt->execute()) {
    $id_inserido = $stmt->insert_id;
    echo json_encode([
        "sucesso" => true, 
        "id_inserido" => $id_inserido,
        "mensagem" => "Ponto turístico salvo com sucesso!"
    ]);
} else {
    echo json_encode([
        "sucesso" => false, 
        "erro" => "Erro ao executar: " . $stmt->error
    ]);
}

$stmt->close();
$mysqli->close();
?>