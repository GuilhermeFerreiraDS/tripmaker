<?php
session_start();
require_once 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Busca usuário
    $sql = "SELECT * FROM usuarios WHERE username = ? OR email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$username, $username]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($usuario && password_verify($password, $usuario['password'])) {
        // Login bem-sucedido
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nome'] = $usuario['username'];
        $_SESSION['usuario_tipo'] = $usuario['tipo'];
        $_SESSION['usuario_email'] = $usuario['email'];
        
        // Mensagem de sucesso
        $_SESSION['sucesso'] = "Login realizado com sucesso!";
        
        // Redireciona imediatamente
        header("Location: ../../Home/index.php");
        exit();
    } else {
        $_SESSION['erro'] = "Usuário ou senha incorretos!";
        header("Location: ../index.php");
        exit();
    }
} else {
    header("Location: ../index.php");
    exit();
}
?>