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

    const userWrapper = document.getElementById("user-msg-wrapper");
    const botWrapper = document.getElementById("bot-msg-wrapper");
    const valorWrapper = document.getElementById("box-valor-wrapper");

    if (!cidade && !categoria && !valor) {
        alert("Por favor, digite pelo menos um critério de busca!");
        return;
    }

    // Mostra a cidade digitada no user-msg-wrapper
    userWrapper.textContent = cidade ? `📍 Cidade: ${cidade}` : "📍 Cidade não informada";

    botWrapper.innerHTML = "";
    valorWrapper.textContent = "";

    try {
        const resposta = await fetch("http://localhost:3000/roteiro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cidade, categoria, valor })
        });

        const dados = await resposta.json();

        if (dados.pontos && dados.pontos.length > 0) {
            dados.pontos.forEach(ponto => {
                const botMsg = document.createElement("div");
                botMsg.classList.add("bot-msg");
                botMsg.innerHTML = `
                    <div class="bot-msg-header">
                        <span class="bot-msg-title">${ponto.nome}</span>
                        <span class="bot-msg-separator"> | </span>
                        <span class="bot-msg-category">${ponto.categoria}</span>
                    </div>
                    <div class="bot-msg-desc">${ponto.descricao}</div>
                    <div class="bot-msg-valor">💰 Valor estimado: ${ponto.valor}</div>
                `;
                botWrapper.appendChild(botMsg);
            });

            // Soma todos os valores do bot-msg-valor corretamente
            const todosValores = botWrapper.querySelectorAll(".bot-msg-valor");
            let somaTotal = 0;

            todosValores.forEach(el => {
                let valorTexto = el.textContent.replace("💰 Valor estimado:", "").trim();
                if (valorTexto.toLowerCase() === "sem custo") return; // ignora sem custo
                valorTexto = valorTexto.replace(/[^\d,]/g, "").replace(",", "."); // remove símbolos e ajusta vírgula
                const valorNum = parseFloat(valorTexto);
                if (!isNaN(valorNum)) somaTotal += valorNum;
            });

            valorWrapper.textContent = `💰 Total estimado: R$ ${somaTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

        } else {
            botWrapper.textContent = "⚠️ Nenhum ponto encontrado.";
            valorWrapper.textContent = `💰 Total estimado: R$ 0,00`;
        }

    } catch (err) {
        botWrapper.textContent = `❌ Erro: ${err.message}`;
        valorWrapper.textContent = "";
    }

    // Scroll automático
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;

    // Limpa inputs
    document.getElementById("cidade").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("valor").value = "";
}
