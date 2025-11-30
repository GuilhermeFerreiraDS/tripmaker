<?php
include "conexao.php";

// Buscar viagens
$sql = "SELECT * FROM pontos_turisticos ORDER BY id DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>Minhas Viagens</title>

<!-- Feather Icons -->
<script src="https://unpkg.com/feather-icons"></script>

<!-- CSS externo -->
<link rel="stylesheet" href="assets/css/style.css">

</head>
<body>

<div class="container">

<!-- MENU SUPERIOR -->
<div class="topbar">
    <a href="../Home/index.php" class="btn-voltar"><i data-feather="arrow-left"></i> Voltar</a>

    <button class="btn-novo-topo" onclick="abrirNovo()">
        + Novo Destino
    </button>
</div>

<h1 class="titulo">Minhas Viagens</h1>

<!-- LISTA DE CARDS -->
<div class="cards">

<?php while($row = $result->fetch_assoc()): ?>

<?php
// COR DO STATUS
$statusTexto = $row['status'];
$statusCor = "#999";

if ($statusTexto == "Em andamento") $statusCor = "#f1c40f"; // amarelo
if ($statusTexto == "Finalizada")   $statusCor = "#2ecc71"; // verde
?>

<div class="card">

    <!-- FOTO -->
    <img src="uploads/<?= $row['imagens'] ?: 'placeholder.png' ?>" alt="Foto da viagem">

    <div class="card-content">

        <h3><?= $row['cidade'] ?></h3>

        <!-- STATUS COLORIDO -->
        <div class="status-badge" style="
            background: <?= $statusCor ?>;
            padding: 6px 14px;
            border-radius: 10px;
            color: white;
            font-size: 13px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 12px;
        ">
            <?= $statusTexto ?>
        </div>

        <div class="info-line">
            <i data-feather="home"></i>
            <span><?= $row['descricao'] ?></span>
        </div>

        <div class="info-line">
            <i data-feather="users"></i>
            <span><?= $row['hospedes'] ?> hóspedes</span>
        </div>

        <div class="info-line">
            <i data-feather="clock"></i>
            <span><?= $row['quartos'] ?> dias</span>
        </div>

        <div class="info-line">
            <i data-feather="map-pin"></i>
            <span>CEP: <?= $row['cep'] ?></span>
        </div>
    </div>

    <!-- MAPA -->
    <iframe
        class="mapa"
        src="https://www.google.com/maps?q=<?= $row['cep'] ?>&z=15&output=embed">
    </iframe>

    <!-- BOTÕES -->
    <div class="card-actions">

        <button class="btn-edit" onclick="abrirEditar(
            '<?= $row['id'] ?>',
            '<?= $row['cidade'] ?>',
            '<?= $row['descricao'] ?>',
            '<?= $row['hospedes'] ?>',
            '<?= $row['quartos'] ?>',
            '<?= $row['cep'] ?>',
            '<?= $row['status'] ?>'
        )">Editar</button>

        <button class="btn-del" onclick="abrirExcluir('<?= $row['id'] ?>')">
            Excluir
        </button>

    </div>

</div>

<?php endwhile; ?>

</div>

</div>

<!-- ==========================
      MODAL — NOVO DESTINO
=========================== -->
<div class="modal-bg" id="modal-novo">
    <div class="modal">
        <h2>Cadastrar Novo Destino</h2>

        <form action="salvar_destino.php" method="POST" enctype="multipart/form-data">

            <label>Cidade</label>
            <select name="cidade" required>
                <option value="">Selecione</option>
                <option>Sorocaba</option>
                <option>Votorantim</option>
                <option>Araçoiaba da Serra</option>
                <option>Salto de Pirapora</option>
                <option>Itu</option>
                <option>Salto</option>
                <option>Tietê</option>
                <option>Boituva</option>
                <option>Porto Feliz</option>
                <option>Capela do Alto</option>
                <option>Alumínio</option>
                <option>Piedade</option>
                <option>Tapiraí</option>
                <option>Tatuí</option>
                <option>São Roque</option>
                <option>Mairinque</option>
                <option>Iperó</option>
            </select>

            <label>Hospedagem</label>
            <input type="text" name="hospedagem" placeholder="Hotel, pousada, chalé" required>

            <label>Quantidade de hóspedes</label>
            <input type="number" name="hospedes" min="1" required>

            <label>Duração da viagem (dias)</label>
            <input type="number" name="dias" min="1" required>

            <label>CEP</label>
            <input type="text" name="cep" placeholder="Digite o CEP" required>

            <label>Status</label>
            <select name="status" required>
                <option value="Em andamento">Em andamento</option>
                <option value="Finalizada">Finalizada</option>
            </select>

            <label>Foto da viagem</label>
            <input type="file" name="foto" accept="image/*"
                   onchange="previewFoto(this,'prev-novo')">

            <img id="prev-novo" class="preview">

            <button class="btn-save">Salvar destino</button>
            <button type="button" class="btn-cancel" onclick="fecharNovo()">Cancelar</button>

        </form>
    </div>
</div>


<!-- ==========================
      MODAL — EDITAR DESTINO
=========================== -->
<div class="modal-bg" id="modal-editar">
    <div class="modal">
        <h2>Editar Destino</h2>

        <form action="editar_destino.php" method="POST" enctype="multipart/form-data">

            <input type="hidden" name="id" id="edit-id">

            <label>Cidade</label>
            <select name="cidade" id="edit-cidade" required>
                <option>Sorocaba</option>
                <option>Votorantim</option>
                <option>Araçoiaba da Serra</option>
                <option>Salto de Pirapora</option>
                <option>Itu</option>
                <option>Salto</option>
                <option>Tietê</option>
                <option>Boituva</option>
                <option>Porto Feliz</option>
                <option>Capela do Alto</option>
                <option>Alumínio</option>
                <option>Piedade</option>
                <option>Tapiraí</option>
                <option>Tatuí</option>
                <option>São Roque</option>
                <option>Mairinque</option>
                <option>Iperó</option>
            </select>

            <label>Hospedagem</label>
            <input type="text" name="hospedagem" id="edit-hospedagem" required>

            <label>Hóspedes</label>
            <input type="number" name="hospedes" id="edit-hospedes" required>

            <label>Dias</label>
            <input type="number" name="dias" id="edit-dias" required>

            <label>CEP</label>
            <input type="text" name="cep" id="edit-cep" required>

            <label>Status</label>
            <select name="status" id="edit-status" required>
                <option value="Em andamento">Em andamento</option>
                <option value="Finalizada">Finalizada</option>
            </select>

            <label>Alterar Foto (opcional)</label>
            <input type="file" name="foto" accept="image/*"
                   onchange="previewFoto(this,'prev-editar')">

            <img id="prev-editar" class="preview">

            <button class="btn-save">Salvar alterações</button>
            <button type="button" class="btn-cancel" onclick="fecharEditar()">Cancelar</button>

        </form>
    </div>
</div>


<!-- ==========================
      MODAL — EXCLUIR DESTINO
=========================== -->
<div class="modal-bg" id="modal-excluir">
    <div class="modal">
        <h2>Excluir destino?</h2>
        <p style="margin-bottom:20px">Essa ação não pode ser desfeita.</p>

        <button id="btn-confirmar-excluir"
                class="btn-del"
                style="width:100%;font-size:17px;">
            Confirmar exclusão
        </button>

        <button class="btn-cancel" onclick="fecharExcluir()">
            Cancelar
        </button>
    </div>
</div>

<script>
/* =====================================
   ATIVAR ÍCONES
===================================== */
feather.replace();

/* =====================================
   PRÉ-VISUALIZAÇÃO DA IMAGEM
===================================== */
function previewFoto(input, target){
    let file = input.files[0];
    if(file){
        let url = URL.createObjectURL(file);
        let img = document.getElementById(target);
        img.src = url;
        img.style.display = "block";
    }
}

/* =====================================
   MODAL — NOVO DESTINO
===================================== */
function abrirNovo(){
    document.getElementById("modal-novo").style.display = "flex";
}

function fecharNovo(){
    document.getElementById("modal-novo").style.display = "none";
}


/* =====================================
   MODAL — EDITAR DESTINO
===================================== */
function abrirEditar(id, cidade, descricao, hospedes, dias, cep, status){

    document.getElementById("modal-editar").style.display = "flex";

    document.getElementById("edit-id").value = id;
    document.getElementById("edit-cidade").value = cidade;
    document.getElementById("edit-hospedagem").value = descricao;
    document.getElementById("edit-hospedes").value = hospedes;
    document.getElementById("edit-dias").value = dias;
    document.getElementById("edit-cep").value = cep;
    document.getElementById("edit-status").value = status;
}

function fecharEditar(){
    document.getElementById("modal-editar").style.display = "none";
}


/* =====================================
   MODAL — EXCLUIR DESTINO
===================================== */
function abrirExcluir(id){
    document.getElementById("modal-excluir").style.display = "flex";

    document.getElementById("btn-confirmar-excluir").onclick = function(){
        window.location.href = "excluir_destino.php?id=" + id;
    };
}

function fecharExcluir(){
    document.getElementById("modal-excluir").style.display = "none";
}

</script>

</body>
</html>
