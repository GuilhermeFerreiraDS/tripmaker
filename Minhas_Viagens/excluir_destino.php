<?php
include "conexao.php";

if (!isset($_GET['id'])) {
    die("ID inválido.");
}

$id = intval($_GET['id']);

// ==========================
// BUSCA A FOTO PARA REMOVER
// ==========================

$busca = $conn->prepare("SELECT imagens FROM pontos_turisticos WHERE id = ?");
$busca->bind_param("i", $id);
$busca->execute();
$busca->bind_result($foto);
$busca->fetch();
$busca->close();

// Remove foto se existir
if ($foto && file_exists("uploads/" . $foto)) {
    unlink("uploads/" . $foto);
}

// ==========================
// DELETA DO BANCO
// ==========================

$delete = $conn->prepare("DELETE FROM pontos_turisticos WHERE id = ?");
$delete->bind_param("i", $id);

if ($delete->execute()) {
    header("Location: minhas_viagens.php");
    exit;
} else {
    echo "Erro ao excluir: " . $delete->error;
}

$delete->close();
$conn->close();
?>
