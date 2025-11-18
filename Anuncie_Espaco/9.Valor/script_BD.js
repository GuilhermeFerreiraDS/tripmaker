// Adicione este script ao seu arquivo JavaScript existente

document.addEventListener('DOMContentLoaded', function () {
    const confirmarBtn = document.querySelector('.descricao-btn');

    if (confirmarBtn) {
        confirmarBtn.addEventListener('click', function (e) {
            e.preventDefault();

            console.log('🔄 Capturando dados para envio...');

            // Captura os dados ATUAIS no momento do clique
            const dadosAtuais = capturarDadosAtuais();

            console.log('📤 Dados capturados para envio:', dadosAtuais);

            // Envia os dados para o banco
            enviarParaBanco(dadosAtuais);
        });
    }
});

// Função para capturar parâmetros da URL
function capturarParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const parametros = {};

    // Lista de parâmetros que você mostrou no console
    const parametrosEsperados = [
        'bairro', 'banheiros', 'cardsSelecionados', 'cep', 'cidade',
        'cozinhas', 'estado', 'hospedes', 'idAmbiente', 'idEspaco',
        'lat', 'lng', 'numero', 'quartos', 'rua', 'salas'
    ];

    parametrosEsperados.forEach(param => {
        parametros[param] = urlParams.get(param) || '';
    });

    return parametros;
}

// Função para capturar imagens do sessionStorage
function capturarImagensSessionStorage() {
    const imagens = [];

    try {
        // Tenta diferentes chaves que podem ser usadas no sessionStorage
        const chavesPossiveis = [
            'imagensGaleria', 'galeriaImagens', 'imagensSelecionadas',
            'fotosImovel', 'imagensBase64', 'uploadedImages'
        ];

        for (const chave of chavesPossiveis) {
            const dados = sessionStorage.getItem(chave);
            if (dados) {
                console.log(`📷 Encontradas imagens na chave: ${chave}`);

                // Tenta parsear como JSON (pode ser array de base64)
                try {
                    const parsed = JSON.parse(dados);
                    if (Array.isArray(parsed)) {
                        imagens.push(...parsed);
                    }
                } catch (e) {
                    // Se não for JSON, pode ser uma string única
                    imagens.push(dados);
                }
            }
        }

        // Se não encontrou nas chaves padrão, procura por qualquer chave que contenha "imagem"
        for (let i = 0; i < sessionStorage.length; i++) {
            const chave = sessionStorage.key(i);
            if (chave && (chave.toLowerCase().includes('imagem') ||
                chave.toLowerCase().includes('image') ||
                chave.toLowerCase().includes('foto') ||
                chave.toLowerCase().includes('photo'))) {

                const dados = sessionStorage.getItem(chave);
                try {
                    const parsed = JSON.parse(dados);
                    if (Array.isArray(parsed)) {
                        imagens.push(...parsed);
                    } else {
                        imagens.push(dados);
                    }
                } catch (e) {
                    imagens.push(dados);
                }
            }
        }

    } catch (error) {
        console.error('❌ Erro ao capturar imagens do sessionStorage:', error);
    }

    return imagens;
}

// Função para capturar descrição
function capturarDescricao() {
    // Tenta diferentes elementos onde a descrição pode estar
    const elementosDescricao = [
        document.querySelector('textarea[name="descricao"]'),
        document.querySelector('input[name="descricao"]'),
        document.querySelector('.descricao-texto'),
        document.querySelector('[data-descricao]'),
        document.querySelector('#descricao')
    ];

    for (const elemento of elementosDescricao) {
        if (elemento) {
            return elemento.value || elemento.textContent || '';
        }
    }

    // Se não encontrou, retorna string vazia
    return '';
}

// Função para gerar um nome automático baseado nos dados
function gerarNomeAutomatico(dados) {
    if (dados.idEspaco && dados.idAmbiente) {
        return `${dados.idEspaco} - ${dados.idAmbiente}`;
    } else if (dados.rua && dados.bairro) {
        return `${dados.rua}, ${dados.bairro}`;
    } else if (dados.cidade && dados.estado) {
        return `Ponto Turístico - ${dados.cidade}/${dados.estado}`;
    } else {
        return 'Novo Ponto Turístico';
    }
}

// Função principal para capturar todos os dados
function capturarDadosAtuais() {
    // 1. Captura parâmetros da URL
    const parametrosURL = capturarParametrosURL();
    console.log('🔗 Parâmetros da URL:', parametrosURL);

    // 2. Captura valor atual do input (será o preco_estimado)
    const valorInput = document.getElementById('input-valor');
    const preco_estimado = valorInput ? parseFloat(valorInput.value) || 0 : 0;
    console.log('💰 Valor do input (preco_estimado):', preco_estimado);

    // 3. Captura imagens do sessionStorage
    const imagens = capturarImagensSessionStorage();
    console.log('📷 Imagens capturadas:', imagens.length);

    // 4. Captura descrição
    const descricao = capturarDescricao();
    console.log('📝 Descrição:', descricao);

    // 5. Gera nome automático
    const nome = gerarNomeAutomatico(parametrosURL);
    console.log('🏷️ Nome gerado:', nome);

    // Combina todos os dados no formato da sua tabela
    const dadosCompletos = {
        // Campos da sua tabela original
        nome: nome,
        cidade: parametrosURL.cidade || '',
        descricao: descricao,
        categoria: parametrosURL.idAmbiente || 'turismo',
        preco_estimado: preco_estimado,
        duracao_media: null, // Você pode ajustar isso depois
        horario_funcionamento: '', // Você pode ajustar isso depois

        // Novos campos dos parâmetros da URL
        bairro: parametrosURL.bairro || '',
        rua: parametrosURL.rua || '',
        numero: parametrosURL.numero || '',
        estado: parametrosURL.estado || '',
        cep: parametrosURL.cep || '',
        lat: parametrosURL.lat || null,
        lng: parametrosURL.lng || null,
        banheiros: parametrosURL.banheiros || '',
        quartos: parametrosURL.quartos || '',
        salas: parametrosURL.salas || '',
        cozinhas: parametrosURL.cozinhas || '',
        hospedes: parametrosURL.hospedes || '',
        id_ambiente: parametrosURL.idAmbiente || '',
        id_espaco: parametrosURL.idEspaco || '',
        cards_selecionados: parametrosURL.cardsSelecionados || '',

        // Imagens
        imagens: imagens
    };

    return dadosCompletos;
}

// Função para enviar dados para o banco
// Função para enviar dados para o banco - COLE ESTA VERSÃO
async function enviarParaBanco(dados) {
    try {
        console.log('🚀 Enviando dados para o banco...', dados);
        
        // URL CORRIGIDA - mesma pasta
        const response = await fetch('salvar_ponto_turistico.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });
        
        console.log('📨 Resposta do servidor:', response);
        
        // Verifica se a resposta é JSON
        const text = await response.text();
        console.log('📄 Resposta texto:', text);
        
        let resultado;
        try {
            resultado = JSON.parse(text);
        } catch (e) {
            console.error('❌ Resposta não é JSON:', text);
            alert('Erro: Servidor retornou HTML em vez de JSON. Verifique o PHP.');
            return;
        }
        
        if (response.ok && resultado.success) {
            console.log('✅ Dados salvos com sucesso:', resultado);
            alert('✅ Ponto turístico salvo! ID: ' + resultado.id);
        } else {
            console.error('❌ Erro ao salvar:', resultado);
            alert('❌ Erro: ' + (resultado.message || 'Desconhecido'));
        }
        
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        alert('❌ Erro de conexão: ' + error.message);
    }
}

// Função auxiliar para debug - mostra tudo que está no sessionStorage
function debugSessionStorage() {
    console.log('🔍 DEBUG - SessionStorage completo:');
    for (let i = 0; i < sessionStorage.length; i++) {
        const chave = sessionStorage.key(i);
        const valor = sessionStorage.getItem(chave);
        console.log(`  ${chave}:`, valor?.substring(0, 100) + (valor?.length > 100 ? '...' : ''));
    }
}

// Chame esta função se quiser ver o que está no sessionStorage
// debugSessionStorage();