<?php
session_start();
require_once 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    // Verifica se o EMAIL já existe (apenas pelo email)
    $sql = "SELECT id FROM usuarios WHERE email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        $_SESSION['erro'] = "Email já cadastrado! Use outro email.";
        header("Location: ../index.php");
        exit();
    }
    
    // Cria hash da senha
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insere no banco com tipo 'user' por padrão
    $sql = "INSERT INTO usuarios (username, email, password, tipo) VALUES (?, ?, ?, 'user')";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute([$username, $email, $password_hash])) {
        $_SESSION['sucesso'] = "Cadastro realizado com sucesso! Faça login.";
        header("Location: ../index.php");
    } else {
        $_SESSION['erro'] = "Erro ao cadastrar. Tente novamente.";
        header("Location: ../index.php");
    }
} else {
    header("Location: ../index.php");
}
?>