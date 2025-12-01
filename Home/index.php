<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TripMaker</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body>
    <!-- Conteiner -->
    <div class="slider">
        <!-- Container Carrossel -->
        <div class="list">
            <!-- Cabeçalho -->
            <header class="top-bar">
                <div class="logo-icons">
                    <div class="icone">
                        <i class="fa-solid fa-play logo"></i>
                    </div>
                    <div class="paginas">
                        <a href="../Anuncie_Espaco/1.Ambiente/">Anuncie seu Espaço</a>
                        <a href="../Anuncie_Espaco/1.Ambiente/">Minhas Viagens</a>
                        <a href="../Anuncie_Espaco/1.Ambiente/">Pagina IA</a>
                    </div>

                    <div class="login_icone">
                        <a href="../Login_Cadastro/index.php">
                            <i class="fa-regular fa-circle-user user"></i>
                        </a>
                    </div>

                </div>
            </header>


            <!-- Carrosel Bolinhas -->
            <div class="vertical-indicators">
                <div class="indicator-line"></div>
                <div class="indicator-dot active" data-index="0"></div>
                <div class="indicator-dot" data-index="1"></div>
                <div class="indicator-dot" data-index="2"></div>
                <div class="indicator-dot" data-index="3"></div>
            </div>

            <!-- Carrosel Img Grande  -->
            <div class="item">
                <img src="./img/sorocaba.jpeg" alt="">

                <div class="content">
                    <div class="title">SOROCABA</div>
                    <div class="type">FLOWER</div>
                    <div class="description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti temporibus quis eum consequuntur voluptate quae doloribus distinctio. Possimus, sed recusandae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, aut.
                    </div>
                    <div class="button">
                        <button>SEE MORE</button>
                    </div>
                </div>
            </div>

            <div class="item">
                <img src="./img/itu.webp" alt="">

                <div class="content">
                    <div class="title">ITU</div>
                    <div class="type">MAEDA</div>
                    <div class="description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti temporibus quis eum consequuntur voluptate quae doloribus distinctio. Possimus, sed recusandae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, aut.
                    </div>
                    <div class="button">
                        <button>SEE MORE</button>
                    </div>
                </div>
            </div>

            <div class="item">
                <img src="./img/tatui.jpg" alt="">

                <div class="content">
                    <div class="title">TATUÍ</div>
                    <div class="type">PRAÇA DA MATRIZ</div>
                    <div class="description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti temporibus quis eum consequuntur voluptate quae doloribus distinctio. Possimus, sed recusandae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, aut.
                    </div>
                    <div class="button">
                        <button>SEE MORE</button>
                    </div>
                </div>
            </div>

            <div class="item">
                <img src="./img/boituva.jpg" alt="">

                <div class="content">
                    <div class="title">BOITUVA</div>
                    <div class="type">NATURE</div>
                    <div class="description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti temporibus quis eum consequuntur voluptate quae doloribus distinctio. Possimus, sed recusandae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, aut.
                    </div>
                    <div class="button">
                        <button>SEE MORE</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Carrossel de Cards -->
        <div class="thumbnail">
            <div class="item">
                <img src="./img/tatui.jpg" alt="">
            </div>

            <div class="item">
                <img src="./img/boituva.jpg" alt="">
            </div>
            <div class="item">
                <img src="./img/sorocaba.jpeg" alt="">
            </div>

            <div class="item">
                <img src="./img/itu.webp" alt="">
            </div>
        </div>

        <div class="nextPrevArrows">
            <button class="prev">
                < </button>
                    <button class="next"> > </button>
        </div>
    </div>


    <!-- Adicione isso DEPOIS do slider e ANTES do main -->
    <section class="sobre-nos">
        <div class="sobre-container">
            <h2 class="sobre-titulo">🌍 Sobre o TripMaker</h2>

            <div class="sobre-conteudo">
                <div class="sobre-texto">
                    <h3>Transformamos sua maneira de viajar</h3>
                    <p>Somos uma plataforma inovadora que conecta viajantes a experiências únicas. Nosso objetivo é simplificar o planejamento de viagens, oferecendo tudo em um só lugar.</p>

                    <div class="sobre-destaques">
                        <div class="destaque">
                            <i class="fas fa-check-circle"></i>
                            <span>+500 destinos disponíveis</span>
                        </div>
                        <div class="destaque">
                            <i class="fas fa-check-circle"></i>
                            <span>Roteiros personalizados</span>
                        </div>
                        <div class="destaque">
                            <i class="fas fa-check-circle"></i>
                            <span>Preços sem intermediários</span>
                        </div>
                        <div class="destaque">
                            <i class="fas fa-check-circle"></i>
                            <span>Suporte 24/7</span>
                        </div>
                    </div>

                    <p class="sobre-missao">Nossa missão é tornar cada viagem uma experiência memorável, com praticidade e segurança.</p>

                    <button class="sobre-btn">Comece Agora</button>
                </div>

                <div class="sobre-imagem">
                    <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Viajantes felizes">
                </div>
            </div>
        </div>
    </section>

    <!-- Conteúdo principal -->
    <main class="container">

        <!-- Hospedagem -->
        <section class="section">
            <h2>🏨 Hospedagem</h2>
            <div class="card-grid">
                <div class="card"><img src="https://picsum.photos/300?random=3"></div>
                <div class="card"><img src="https://picsum.photos/300?random=4"></div>
                <div class="card"><img src="https://picsum.photos/300?random=5"></div>
            </div>
        </section>

        <!-- Pontos Turísticos -->
        <section class="section">
            <h2>📍 Pontos Turísticos</h2>
            <div class="card-grid">
                <div class="card"><img src="https://picsum.photos/300?random=6"></div>
                <div class="card"><img src="https://picsum.photos/300?random=7"></div>
                <div class="card"><img src="https://picsum.photos/300?random=8"></div>
            </div>
        </section>

        <!-- Mais Visitados -->
        <section class="section">
            <h2>🔥 Mais Visitados</h2>
            <div class="card-grid">
                <div class="card"><img src="https://picsum.photos/300?random=9"></div>
                <div class="card"><img src="https://picsum.photos/300?random=10"></div>
                <div class="card"><img src="https://picsum.photos/300?random=11"></div>
            </div>
        </section>



    </main>

    <section class="hero-color">

        <div class="hero-color-content">

            <span class="color-tag">Viaje com Quem Entende ✈️</span>

            <h1>
                Encontre Seu Próximo <strong>Destino Perfeito</strong>
            </h1>

            <p>
                Pacotes exclusivos, hospedagens incríveis e experiências únicas pelo Brasil e pelo mundo.
            </p>

            <div class="hero-buttons">
                <a href="#" class="btn primary">Explorar Destinos</a>
                <a href="#" class="btn secondary">Promoções</a>
            </div>
        </div>

        <!-- Mini carrossel de destinos -->
        <div class="travel-slider">
            <img src="https://picsum.photos/250?random=21">
            <img src="https://picsum.photos/250?random=22">
            <img src="https://picsum.photos/250?random=23">
            <img src="https://picsum.photos/250?random=24">
        </div>

    </section>

    <footer class="footer">
        <div class="footer-content">

            <div class="footer-col">
                <h3>🌍 Agência TripMaker</h3>
                <p>Descobrindo destinos, criando memórias. Sua viagem começa aqui.</p>
            </div>

            <div class="footer-col">
                <h4>Links Rápidos</h4>
                <ul>
                    <li><a href="#">Hospedagem</a></li>
                    <li><a href="#">Pontos Turísticos</a></li>
                    <li><a href="#">Pacotes</a></li>
                    <li><a href="#">Contato</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Contato</h4>
                <p>📞 (11) 90000-0000</p>
                <p>📧 contato@explore.com</p>
                <p>📍 Brasil</p>
            </div>

            <div class="footer-col">
                <h4>Redes Sociais</h4>
                <div class="socials">
                    <a href="#">📘</a>
                    <a href="#">📸</a>
                    <a href="#">🐦</a>
                    <a href="#">▶️</a>
                </div>
            </div>

        </div>

        <div class="footer-bottom">
            © 2025 Agência TripMaker — João Otávio e Guilherme Cristian.
        </div>
    </footer>

    <script src="app.js"></script>
</body>

</html>