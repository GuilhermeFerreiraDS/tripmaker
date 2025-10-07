document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const idAmbiente = params.get('idAmbiente');
    console.log("ID vindo da página Ambiente:", idAmbiente);

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const idEspaco = card.id;
            console.log("ID escolhido na página Espaço:", idEspaco);

            // Envia os dois IDs para a página Local
            window.location.href = `../Local/public/index.php?idAmbiente=${idAmbiente}&idEspaco=${idEspaco}`;
        });
    });
});
