document.addEventListener("DOMContentLoaded", () => {
    // Pega os parâmetros da URL da página Local
    const params = new URLSearchParams(window.location.search);

    const idAmbiente = params.get('idAmbiente');
    const idEspaco = params.get('idEspaco');

    console.log("ID do Ambiente recebido:", idAmbiente);
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Pega o ID do ambiente da URL da página Ambiente
    const params = new URLSearchParams(window.location.search);
    const idAmbiente = params.get('idAmbiente');

    if (!idAmbiente) {
        console.warn("Nenhum ID de Ambiente foi passado na URL!");
        return; // evita erro caso não haja ID
    }

    // 2. Seleciona todos os cards da página Espaço
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const idEspaco = card.id;

            if (!idEspaco) {
                console.warn("O card clicado não possui ID!");
                return;
            }

            console.log("ID escolhido na página Espaço:", idEspaco);

            // 3. Redireciona para a página Local passando os dois IDs
            const url = `../3.Local/public/index.php?idAmbiente=${encodeURIComponent(idAmbiente)}&idEspaco=${encodeURIComponent(idEspaco)}`;
            window.location.href = url;
        });
    });
});

