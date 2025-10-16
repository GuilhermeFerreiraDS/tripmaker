<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="style.css" />
    <title>Sign in & Sign up Form</title>
    <style>
        .alert {
            padding: 15px;
            margin: 10px 20px;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            min-width: 300px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>

<body>
    <!-- Mensagens de feedback -->
    <?php if (isset($_SESSION['sucesso'])): ?>
        <div class="alert alert-success">
            <?php echo $_SESSION['sucesso']; unset($_SESSION['sucesso']); ?>
        </div>
    <?php endif; ?>

    <?php if (isset($_SESSION['erro'])): ?>
        <div class="alert alert-error">
            <?php echo $_SESSION['erro']; unset($_SESSION['erro']); ?>
        </div>
    <?php endif; ?>

    <div class="container">

        <a href="../Home/index.php" class="button-voltar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" >
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>        
        </a>

        <div class="forms-container">
            <div class="signin-signup">

                <!-- login -->
                <form action="includes/login.php" method="POST" class="sign-in-form">
                    <h2 class="title">Login</h2>
                    <div class="input-field">
                        <i class="fas fa-user"></i>
                        <input type="text" name="username" placeholder="Username ou Email" required />
                    </div>
                    <div class="input-field">
                        <i class="fas fa-lock"></i>
                        <input type="password" name="password" placeholder="Password" required />
                    </div>

                    <input type="submit" value="Login" class="btn solid" />

                    <p class="social-text">Ou faça login nas plataformas sociais</p>

                    <div class="social-media">
                        <a href="#" class="social-icon">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="social-icon">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="social-icon">
                            <i class="fab fa-google"></i>
                        </a>
                        <a href="#" class="social-icon">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </form>

                <!-- Cadastro -->
                <form action="includes/cadastro.php" method="POST" class="sign-up-form">
                    <h2 class="title">Cadastro</h2>
                    <div class="input-field">
                        <i class="fas fa-user"></i>
                        <input type="text" name="username" placeholder="Username" required />
                    </div>
                    <div class="input-field">
                        <i class="fas fa-envelope"></i>
                        <input type="email" name="email" placeholder="Email" required />
                    </div>
                    <div class="input-field">
                        <i class="fas fa-lock"></i>
                        <input type="password" name="password" placeholder="Password" required />
                    </div>

                    <input type="submit" class="btn" value="Cadastro" />

                    <p class="social-text">Ou Cadastra-se nas plataformas sociais</p>

                    <div class="social-media">
                        <a href="#" class="social-icon">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="social-icon">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="social-icon">
                            <i class="fab fa-google"></i>
                        </a>
                        <a href="#" class="social-icon">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </form>

            </div>
        </div>

        <div class="panels-container">
            <div class="panel left-panel">
                <div class="content">
                    <h3>Novo aqui?</h3>
                    <p>
                        Crie uma conta para aproveitar todos os recursos do nosso sistema de turismo!
                    </p>
                    <button class="btn transparent" id="sign-up-btn">Cadastro</button>
                </div>
                <img src="img/moto.svg" class="image" alt="" />
            </div>

            <div class="panel right-panel">
                <div class="content">
                    <h3>Um de nós?</h3>
                    <p>
                        Faça login para acessar sua conta e explorar os pontos turísticos!
                    </p>
                    <button class="btn transparent" id="sign-in-btn">Login</button>
                </div>
                <img src="img/mundo.svg" class="image" alt="" />
            </div>
        </div>
    </div>

    <script src="app.js"></script>
    <script>
        // Remove as mensagens de alerta após 5 segundos
        setTimeout(function() {
            const alerts = document.querySelectorAll('.alert');
            alerts.forEach(alert => {
                alert.style.display = 'none';
            });
        }, 5000);
    </script>
</body>

</html>