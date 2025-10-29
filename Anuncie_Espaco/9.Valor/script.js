const inputValor = document.getElementById('input-valor');
const sliderValor = document.getElementById('slider-valor');
const valorFormatado = document.getElementById('valor-formatado');
const feedback = document.getElementById('valor-feedback');
const entradaResumo = document.getElementById('entrada-resumo');
const parcelasResumo = document.getElementById('parcelas-resumo');
const quickButtons = document.querySelectorAll('.quick-values button');
const btnUp = document.getElementById('btn-valor-up');
const btnDown = document.getElementById('btn-valor-down');

function formatarValor(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function atualizarTudo(val) {
  inputValor.value = val;
  sliderValor.value = val;
  valorFormatado.textContent = formatarValor(val);

  // Feedback
  if(val < 50) {
    feedback.textContent = "Valor muito baixo!";
  } else if(val > 15000000) {
    feedback.textContent = "Valor muito alto!";
  } else {
    feedback.textContent = "";
  }

  // Resumo (exemplo simples: entrada 20%, parcela 30 anos)
  const entrada = val * 0.2;
  const parcelas = ((val - entrada) / 360).toFixed(0);
  entradaResumo.textContent = formatarValor(entrada);
  parcelasResumo.textContent = formatarValor(parcelas);
}

// Eventos
inputValor.addEventListener('input', () => atualizarTudo(Number(inputValor.value)));
sliderValor.addEventListener('input', () => atualizarTudo(Number(sliderValor.value)));
quickButtons.forEach(btn => btn.addEventListener('click', () => atualizarTudo(Number(btn.dataset.value))));
btnUp.addEventListener('click', () => atualizarTudo(Number(inputValor.value) + 100));
btnDown.addEventListener('click', () => atualizarTudo(Number(inputValor.value) - 100));

// Inicializa
atualizarTudo(Number(inputValor.value));

document.addEventListener("DOMContentLoaded", () => {
    const dados = JSON.parse(sessionStorage.getItem("dadosGaleria") || "{}");

    // Parâmetros
    if (dados.parametros) {
        console.log("📦 Parâmetros da URL:", dados.parametros);
    }

    // Imagens
    if (dados.imagens && dados.imagens.length > 0) {
        console.log("🖼️ Imagens da galeria:", dados.imagens);

        const container = document.createElement("div");
        container.id = "galeria-recebida";
        container.style.marginTop = "20px";

        dados.imagens.forEach(src => {
            const img = document.createElement("img");
            img.src = src; // Aqui pode ser URL ou Base64
            img.style.width = "100px";
            img.style.margin = "5px";
            container.appendChild(img);
        });

        document.body.appendChild(container);
    } else {
        console.log("🖼️ Nenhuma imagem recebida.");
    }

    // Descrição
    if (dados.descricao) {
        console.log("📝 Descrição do imóvel:", dados.descricao);

        const p = document.createElement("p");
        p.textContent = dados.descricao;
        p.style.marginTop = "10px";
        p.style.fontWeight = "bold";
        document.body.appendChild(p);
    } else {
        console.log("📝 Nenhuma descrição recebida.");
    }
});