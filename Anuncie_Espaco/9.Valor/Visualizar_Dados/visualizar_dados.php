<?php
// visualizar_dados.php

// Conexão com banco
$mysqli = new mysqli("localhost", "root", "", "turismo");

if ($mysqli->connect_error) {
    die("Erro de conexão: " . $mysqli->connect_error);
}

// Processar exclusão
if (isset($_GET['excluir'])) {
    $id_excluir = intval($_GET['excluir']);
    $sql_excluir = "DELETE FROM pontos_turisticos WHERE id = ?";
    $stmt = $mysqli->prepare($sql_excluir);
    $stmt->bind_param("i", $id_excluir);

    if ($stmt->execute()) {
        $mensagem = "✅ Registro excluído com sucesso!";
    } else {
        $mensagem = "❌ Erro ao excluir registro!";
    }
    $stmt->close();

    // Redirecionar para evitar reenvio
    header("Location: visualizar_dados.php?msg=" . urlencode($mensagem));
    exit;
}

// Processar edição
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['editar_id'])) {
    $id_editar = intval($_POST['editar_id']);

    // Processar imagens - converter array para JSON
    $imagens_array = [];
    if (isset($_POST['imagens']) && is_array($_POST['imagens'])) {
        foreach ($_POST['imagens'] as $imagem) {
            if (!empty(trim($imagem))) {
                $imagens_array[] = trim($imagem);
            }
        }
    }
    $imagensJSON = !empty($imagens_array) ? json_encode($imagens_array, JSON_UNESCAPED_SLASHES) : null;

    // Coletar dados do formulário
    $dados_editar = [
        'bairro' => $_POST['bairro'] ?? '',
        'banheiros' => intval($_POST['banheiros'] ?? 0),
        'cardsSelecionados' => $_POST['cardsSelecionados'] ?? '',
        'cep' => $_POST['cep'] ?? '',
        'cidade' => $_POST['cidade'] ?? '',
        'cozinhas' => intval($_POST['cozinhas'] ?? 0),
        'estado' => $_POST['estado'] ?? '',
        'hospedes' => intval($_POST['hospedes'] ?? 0),
        'idAmbiente' => $_POST['idAmbiente'] ?? '',
        'idEspaco' => $_POST['idEspaco'] ?? '',
        'lat' => floatval($_POST['lat'] ?? 0),
        'lng' => floatval($_POST['lng'] ?? 0),
        'numero' => $_POST['numero'] ?? '',
        'quartos' => intval($_POST['quartos'] ?? 0),
        'rua' => $_POST['rua'] ?? '',
        'salas' => intval($_POST['salas'] ?? 0),
        'descricao' => $_POST['descricao'] ?? '',
        'valorImovel' => floatval($_POST['valorImovel'] ?? 0),
        'imagens' => $imagensJSON
    ];

    // SQL de atualização
    $sql_editar = "UPDATE pontos_turisticos SET 
        bairro = ?, banheiros = ?, cardsSelecionados = ?, cep = ?, cidade = ?, 
        cozinhas = ?, estado = ?, hospedes = ?, idAmbiente = ?, idEspaco = ?, 
        lat = ?, lng = ?, numero = ?, quartos = ?, rua = ?, salas = ?, 
        descricao = ?, valorImovel = ?, imagens = ?
        WHERE id = ?";

    $stmt = $mysqli->prepare($sql_editar);
    $tipos = "sisssisissddsisissdi";
    $stmt->bind_param(
        $tipos,
        $dados_editar['bairro'],
        $dados_editar['banheiros'],
        $dados_editar['cardsSelecionados'],
        $dados_editar['cep'],
        $dados_editar['cidade'],
        $dados_editar['cozinhas'],
        $dados_editar['estado'],
        $dados_editar['hospedes'],
        $dados_editar['idAmbiente'],
        $dados_editar['idEspaco'],
        $dados_editar['lat'],
        $dados_editar['lng'],
        $dados_editar['numero'],
        $dados_editar['quartos'],
        $dados_editar['rua'],
        $dados_editar['salas'],
        $dados_editar['descricao'],
        $dados_editar['valorImovel'],
        $dados_editar['imagens'],
        $id_editar
    );

    if ($stmt->execute()) {
        $mensagem = "✅ Registro atualizado com sucesso!";
    } else {
        $mensagem = "❌ Erro ao atualizar registro: " . $stmt->error;
    }
    $stmt->close();

    header("Location: visualizar_dados.php?msg=" . urlencode($mensagem));
    exit;
}

// Buscar registro específico para edição
$registro_editar = null;
if (isset($_GET['editar'])) {
    $id_editar = intval($_GET['editar']);
    $sql_buscar = "SELECT * FROM pontos_turisticos WHERE id = ?";
    $stmt = $mysqli->prepare($sql_buscar);
    $stmt->bind_param("i", $id_editar);
    $stmt->execute();
    $result_editar = $stmt->get_result();
    $registro_editar = $result_editar->fetch_assoc();
    
    // Decodificar imagens para array
    if ($registro_editar && !empty($registro_editar['imagens'])) {
        $registro_editar['imagens_array'] = json_decode($registro_editar['imagens'], true);
        if (!is_array($registro_editar['imagens_array'])) {
            $registro_editar['imagens_array'] = [];
        }
    } else {
        $registro_editar['imagens_array'] = [];
    }
    
    $stmt->close();
}

// Buscar todos os dados
$sql = "SELECT * FROM pontos_turisticos ORDER BY criado_em DESC";
$result = $mysqli->query($sql);
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualizar Dados - Painel Admin</title>
    <link rel="stylesheet" href="style_visualizar_dados.css">
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🏠 Painel de Visualização</h1>
            <p>Dados completos dos pontos turísticos cadastrados</p>
            <a href="../../../Home/index.php" class="btn btn-home" style="margin-top: 15px;">
                🏠 Voltar para Home
            </a>
        </div>

        <?php if (isset($_GET['msg'])): ?>
            <div class="mensagem <?php echo strpos($_GET['msg'], '❌') !== false ? 'erro' : ''; ?>">
                <?php echo htmlspecialchars($_GET['msg']); ?>
            </div>
        <?php endif; ?>

        <?php if ($result->num_rows > 0): ?>
            <!-- Estatísticas -->
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number"><?php echo $result->num_rows; ?></div>
                    <div class="stat-label">Total de Registros</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">R$ <?php
                                                $total_sql = "SELECT SUM(valorImovel) as total FROM pontos_turisticos";
                                                $total_result = $mysqli->query($total_sql);
                                                $total_row = $total_result->fetch_assoc();
                                                echo number_format($total_row['total'] ?? 0, 2, ',', '.');
                                                ?></div>
                    <div class="stat-label">Valor Total</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php
                                                $cidades_sql = "SELECT COUNT(DISTINCT cidade) as cidades FROM pontos_turisticos";
                                                $cidades_result = $mysqli->query($cidades_sql);
                                                $cidades_row = $cidades_result->fetch_assoc();
                                                echo $cidades_row['cidades'] ?? 0;
                                                ?></div>
                    <div class="stat-label">Cidades Diferentes</div>
                </div>
            </div>

            <!-- Lista de Registros -->
            <?php while ($row = $result->fetch_assoc()): ?>
                <div class="card">
                    <div class="card-header">
                        <div class="card-id">ID: <?php echo $row['id']; ?></div>
                        <div class="card-actions">
                            <a href="?editar=<?php echo $row['id']; ?>" class="btn btn-editar">
                                ✏️ Editar
                            </a>
                            <a href="?excluir=<?php echo $row['id']; ?>"
                                class="btn btn-excluir"
                                onclick="return confirm('Tem certeza que deseja excluir este registro?')">
                                🗑️ Excluir
                            </a>
                        </div>
                    </div>

                    <div class="card-date">
                        Cadastrado em: <?php echo date('d/m/Y H:i', strtotime($row['criado_em'])); ?>
                    </div>

                    <div class="grid">
                        <!-- Informações Básicas -->
                        <div class="info-group">
                            <div class="info-label">📍 Endereço</div>
                            <div class="info-value">
                                <?php echo $row['rua'] . ', ' . $row['numero'] . ' - ' . $row['bairro']; ?>
                            </div>
                        </div>

                        <div class="info-group">
                            <div class="info-label">🏙️ Cidade/Estado</div>
                            <div class="info-value">
                                <?php echo $row['cidade'] . ' / ' . $row['estado']; ?>
                            </div>
                        </div>

                        <div class="info-group">
                            <div class="info-label">📮 CEP</div>
                            <div class="info-value"><?php echo $row['cep']; ?></div>
                        </div>
                    </div>

                    <div class="grid">
                        <!-- Características -->
                        <div class="info-group">
                            <div class="info-label">🛏️ Quartos</div>
                            <div class="info-value"><?php echo $row['quartos']; ?> quartos</div>
                        </div>

                        <div class="info-group">
                            <div class="info-label">🚿 Banheiros</div>
                            <div class="info-value"><?php echo $row['banheiros']; ?> banheiros</div>
                        </div>

                        <div class="info-group">
                            <div class="info-label">👥 Capacidade</div>
                            <div class="info-value"><?php echo $row['hospedes']; ?> hóspedes</div>
                        </div>

                        <div class="info-group">
                            <div class="info-label">🍳 Cozinhas</div>
                            <div class="info-value"><?php echo $row['cozinhas']; ?> cozinhas</div>
                        </div>

                        <div class="info-group">
                            <div class="info-label">🛋️ Salas</div>
                            <div class="info-value"><?php echo $row['salas']; ?> salas</div>
                        </div>
                    </div>

                    <!-- Valor -->
                    <div class="valor-destaque">
                        💰 Valor do Imóvel: R$ <?php echo number_format($row['valorImovel'], 2, ',', '.'); ?>
                    </div>

                    <!-- Localização -->
                    <div class="localizacao">
                        📍 Coordenadas: Lat <?php echo $row['lat']; ?>, Lng <?php echo $row['lng']; ?>
                    </div>

                    <!-- Descrição -->
                    <?php if (!empty($row['descricao'])): ?>
                        <div class="info-group" style="margin-top: 20px;">
                            <div class="info-label">📝 Descrição</div>
                            <div class="info-value" style="font-style: italic; background: #fff3cd; border-left-color: #ffc107;">
                                "<?php echo htmlspecialchars($row['descricao']); ?>"
                            </div>
                        </div>
                    <?php endif; ?>

                    <!-- Cards Selecionados -->
                    <?php if (!empty($row['cardsSelecionados'])): ?>
                        <div class="info-group">
                            <div class="info-label">🏷️ Categorias</div>
                            <div class="info-value"><?php echo $row['cardsSelecionados']; ?></div>
                        </div>
                    <?php endif; ?>

                    <!-- Imagens -->
                    <div class="images-container">
                        <div class="info-label">🖼️ Galeria de Imagens</div>
                        <div class="images-grid">
                            <?php
                            $imagens = json_decode($row['imagens'] ?? '[]', true);
                            if (!empty($imagens) && is_array($imagens)):
                                foreach ($imagens as $index => $imagem):
                            ?>
                                    <div class="image-item">
                                        <img src="<?php echo htmlspecialchars($imagem); ?>"
                                            alt="Imagem <?php echo $index + 1; ?> do imóvel"
                                            onerror="this.src='https://via.placeholder.com/150?text=Erro+Imagem'">
                                    </div>
                                <?php
                                endforeach;
                            else:
                                ?>
                                <div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 20px;">
                                    Nenhuma imagem cadastrada
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endwhile; ?>

        <?php else: ?>
            <div class="no-data">
                📭 Nenhum dado encontrado no banco de dados.
                <br><br>
                <small>Cadastre alguns pontos turísticos primeiro!</small>
            </div>
        <?php endif; ?>

        <!-- Modal de Edição -->
        <?php if ($registro_editar): ?>
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">✏️ Editar Registro #<?php echo $registro_editar['id']; ?></h2>
                        <a href="?" class="modal-close">×</a>
                    </div>

                    <form method="POST" action="">
                        <input type="hidden" name="editar_id" value="<?php echo $registro_editar['id']; ?>">

                        <div class="grid">
                            <div class="form-group">
                                <label class="form-label">🏙️ Cidade</label>
                                <input type="text" name="cidade" class="form-input"
                                    value="<?php echo htmlspecialchars($registro_editar['cidade']); ?>" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">🏛️ Estado</label>
                                <input type="text" name="estado" class="form-input"
                                    value="<?php echo htmlspecialchars($registro_editar['estado']); ?>" required>
                            </div>
                        </div>

                        <div class="grid">
                            <div class="form-group">
                                <label class="form-label">📍 Rua</label>
                                <input type="text" name="rua" class="form-input"
                                    value="<?php echo htmlspecialchars($registro_editar['rua']); ?>">
                            </div>

                            <div class="form-group">
                                <label class="form-label">🏠 Número</label>
                                <input type="text" name="numero" class="form-input"
                                    value="<?php echo htmlspecialchars($registro_editar['numero']); ?>">
                            </div>

                            <div class="form-group">
                                <label class="form-label">🏘️ Bairro</label>
                                <input type="text" name="bairro" class="form-input"
                                    value="<?php echo htmlspecialchars($registro_editar['bairro']); ?>">
                            </div>
                        </div>

                        <div class="grid">
                            <div class="form-group">
                                <label class="form-label">📮 CEP</label>
                                <input type="text" name="cep" class="form-input"
                                    value="<?php echo htmlspecialchars($registro_editar['cep']); ?>">
                            </div>

                            <div class="form-group">
                                <label class="form-label">💰 Valor do Imóvel</label>
                                <input type="number" step="0.01" name="valorImovel" class="form-input"
                                    value="<?php echo $registro_editar['valorImovel']; ?>" required>
                            </div>
                        </div>

                        <div class="grid">
                            <div class="form-group">
                                <label class="form-label">🛏️ Quartos</label>
                                <input type="number" name="quartos" class="form-input"
                                    value="<?php echo $registro_editar['quartos']; ?>">
                            </div>

                            <div class="form-group">
                                <label class="form-label">🚿 Banheiros</label>
                                <input type="number" name="banheiros" class="form-input"
                                    value="<?php echo $registro_editar['banheiros']; ?>">
                            </div>

                            <div class="form-group">
                                <label class="form-label">👥 Hóspedes</label>
                                <input type="number" name="hospedes" class="form-input"
                                    value="<?php echo $registro_editar['hospedes']; ?>">
                            </div>
                        </div>

                        <div class="grid">
                            <div class="form-group">
                                <label class="form-label">🍳 Cozinhas</label>
                                <input type="number" name="cozinhas" class="form-input"
                                    value="<?php echo $registro_editar['cozinhas']; ?>">
                            </div>

                            <div class="form-group">
                                <label class="form-label">🛋️ Salas</label>
                                <input type="number" name="salas" class="form-input"
                                    value="<?php echo $registro_editar['salas']; ?>">
                            </div>
                        </div>

                        <div class="grid">
                            <div class="form-group">
                                <label class="form-label">📍 Latitude</label>
                                <input type="number" step="any" name="lat" class="form-input"
                                    value="<?php echo $registro_editar['lat']; ?>">
                            </div>

                            <div class="form-group">
                                <label class="form-label">📍 Longitude</label>
                                <input type="number" step="any" name="lng" class="form-input"
                                    value="<?php echo $registro_editar['lng']; ?>">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">📝 Descrição</label>
                            <textarea name="descricao" class="form-textarea"><?php echo htmlspecialchars($registro_editar['descricao']); ?></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">🏷️ Cards Selecionados</label>
                            <input type="text" name="cardsSelecionados" class="form-input"
                                value="<?php echo htmlspecialchars($registro_editar['cardsSelecionados']); ?>">
                        </div>

                        <!-- 🔥 NOVO: SEÇÃO DE EDIÇÃO DE IMAGENS -->
                        <div class="imagens-editar">
                            <div class="form-label">🖼️ Editar Imagens (URLs)</div>
                            
                            <div id="container-imagens">
                                <?php if (!empty($registro_editar['imagens_array'])): ?>
                                    <?php foreach($registro_editar['imagens_array'] as $index => $imagem): ?>
                                        <div class="imagem-item-editar">
                                            <input type="text" 
                                                   name="imagens[]" 
                                                   class="form-input" 
                                                   value="<?php echo htmlspecialchars($imagem); ?>"
                                                   placeholder="https://exemplo.com/imagem.jpg"
                                                   oninput="previewImagem(this)">
                                            <button type="button" class="btn-remover-imagem" onclick="removerImagem(this)">×</button>
                                            <img class="preview-imagem" 
                                                 src="<?php echo htmlspecialchars($imagem); ?>" 
                                                 onerror="this.style.display='none'">
                                        </div>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <div class="imagem-item-editar">
                                        <input type="text" 
                                               name="imagens[]" 
                                               class="form-input" 
                                               placeholder="https://exemplo.com/imagem.jpg"
                                               oninput="previewImagem(this)">
                                        <button type="button" class="btn-remover-imagem" onclick="removerImagem(this)">×</button>
                                        <img class="preview-imagem" style="display: none;">
                                    </div>
                                <?php endif; ?>
                            </div>
                            
                            <button type="button" class="btn-adicionar-imagem" onclick="adicionarImagem()">
                                ➕ Adicionar outra imagem
                            </button>
                        </div>

                        <div class="form-actions">
                            <a href="?" class="btn btn-cancelar">Cancelar</a>
                            <button type="submit" class="btn btn-salvar">💾 Salvar Alterações</button>
                        </div>
                    </form>
                </div>
            </div>

            <script src="script_visualizar_dados.js"></script>
        <?php endif; ?>

        <?php $mysqli->close(); ?>
    </div>
</body>

</html>