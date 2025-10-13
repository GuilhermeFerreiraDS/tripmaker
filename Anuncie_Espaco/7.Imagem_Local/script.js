document.addEventListener("DOMContentLoaded", () => {
  // ===== SEU CÓDIGO ORIGINAL (mantido intacto) =====
  const params = new URLSearchParams(window.location.search);

  if (!params.toString()) {
    console.warn("⚠️ Nenhum parâmetro encontrado na URL");
    return;
  }

  console.log("📦 Todos os parâmetros recebidos na URL:");
  
  // Processa os cards selecionados
  const cardsSelecionados = params.get('cardsSelecionados');
  const listaCards = cardsSelecionados ? 
    cardsSelecionados.split(',').filter(id => id.trim() !== '') : [];

  // Exibe todos os parâmetros normais
  for (const [chave, valor] of params.entries()) {
    if (chave !== 'cardsSelecionados') {
      console.log(`${chave} : ${valor}`);
    }
  }

  // 🔥 CORREÇÃO: Exibe cada card individualmente SEM ESPAÇO
  if (listaCards.length > 0) {
    listaCards.forEach(cardId => {
      console.log(`${cardId}`); // 🔥 Removi o espaço aqui
    });
  }

  // Dados detalhados para uso interno
  const dados = {
    idAmbiente: params.get('idAmbiente'),
    idEspaco: params.get('idEspaco'),
    rua: params.get('rua'),
    numero: params.get('numero'),
    bairro: params.get('bairro'),
    cidade: params.get('cidade'),
    estado: params.get('estado'),
    cep: params.get('cep'),
    lat: params.get('lat'),
    lng: params.get('lng'),
    hospedes: params.get('hospedes'),
    quartos: params.get('quartos'),
    banheiros: params.get('banheiros'),
    cozinhas: params.get('cozinhas'),
    salas: params.get('salas'),
    cardsSelecionados: listaCards
  };
  
  console.log("📍 Dados detalhados completos:", dados);

  // ===== SISTEMA DE UPLOAD DE FOTOS (NOVO) =====
  
  // Elementos do sistema de fotos
  const btnAdicionarFotos = document.getElementById('btn-adicionar-fotos');
  const modalUpload = document.getElementById('modal-upload');
  const fecharModal = document.getElementById('fechar-modal');
  const btnCancelar = document.getElementById('btn-cancelar');
  const inputArquivo = document.getElementById('input-arquivo');
  const opcaoCamera = document.getElementById('opcao-camera');
  const galeriaFotos = document.getElementById('galeria-fotos');

  // Verificar se os elementos existem (para evitar erros)
  if (btnAdicionarFotos && modalUpload) {
    // Abrir modal
    btnAdicionarFotos.addEventListener('click', () => {
      modalUpload.style.display = 'flex';
    });

    // Fechar modal
    const fecharModalUpload = () => {
      modalUpload.style.display = 'none';
    };

    fecharModal.addEventListener('click', fecharModalUpload);
    btnCancelar.addEventListener('click', fecharModalUpload);

    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
      if (event.target === modalUpload) {
        fecharModalUpload();
      }
    });

    // Upload de arquivos
    inputArquivo.addEventListener('change', (event) => {
      const arquivos = event.target.files;
      if (arquivos.length > 0) {
        processarArquivos(arquivos);
        fecharModalUpload();
      }
    });

    // Opção de câmera
    opcaoCamera.addEventListener('click', () => {
      alert('Funcionalidade de câmera seria implementada com a API de mídia do navegador. Por enquanto, use "Escolher arquivos".');
    });

    // Processar arquivos de imagem
    function processarArquivos(arquivos) {
      // Remover mensagem de galeria vazia se existir
      const mensagemVazia = galeriaFotos.querySelector('.mensagem-vazia');
      if (mensagemVazia) {
        mensagemVazia.remove();
      }

      // Criar container de galeria se não existir
      let galeriaImagens = galeriaFotos.querySelector('.galeria-imagens');
      if (!galeriaImagens) {
        galeriaImagens = document.createElement('div');
        galeriaImagens.className = 'galeria-imagens';
        galeriaFotos.appendChild(galeriaImagens);
      }

      for (let i = 0; i < arquivos.length; i++) {
        const arquivo = arquivos[i];
        
        // Verificar se é uma imagem
        if (!arquivo.type.match('image.*')) {
          continue;
        }

        const leitor = new FileReader();
        
        leitor.onload = (function(oArquivo) {
          return function(e) {
            // Criar elemento de imagem na galeria
            const itemGaleria = document.createElement('div');
            itemGaleria.className = 'item-galeria';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Foto do espaço';
            
            const btnExcluir = document.createElement('button');
            btnExcluir.className = 'btn-excluir';
            btnExcluir.innerHTML = '<i class="fas fa-times"></i>';
            
            // Adicionar evento de exclusão
            btnExcluir.addEventListener('click', function() {
              itemGaleria.remove();
              
              // Se não houver mais imagens, mostrar mensagem de galeria vazia
              if (galeriaImagens.children.length === 0) {
                const mensagemVaziaDiv = document.createElement('div');
                mensagemVaziaDiv.className = 'mensagem-vazia';
                mensagemVaziaDiv.innerHTML = `
                  <i class="fas fa-images"></i>
                  <p>Nenhuma foto adicionada ainda</p>
                `;
                galeriaFotos.appendChild(mensagemVaziaDiv);
                galeriaImagens.remove();
              }
            });
            
            itemGaleria.appendChild(img);
            itemGaleria.appendChild(btnExcluir);
            galeriaImagens.appendChild(itemGaleria);

            // Mostrar mensagem de sucesso
            mostrarMensagemSucesso('Foto adicionada com sucesso!');
          };
        })(arquivo);
        
        leitor.readAsDataURL(arquivo);
      }
      
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      inputArquivo.value = '';
    }

    function mostrarMensagemSucesso(mensagem) {
      // Remover mensagem anterior se existir
      const mensagemAnterior = document.querySelector('.mensagem-sucesso');
      if (mensagemAnterior) {
        mensagemAnterior.remove();
      }

      const mensagemSucesso = document.createElement('div');
      mensagemSucesso.className = 'mensagem-sucesso';
      mensagemSucesso.textContent = mensagem;
      
      galeriaFotos.parentNode.insertBefore(mensagemSucesso, galeriaFotos.nextSibling);

      setTimeout(() => {
        mensagemSucesso.style.display = 'none';
      }, 3000);
    }
  } else {
    console.log('⚠️ Elementos do sistema de fotos não encontrados');
  }
});