async function enviarMensagem() {
    const cidade = document.getElementById("cidade").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const chatBox = document.getElementById("chat-box");

    if (!cidade) {
        alert("Por favor, digite uma cidade!");
        return;
    }

    // Mostra a pergunta do usuário no chat
    chatBox.innerHTML += `<div class="user-msg">📍 Cidade: ${cidade}, Categoria: ${categoria || "todas"}</div>`;

    try {
        console.log("🔎 Enviando requisição para o backend...");

        const resposta = await fetch("http://localhost:3000/roteiro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cidade, categoria })
        });

        console.log("📡 Status da resposta:", resposta.status);

        const dados = await resposta.json();
        console.log("📩 Resposta do servidor:", dados);

        if (dados.pontos && dados.pontos.length > 0) {
            dados.pontos.forEach(ponto => {
                chatBox.innerHTML += `
          <div class="bot-msg">
            <b>${ponto.nome}</b> - ${ponto.descricao} <br>
            <small>Categoria: ${ponto.categoria} | ${ponto.duracao_media ? `Duração: ${ponto.duracao_media}min` : ""
                    }</small>
          </div>
        `;
            });
        } else {
            chatBox.innerHTML += `<div class="bot-msg">⚠️ Nenhum ponto encontrado.</div>`;
        }
    } catch (err) {
        console.error("❌ Erro no fetch:", err);
        chatBox.innerHTML += `<div class="bot-msg">❌ Erro: ${err.message}</div>`;
    }
}
