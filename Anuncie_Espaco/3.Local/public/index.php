<?php
require __DIR__ . '/../vendor/autoload.php'; // Carrega o composer
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$googleMapsKey = $_ENV['GOOGLE_MAPS_KEY'];
?>


<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Local do Imóvel</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
</head>

<body>
    <main>
        <div class="container">
            <div class="container-img">
                <img src="../img/img.svg" alt="Imagem do imóvel">
            </div>

            <div class="container-anuncio">
                <div class="texto-abertura">
                    <h1>Selecione o local do seu imóvel no mapa!</h1>
                </div>

                <div class="cards-container">
                    <div class="cards-explicativo">
                        <div class="card">
                            <input id="address" type="text" placeholder="Digite o endereço do imóvel">
                            <div id="map"></div>
                        </div>

                       <button id="confirmButton" class="btn-confirm">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script src="pull_push.js"></script>
    <script src="script.js"></script>


    <!-- Leaflet -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <!-- Google Maps API com chave do .env -->
    <script src="https://maps.googleapis.com/maps/api/js?key=<?php echo $googleMapsKey; ?>&libraries=places&language=pt-BR"></script>
   
</body>

</html>