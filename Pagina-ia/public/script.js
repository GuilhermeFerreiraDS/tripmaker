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

// Variáveis globais
let pontosAtuais = [];
let quantidadeCards = 5;
let ultimaBusca = {};

// Função para excluir card e fazer NOVA BUSCA
// Função para excluir card e buscar SUBSTITUTO
// Função para excluir card e buscar SUBSTITUTO via ChatGPT
async function excluirCard(index) {
    if (confirm("Deseja trocar este card por uma nova opção do ChatGPT?")) {
        // Remove o card atual
        const cardRemovido = pontosAtuais.splice(index, 1)[0];
        console.log("🗑️ Card removido:", cardRemovido.nome);
        
        // Mostra loading
        const botWrapper = document.getElementById("bot-msg-wrapper");
        const loadingHTML = botWrapper.innerHTML;
        botWrapper.innerHTML = "<div class='loading'>🔄 Buscando nova opção no ChatGPT...</div>";
        
        try {
            // 🔥 FAZ NOVA BUSCA COM MODO SUBSTITUIÇÃO
            const resposta = await fetch("http://localhost:3000/roteiro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ...ultimaBusca,
                    quantidade: 1, // Apenas 1 card novo
                    substituicao: true // ← ATIVA MODO SUBSTITUIÇÃO
                })
            });

            const dados = await resposta.json();

            if (dados.pontos && dados.pontos.length > 0) {
                const novoCard = dados.pontos[0];
                pontosAtuais.push(novoCard);
                console.log("✅ NOVO card do ChatGPT:", novoCard);
                
                renderizarCards(pontosAtuais);
                alert("🎉 Novo card adicionado com sucesso!");
            } else {
                console.log("❌ Nenhum novo card encontrado");
                botWrapper.innerHTML = loadingHTML;
                alert("⚠️ Não foi possível encontrar uma nova opção no momento.");
            }

        } catch (err) {
            console.error("❌ Erro ao buscar novo card:", err);
            botWrapper.innerHTML = loadingHTML;
            alert("❌ Erro ao buscar nova opção. Tente novamente.");
        }
    }
}

// Função para buscar card substituto (recursiva)
async function buscarCardSubstituto(tentativa = 1) {
    if (tentativa > 3) {
        console.log("❌ Limite de tentativas atingido");
        return null;
    }

    try {
        const resposta = await fetch("http://localhost:3000/roteiro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...ultimaBusca,
                quantidade: 1
            })
        });

        const dados = await resposta.json();

        if (dados.pontos && dados.pontos.length > 0) {
            const novoCard = dados.pontos[0];

            // Verifica se o novo card já não está na lista
            const cardJaExiste = pontosAtuais.some(ponto =>
                ponto.nome === novoCard.nome && ponto.categoria === novoCard.categoria
            );

            if (!cardJaExiste) {
                return novoCard;
            } else {
                console.log(`🔄 Tentativa ${tentativa}: Card já existe, buscando outro...`);
                return await buscarCardSubstituto(tentativa + 1);
            }
        }
    } catch (err) {
        console.error(`❌ Erro na tentativa ${tentativa}:`, err);
    }

    return null;
}

// Função para atualizar quantidade
async function atualizarQuantidadeCards() {
    const input = document.getElementById("cardQuantity");
    quantidadeCards = parseInt(input.value) || 5;

    if (quantidadeCards < 1) quantidadeCards = 1;
    if (quantidadeCards > 20) quantidadeCards = 20;

    if (Object.keys(ultimaBusca).length > 0) {
        console.log("🔄 Refazendo busca com nova quantidade:", quantidadeCards);
        await refazerBusca();
    } else {
        alert("⚠️ Faça uma busca primeiro!");
    }
}

// Função para refazer a busca
async function refazerBusca() {
    const { cidade, categoria, valor } = ultimaBusca;

    const userWrapper = document.getElementById("user-msg-wrapper");
    const botWrapper = document.getElementById("bot-msg-wrapper");
    const valorWrapper = document.getElementById("box-valor-wrapper");

    userWrapper.textContent = cidade ? `📍 Cidade: ${cidade}` : "📍 Cidade não informada";
    botWrapper.innerHTML = "<div class='loading'>🔄 Atualizando cards...</div>";
    valorWrapper.textContent = "";

    try {
        const resposta = await fetch("http://localhost:3000/roteiro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cidade,
                categoria,
                valor,
                quantidade: quantidadeCards
            })
        });

        const dados = await resposta.json();

        if (dados.pontos && dados.pontos.length > 0) {
            pontosAtuais = dados.pontos;
            renderizarCards(pontosAtuais);
        } else {
            botWrapper.innerHTML = "<div class='no-results'>⚠️ Nenhum ponto encontrado.</div>";
            valorWrapper.textContent = `💰 Total estimado: R$ 0,00`;
        }

    } catch (err) {
        botWrapper.innerHTML = `<div class='error'>❌ Erro: ${err.message}</div>`;
        valorWrapper.textContent = "";
    }
}

// Função renderizarCards
function renderizarCards(pontos) {
    pontosAtuais = pontos;

    const botWrapper = document.getElementById("bot-msg-wrapper");
    const valorWrapper = document.getElementById("box-valor-wrapper");

    botWrapper.innerHTML = "";
    valorWrapper.textContent = "";

    let somaTotal = 0;
    let cardsHTML = "";

    pontos.forEach((ponto, index) => {
        let valorNum = 0;
        if (ponto.valor && ponto.valor !== "sem custo") {
            const valorTexto = ponto.valor.replace("💰 Valor estimado:", "").replace("R$", "").trim();
            valorNum = parseFloat(valorTexto.replace(/\./g, "").replace(",", ".")) || 0;
        }
        somaTotal += valorNum;

        cardsHTML += `
            <div class="bot-msg" data-index="${index}">
                <div class="bot-msg-header">
                    <span class="bot-msg-title">${ponto.nome}</span>
                    <span class="bot-msg-separator"> | </span>
                    <span class="bot-msg-category">${ponto.categoria}</span>
                    <button class="delete-card-btn" onclick="excluirCard(${index})">🗑️</button>
                </div>
                <div class="bot-msg-desc">${ponto.descricao}</div>
                <div class="bot-msg-valor">💰 Valor estimado: ${ponto.valor}</div>
            </div>
        `;
    });

    botWrapper.innerHTML = cardsHTML;
    valorWrapper.textContent = `💰 Total estimado: R$ ${somaTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

    // Scroll automático
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Função enviarMensagem (mantém igual)
async function enviarMensagem() {
    const cidade = document.getElementById("cidade").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const valor = document.getElementById("valor").value.trim();

    ultimaBusca = { cidade, categoria, valor };

    const userWrapper = document.getElementById("user-msg-wrapper");
    const botWrapper = document.getElementById("bot-msg-wrapper");
    const valorWrapper = document.getElementById("box-valor-wrapper");

    if (!cidade && !categoria && !valor) {
        alert("Por favor, digite pelo menos um critério de busca!");
        return;
    }

    userWrapper.textContent = cidade ? `📍 Cidade: ${cidade}` : "📍 Cidade não informada";
    botWrapper.innerHTML = "<div class='loading'>🔍 Buscando pontos turísticos...</div>";
    valorWrapper.textContent = "";

    try {
        const resposta = await fetch("http://localhost:3000/roteiro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cidade,
                categoria,
                valor,
                quantidade: quantidadeCards
            })
        });

        const dados = await resposta.json();

        if (dados.pontos && dados.pontos.length > 0) {
            pontosAtuais = dados.pontos;
            renderizarCards(pontosAtuais);
        } else {
            botWrapper.innerHTML = "<div class='no-results'>⚠️ Nenhum ponto encontrado.</div>";
            valorWrapper.textContent = `💰 Total estimado: R$ 0,00`;
        }

    } catch (err) {
        botWrapper.innerHTML = `<div class='error'>❌ Erro: ${err.message}</div>`;
        valorWrapper.textContent = "";
    }

    document.getElementById("cidade").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("valor").value = "";
}

// Função para salvar roteiro em PDF
async function salvarRoteiro() {
    if (pontosAtuais.length === 0) {
        alert("Nenhum roteiro para salvar!");
        return;
    }

    // Calcula o total
    const total = pontosAtuais.slice(0, quantidadeCards).reduce((total, ponto) => {
        if (ponto.valor && ponto.valor !== "sem custo") {
            const valorTexto = ponto.valor.replace("💰 Valor estimado:", "").replace("R$", "").trim();
            return total + (parseFloat(valorTexto.replace(/\./g, "").replace(",", ".")) || 0);
        }
        return total;
    }, 0);

    const roteiro = {
        data: new Date().toLocaleString("pt-BR"),
        total: `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        quantidade: pontosAtuais.slice(0, quantidadeCards).length
    };

    // Mostra loading
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "📄 Gerando PDF...";
    saveBtn.disabled = true;

    try {
        const resposta = await fetch("http://localhost:3000/gerar-pdf", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                roteiro,
                pontos: pontosAtuais.slice(0, quantidadeCards)
            })
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        // Cria blob do PDF
        const blob = await resposta.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Cria link para download
        const a = document.createElement('a');
        a.href = url;
        a.download = `roteiro-viagem-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Limpa
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        alert("✅ PDF gerado e baixado com sucesso!");

    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        alert(`❌ Erro ao gerar PDF: ${err.message}`);
    } finally {
        // Restaura o botão
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
    }
}

// Função auxiliar para formatar dados do PDF
function formatarDadosParaPDF(pontos) {
    return pontos.map(ponto => ({
        nome: ponto.nome || "Não informado",
        categoria: ponto.categoria || "Geral",
        descricao: ponto.descricao || "Descrição não disponível",
        valor: ponto.valor || "sem custo"
    }));
}