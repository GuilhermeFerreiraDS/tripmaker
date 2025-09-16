// Deixa o card azul e mostra o input correspondente
const cards = document.querySelectorAll('.card');
const inputs = document.querySelectorAll('.inputs input');
const button = document.querySelector('.inputs button'); // seleciona o botão

// Esconde todos os inputs e o botão por padrão
inputs.forEach(input => input.style.display = 'none');
button.style.display = 'none';

cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        // Remove 'active' de todos os cards
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Esconde todos os inputs
        inputs.forEach(input => input.style.display = 'none');

        // Mostra apenas o input correspondente
        inputs[index].style.display = 'block';
        inputs[index].focus();

        // Mostra o botão junto com o input
        button.style.display = 'block';
    });
});

// Seleciona o botão e o input wrapper
const ctaButton = document.querySelector('.cta-button');
const ovalInputWrapper = document.getElementById('oval-input-wrapper');

ctaButton.addEventListener('click', () => {
    // Alterna a visibilidade do input
    if (ovalInputWrapper.style.display === 'none') {
        ovalInputWrapper.style.display = 'block';
        ovalInputWrapper.querySelector('input').focus();
    } else {
        ovalInputWrapper.style.display = 'none';
    }
});

// Função para enviar a mensagem
async function enviarMensagem() {
    const cidade = document.getElementById("cidade").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const valor = document.getElementById("valor").value.trim();
    const chatBox = document.getElementById("chat-box");

    if (!cidade) {
        alert("Por favor, digite uma cidade!");
        return;
    }

    // Cria e adiciona a mensagem do usuário
    const userMsg = document.createElement("div");
    userMsg.classList.add("user-msg");
    userMsg.innerHTML = `📍 Cidade: ${cidade}, Categoria: ${categoria || "todas"}, Valor: ${valor || "não definido"}`;
    chatBox.appendChild(userMsg);

    try {
        console.log("🔎 Enviando requisição para o backend...");

        const resposta = await fetch("http://localhost:3000/roteiro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cidade, categoria, valor })
        });

        console.log("📡 Status da resposta:", resposta.status);

        const dados = await resposta.json();
        console.log("📩 Resposta do servidor:", dados);

        if (dados.pontos && dados.pontos.length > 0) {
            // Cria um container para as mensagens do bot
            const botWrapper = document.createElement("div");
            botWrapper.classList.add("bot-msg-wrapper"); // wrapper flex para bot-msg lado a lado

            dados.pontos.forEach(ponto => {
                const botMsg = document.createElement("div");
                botMsg.classList.add("bot-msg");
                botMsg.innerHTML = `
                    <div class="bot-msg-header">
                        <span class="bot-msg-title">${ponto.nome}</span>
                        <span class="bot-msg-separator"> | </span>
                        <span class="bot-msg-category">${ponto.categoria}</span>
                    </div>
                    <div class="bot-msg-desc">
                        ${ponto.descricao}
                        ${ponto.duracao_media ? `<br><small>Duração: ${ponto.duracao_media}min</small>` : ""}
                    </div>
                `;
                botWrapper.appendChild(botMsg); // adiciona ao wrapper
            });

            chatBox.appendChild(botWrapper); // adiciona o wrapper logo abaixo da user-msg

        } else {
            const botMsg = document.createElement("div");
            botMsg.classList.add("bot-msg");
            botMsg.innerHTML = "⚠️ Nenhum ponto encontrado.";
            chatBox.appendChild(botMsg);
        }

    } catch (err) {
        console.error("❌ Erro no fetch:", err);
        const botMsg = document.createElement("div");
        botMsg.classList.add("bot-msg");
        botMsg.innerHTML = `❌ Erro: ${err.message}`;
        chatBox.appendChild(botMsg);
    }

    // Rola o chat para o final automaticamente
    chatBox.scrollTop = chatBox.scrollHeight;

    // Limpa os inputs
    document.getElementById("cidade").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("valor").value = "";
}
