const cards = document.querySelectorAll('.card');
const inputs = document.querySelectorAll('.inputs input');
const button = document.querySelector('.inputs button');

inputs.forEach(input => input.style.display = 'none');
button.style.display = 'none';

cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        inputs.forEach(input => input.style.display = 'none');
        inputs[index].style.display = 'block';
        inputs[index].focus();

        button.style.display = 'block';
    });
});

const ctaButton = document.querySelector('.cta-button');
const ovalInputWrapper = document.getElementById('oval-input-wrapper');

ctaButton.addEventListener('click', () => {
    if (ovalInputWrapper.style.display === 'none') {
        ovalInputWrapper.style.display = 'block';
        ovalInputWrapper.querySelector('input').focus();
    } else {
        ovalInputWrapper.style.display = 'none';
    }
});

async function enviarMensagem() {
    const cidade = document.getElementById("cidade").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const valor = document.getElementById("valor").value.trim();
    const chatBox = document.getElementById("chat-box");

    if (!cidade && !categoria && !valor) {
        alert("Por favor, digite pelo menos um critério de busca!");
        return;
    }

    const userMsg = document.createElement("div");
    userMsg.classList.add("user-msg");
    let msgText = [];
    if (cidade) msgText.push(`Cidade: ${cidade}`);
    if (categoria) msgText.push(`Categoria: ${categoria}`);
    if (valor) msgText.push(`Valor máximo: R$ ${valor}`);
    userMsg.innerHTML = "📍 " + msgText.join(" | ");
    chatBox.appendChild(userMsg);

    try {
        const resposta = await fetch("http://localhost:3000/roteiro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cidade, categoria, valor })
        });

        const dados = await resposta.json();

        if (dados.pontos && dados.pontos.length > 0) {
            const botWrapper = document.createElement("div");
            botWrapper.classList.add("bot-msg-wrapper");

            dados.pontos.forEach(ponto => {
                const valorDisplay = ponto.valor ?? "sem custo";
                const botMsg = document.createElement("div");
                botMsg.classList.add("bot-msg");
                botMsg.innerHTML = `
                    <div class="bot-msg-header">
                        <span class="bot-msg-title">${ponto.nome}</span>
                        <span class="bot-msg-separator"> | </span>
                        <span class="bot-msg-category">${ponto.categoria}</span>
                        <span class="bot-msg-separator"> | </span>
                        <span class="bot-msg-valor">${valorDisplay}</span>
                    </div>
                    <div class="bot-msg-desc">
                        ${ponto.descricao}
                    </div>
                `;
                botWrapper.appendChild(botMsg);
            });

            // Total do roteiro
            if (dados.total !== undefined) {
                const resumo = document.createElement("div");
                resumo.classList.add("bot-msg");
                resumo.innerHTML = `💰 Custo total estimado do roteiro: R$ ${dados.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
                chatBox.appendChild(resumo);
            }

            chatBox.appendChild(botWrapper);
        } else {
            const botMsg = document.createElement("div");
            botMsg.classList.add("bot-msg");
            botMsg.innerHTML = "⚠️ Nenhum ponto encontrado.";
            chatBox.appendChild(botMsg);
        }

    } catch (err) {
        const botMsg = document.createElement("div");
        botMsg.classList.add("bot-msg");
        botMsg.innerHTML = `❌ Erro: ${err.message}`;
        chatBox.appendChild(botMsg);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
    document.getElementById("cidade").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("valor").value = "";
}
