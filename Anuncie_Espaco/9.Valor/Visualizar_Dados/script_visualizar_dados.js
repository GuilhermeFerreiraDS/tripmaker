 function adicionarImagem() {
                    const container = document.getElementById('container-imagens');
                    const novoItem = document.createElement('div');
                    novoItem.className = 'imagem-item-editar';
                    novoItem.innerHTML = `
                        <input type="text" 
                               name="imagens[]" 
                               class="form-input" 
                               placeholder="https://exemplo.com/imagem.jpg"
                               oninput="previewImagem(this)">
                        <button type="button" class="btn-remover-imagem" onclick="removerImagem(this)">×</button>
                        <img class="preview-imagem" style="display: none;">
                    `;
                    container.appendChild(novoItem);
                }

                function removerImagem(botao) {
                    const item = botao.parentElement;
                    // Só remove se tiver mais de um campo de imagem
                    if (document.querySelectorAll('.imagem-item-editar').length > 1) {
                        item.remove();
                    } else {
                        // Se for o último, apenas limpa o campo
                        const input = item.querySelector('input');
                        input.value = '';
                        const preview = item.querySelector('.preview-imagem');
                        preview.style.display = 'none';
                        preview.src = '';
                    }
                }

                function previewImagem(input) {
                    const preview = input.parentElement.querySelector('.preview-imagem');
                    if (input.value.trim() !== '') {
                        preview.src = input.value;
                        preview.style.display = 'block';
                    } else {
                        preview.style.display = 'none';
                    }
                }

                // Inicializar previews das imagens existentes
                document.querySelectorAll('.imagem-item-editar input').forEach(input => {
                    if (input.value.trim() !== '') {
                        previewImagem(input);
                    }
                });