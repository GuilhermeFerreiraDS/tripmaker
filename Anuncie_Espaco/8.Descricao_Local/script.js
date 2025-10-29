document.addEventListener("DOMContentLoaded", () => {
    // ===== Parâmetros da URL =====
    const urlParams = new URLSearchParams(window.location.search);
    const parametros = {};
    for (const [key, value] of urlParams.entries()) {
        parametros[key] = value;
    }
    console.log("📦 Parâmetros da URL:", parametros);

    // ===== Dados do sessionStorage =====
    const dados = JSON.parse(sessionStorage.getItem("dadosGaleria") || "{}");

    // ===== Mostrar imagens =====
    if (dados.imagens && dados.imagens.length > 0) {
        console.log("🖼️ Imagens da galeria:", dados.imagens);

        const container = document.createElement("div");
        container.id = "galeria-destino";
        dados.imagens.forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.style.width = "100px";
            img.style.margin = "5px";
            container.appendChild(img);
        });
        document.body.appendChild(container);
    } else {
        console.log("🖼️ Nenhuma imagem enviada.");
    }

    // ===== Mostrar descrição =====
    if (dados.descricao) {
        console.log("📝 Descrição do imóvel:", dados.descricao);

        const p = document.createElement("p");
        p.textContent = dados.descricao;
        p.style.marginTop = "10px";
        p.style.fontWeight = "bold";
        document.body.appendChild(p);
    } else {
        console.log("📝 Nenhuma descrição enviada.");
    }

    // ===== BOTÃO SALVAR DESCRIÇÃO PARA 9.Valor =====
    const btnDescricao = document.getElementById("btn-descricao");
    if (!btnDescricao) {
        console.warn("Botão 'Salvar Descrição' não encontrado!");
        return;
    }

    btnDescricao.addEventListener("click", () => {
        // ✅ 1️⃣ Pega todas as imagens já carregadas no sessionStorage
        const imagens = dados.imagens || [];

        // ✅ 2️⃣ Pega o texto da descrição do textarea
        const descricao = document.getElementById("descricao-imovel")?.value || "";

        // ✅ 3️⃣ Mantém os parâmetros da URL atual
        const dadosParaEnviar = {
            imagens: imagens,
            descricao: descricao,
            parametros: parametros
        };

        // ✅ 4️⃣ Salva no sessionStorage
        sessionStorage.setItem("dadosGaleria", JSON.stringify(dadosParaEnviar));

        // ✅ 5️⃣ Redireciona para 9.Valor
        window.location.href = "../9.Valor/index.html";
    });
});