// ================================
// 🔹 SCRIPT GLOBAL PARA LIMPAR URL E PEGAR DADOS
// ================================
document.addEventListener("DOMContentLoaded", () => {

  // 1️⃣ Pega parâmetros da URL
  const params = new URLSearchParams(window.location.search);
  const parametros = {};
  for (const [key, value] of params.entries()) {
    parametros[key] = value;
  }

  // 2️⃣ Pega dados do sessionStorage (se existir)
  const dados = JSON.parse(sessionStorage.getItem("dadosGaleria") || "{}");

  // 3️⃣ Guarda tudo em um objeto único
  const tudo = {
    parametros: parametros,
    imagens: dados.imagens || [],
    descricao: dados.descricao || ""
  };

  console.clear();
  console.log("📦 Dados combinados (URL + sessionStorage):", tudo);

  // 4️⃣ Limpa a URL da barra sem recarregar
  window.history.replaceState({}, document.title, window.location.pathname);

  // 5️⃣ Opcional: adiciona as imagens na página
  if (tudo.imagens.length > 0) {
    const container = document.createElement("div");
    container.id = "galeria-destino";
    container.style.marginTop = "10px";
    tudo.imagens.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.style.width = "100px";
      img.style.margin = "5px";
      container.appendChild(img);
    });
    document.body.appendChild(container);
  }

  // 6️⃣ Opcional: mostra a descrição na página
  if (tudo.descricao) {
    const p = document.createElement("p");
    p.textContent = tudo.descricao;
    p.style.marginTop = "10px";
    p.style.fontWeight = "bold";
    document.body.appendChild(p);
  }

  // 🔹 Retorna o objeto completo para outros scripts usarem
  window.dadosGlobais = tudo;

});
