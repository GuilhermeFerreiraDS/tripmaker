<?php
include "conexao.php";

// Coleta dos dados
$cidade      = $_POST['cidade'];
$descricao   = $_POST['hospedagem'];
$hospedes    = $_POST['hospedes'];
$dias        = $_POST['dias'];
$cep         = $_POST['cep'];
$status      = $_POST['status'];

// ==============================
// TRATAMENTO DA FOTO
// ==============================

$fotoNome = null;

if (!empty($_FILES['foto']['name'])) {
    $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));

    // Extensões permitidas
    $permitidas = ['jpg', 'jpeg', 'png'];

    if (!in_array($ext, $permitidas)) {
        die("Formato de imagem inválido. Use JPG ou PNG.");
    }

    // Nome único
    $fotoNome = uniqid("img_") . "." . $ext;

    move_uploaded_file($_FILES['foto']['tmp_name'], "uploads/" . $fotoNome);
}

// ==============================
// SALVAR NO BANCO
// ==============================

$sql = "INSERT INTO pontos_turisticos 
        (cidade, descricao, hospedes, quartos, cep, imagens, status)
        VALUES 
        ('$cidade', '$descricao', '$hospedes', '$dias', '$cep', '$fotoNome', '$status')";

if ($conn->query($sql)) {
    header("Location: minhas_viagens.php");
    exit;
} else {
    echo "Erro ao salvar: " . $conn->error;
}
?>
