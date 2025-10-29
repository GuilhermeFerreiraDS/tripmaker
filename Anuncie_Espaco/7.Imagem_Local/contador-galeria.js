// contador-galeria.js (versão robusta)
document.addEventListener("DOMContentLoaded", () => {
  const containerPrincipal = document.getElementById("galeria-fotos");
  if (!containerPrincipal) {
    console.warn("contador-galeria: #galeria-fotos não encontrado");
    return;
  }

  let galeria = containerPrincipal.querySelector(".galeria-imagens");

  // Função que aplica a lógica sobre uma galeria já existente
  function aplicarContadorNaGaleria(galeriaEl) {
    if (!galeriaEl) return;

    function atualizar() {
      const itens = Array.from(galeriaEl.querySelectorAll(".item-galeria"));
      const total = itens.length;

      // Remove contador antigo global dentro da galeria
      galeriaEl.querySelectorAll(".contador-extra").forEach(c => c.remove());

      if (total <= 3) {
        itens.forEach(it => it.style.display = "");
        return;
      }

      itens.forEach((it, idx) => {
        it.style.display = idx < 3 ? "" : "none";
      });

      const extras = total - 3;
      const terceiro = itens[2];
      if (terceiro) {
        const contador = document.createElement("div");
        contador.className = "contador-extra";
        contador.textContent = `+${extras}`;
        if (getComputedStyle(terceiro).position === "static") {
          terceiro.style.position = "relative";
        }
        terceiro.appendChild(contador);
      }
    }

    const obsGaleria = new MutationObserver(() => {
      setTimeout(atualizar, 10);
      setTimeout(logarImagensDaGaleria, 20); // 🔄 Atualiza log sempre que muda
    });
    obsGaleria.observe(galeriaEl, { childList: true });

    atualizar();
  }

  const obsContainer = new MutationObserver((mutList) => {
    for (const mut of mutList) {
      if (mut.type === "childList") {
        const novaGaleria = containerPrincipal.querySelector(".galeria-imagens");
        if (novaGaleria && novaGaleria !== galeria) {
          galeria = novaGaleria;
          aplicarContadorNaGaleria(galeria);
        }

        const temItem = containerPrincipal.querySelector(".item-galeria");
        if (temItem && !galeria) {
          const pai = temItem.parentElement;
          if (pai) {
            galeria = pai;
            aplicarContadorNaGaleria(galeria);
          }
        }
      }
    }
  });

  obsContainer.observe(containerPrincipal, { childList: true, subtree: false });

  if (galeria) aplicarContadorNaGaleria(galeria);

  // ==============================
  // 🔹 NOVA FUNÇÃO: LOGAR IMAGENS DENTRO DE .item-galeria
  // ==============================
  function logarImagensDaGaleria() {
    const imagens = Array.from(document.querySelectorAll(".item-galeria img"));
    const srcs = imagens.map(img => img.src);

    console.clear(); // 🧹 limpa o console para mostrar só o estado atual
    console.log("🖼️ Imagens:", {
      elementos: imagens,
      srcs: srcs
    });
  }

  // Executa ao carregar
  logarImagensDaGaleria();

  // E sempre que a galeria mudar
  const obsImagens = new MutationObserver(() => {
    logarImagensDaGaleria();
  });
  obsImagens.observe(containerPrincipal, { childList: true, subtree: true });
});

// ==============================
// 🔹 MODAL DE VISUALIZAÇÃO DAS IMAGENS
// ==============================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("contador-extra")) {
    const galeria = document.querySelector(".galeria-imagens");
    if (!galeria) return;

    const itens = galeria.querySelectorAll(".item-galeria img");
    if (itens.length === 0) return;

    // cria o fundo do modal
    const overlay = document.createElement("div");
    overlay.className = "overlay-modal";

    // cria o container principal do modal
    const modal = document.createElement("div");
    modal.className = "modal-galeria";

    // botão de fechar
    const closeBtn = document.createElement("span");
    closeBtn.className = "fechar-modal";
    closeBtn.textContent = "×";
    modal.appendChild(closeBtn);

    // container de imagens
    const containerImgs = document.createElement("div");
    containerImgs.className = "container-imagens-modal";

    itens.forEach((img) => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";

      const clone = img.cloneNode(true);
      clone.style.width = "auto";
      clone.style.height = "auto";
      wrapper.appendChild(clone);

      // botão de excluir
      const btnExcluir = document.createElement("button");
      btnExcluir.className = "btn-excluir-modal";
      btnExcluir.textContent = "×";
      wrapper.appendChild(btnExcluir);

      // remove a imagem original do DOM
      btnExcluir.addEventListener("click", () => {
        const itemOriginal = img.closest(".item-galeria");
        if (itemOriginal) itemOriginal.remove();
        wrapper.remove();

        // 🔄 Atualiza o console quando remover
        const imagens = Array.from(document.querySelectorAll(".item-galeria img"));
        const srcs = imagens.map(i => i.src);
        console.clear();
        console.log("🖼️ Imagens:", {
          elementos: imagens,
          srcs: srcs
        });

        // fecha o modal se não houver mais imagens
        if (containerImgs.children.length === 0) {
          overlay.remove();
        }
      });

      containerImgs.appendChild(wrapper);
    });

    modal.appendChild(containerImgs);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // botão de fechar
    closeBtn.addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }
});

//-----------------------------------//
//       Manda para outra pagina 
//-----------------------------------//

document.addEventListener("DOMContentLoaded", () => {
  const btnConfirmar = document.getElementById("btn-confirmar");
  if (!btnConfirmar) {
    console.warn("Botão 'Confirmar' não encontrado!");
    return;
  }

  btnConfirmar.addEventListener("click", async () => {
    const imagens = Array.from(document.querySelectorAll(".item-galeria img"));

    // Pega todos os src das imagens
    const srcs = await Promise.all(imagens.map(img => img.src));

    // Pega todos os parâmetros da URL
    const params = new URLSearchParams(window.location.search);

    // Salva as imagens no sessionStorage
    const dadosParaEnviar = { imagens: srcs };
    sessionStorage.setItem("dadosGaleria", JSON.stringify(dadosParaEnviar));

    // Cria a URL de destino mantendo os parâmetros originais
    const novaPagina = "../8.Descricao_Local/index.html";
    const novaURL = `${novaPagina}?${params.toString()}`;

    // Redireciona
    window.location.href = novaURL;
  });
});