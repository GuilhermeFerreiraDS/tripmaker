// ===============================
// 🔹 SISTEMA DE CARTÕES (marcar + logar ID)
// ===============================
const cards = document.querySelectorAll('.comodidades-container .card');
const btnLeft = document.querySelector('.arrow-left');
const btnRight = document.querySelector('.arrow-right');
const enviarBtn = document.getElementById('enviar');

const cardsPerPage = 9;
let currentPage = 0;
let selectedIds = [];

// 🔹 FUNÇÃO PARA LER OS PARÂMETROS DA URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return params;
}

// 🔹 FUNÇÃO PARA INICIALIZAR OS CARDS COM BASE NA URL
function initializeCardsFromUrl() {
    const params = getUrlParams();
    
    // Log dos dados da URL
    console.log("📦 Dados da URL atuais:", Object.fromEntries(params.entries()));
    
    // Verifica se há cards selecionados na URL
    const cardsFromUrl = params.get('cardsSelecionados');
    if (cardsFromUrl) {
        selectedIds = cardsFromUrl.split(',').filter(id => id.trim() !== '');
        console.log("🎯 Cards da URL:", selectedIds);
        
        // Marca visualmente os cards que vieram da URL
        selectedIds.forEach(cardId => {
            const card = document.getElementById(cardId);
            if (card) {
                card.classList.add('selected');
                console.log(`✅ Card ${cardId} marcado a partir da URL`);
            } else {
                console.warn(`⚠️ Card ${cardId} não encontrado no DOM`);
            }
        });
    }
}

function showPage(page) {
    cards.forEach(card => (card.style.display = 'none'));
    const start = page * cardsPerPage;
    const end = start + cardsPerPage;
    for (let i = start; i < end && i < cards.length; i++) {
        cards[i].style.display = 'flex';
    }
}

// 🔹 FUNÇÃO ATUALIZADA PARA ALTERNAR SELEÇÃO
function toggleCardSelection(card) {
    const cardId = card.id;
    
    if (!cardId) {
        console.warn('⚠️ Card sem ID, não pode ser selecionado');
        return;
    }

    if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        selectedIds = selectedIds.filter(id => id !== cardId);
        console.log(`❌ Card ID: ${cardId} desmarcado`);
    } else {
        card.classList.add('selected');
        if (!selectedIds.includes(cardId)) {
            selectedIds.push(cardId);
        }
        console.log(`✅ Card ID: ${cardId} selecionado`);
    }
    
    console.log("📋 IDs selecionados atual:", selectedIds);
}

// 🔹 FUNÇÃO PARA ENVIAR PARA PRÓXIMA PÁGINA
function enviarParaProximaPagina() {
    const params = getUrlParams();
    const novaURL = new URL('../7.Imagem_Local/index.html', window.location.href);

    // Copia TODOS os parâmetros originais da URL
    for (const [key, value] of params.entries()) {
        // Não sobrescreve os cards selecionados antigos, vamos juntar tudo
        if (key !== 'cardsSelecionados') {
            novaURL.searchParams.set(key, value);
        }
    }

    // 🔥 AQUI ESTÁ O SEGREDO: Mantém os cards da URL + adiciona novos
    const cardsExistentes = params.get('cardsSelecionados') ? 
        params.get('cardsSelecionados').split(',').filter(id => id.trim() !== '') : [];
    
    // Combina cards existentes com novos selecionados (sem duplicatas)
    const todosCards = [...new Set([...cardsExistentes, ...selectedIds])];
    
    if (todosCards.length > 0) {
        novaURL.searchParams.set('cardsSelecionados', todosCards.join(','));
    }

    console.log("📤 Enviando para próxima página:");
    console.log("📍 URL:", novaURL.toString());
    console.log("🎯 Todos os cards:", todosCards);

    window.location.href = novaURL.toString();
}

// ===============================
// 🔹 INICIALIZAÇÃO
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Inicializando sistema de cards...");
    
    // 1. Inicializa cards com base na URL
    initializeCardsFromUrl();
    
    // 2. Configura eventos dos cards
    cards.forEach(card => {
        card.addEventListener('click', () => toggleCardSelection(card));
    });

    // 3. Configura paginação
    showPage(currentPage);

    btnRight?.addEventListener('click', () => {
        if (currentPage < Math.ceil(cards.length / cardsPerPage) - 1) {
            currentPage++;
            showPage(currentPage);
        }
    });

    btnLeft?.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            showPage(currentPage);
        }
    });

    // 4. Configura botão enviar
    if (enviarBtn) {
        enviarBtn.addEventListener('click', enviarParaProximaPagina);
    }
    
    console.log("✅ Sistema inicializado com sucesso!");
});

// 🔹 Função auxiliar para debug (opcional)
function debugEstadoAtual() {
    console.log("=== DEBUG ESTADO ATUAL ===");
    console.log("📋 IDs selecionados:", selectedIds);
    console.log("🌐 Parâmetros URL:", Object.fromEntries(getUrlParams().entries()));
    console.log("========================");
}

// Chame debugEstadoAtual() no console para ver o estado atual