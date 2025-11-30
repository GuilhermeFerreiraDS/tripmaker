<?php
include "conexao.php";

// Recebe dados
$id          = $_POST['id'];
$cidade      = $_POST['cidade'];
$descricao   = $_POST['hospedagem'];
$hospedes    = $_POST['hospedes'];
$dias        = $_POST['dias'];
$cep         = $_POST['cep'];
$status      = $_POST['status'];

// ==============================
// VERIFICAR FOTO NOVA
// ==============================

$novaFoto = null;

if (!empty($_FILES['foto']['name'])) {
    $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
    $permitidas = ['jpg', 'jpeg', 'png'];

    if (!in_array($ext, $permitidas)) {
        die("Formato de imagem inválido. Use JPG ou PNG.");
    }

    $novaFoto = uniqid("img_") . "." . $ext;
    move_uploaded_file($_FILES['foto']['tmp_name'], "uploads/" . $novaFoto);

    // Buscar foto antiga para deletar
    $busca = $conn->query("SELECT imagens FROM pontos_turisticos WHERE id = $id");
    $dados = $busca->fetch_assoc();

    if ($dados['imagens'] && file_exists("uploads/" . $dados['imagens'])) {
        unlink("uploads/" . $dados['imagens']);
    }
}

// ==============================
// UPDATE
// ==============================

if ($novaFoto) {
    // Atualiza com nova imagem
    $sql = "UPDATE pontos_turisticos SET 
                cidade     = '$cidade',
                descricao  = '$descricao',
                hospedes   = '$hospedes',
                quartos    = '$dias',
                cep        = '$cep',
                status     = '$status',
                imagens    = '$novaFoto'
            WHERE id = $id";
} else {
    // Atualiza sem mexer na imagem
    $sql = "UPDATE pontos_turisticos SET 
                cidade     = '$cidade',
                descricao  = '$descricao',
                hospedes   = '$hospedes',
                quartos    = '$dias',
                cep        = '$cep',
                status     = '$status'
            WHERE id = $id";
}

if ($conn->query($sql)) {
    header("Location: minhas_viagens.php");
    exit;
} else {
    echo "Erro ao editar: " . $conn->error;
}
?>
