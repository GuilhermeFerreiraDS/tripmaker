document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const idAmbiente = card.id;

            // Se for Casa ou Apartamento, vai para "Espaco"
            if (idAmbiente === 'card-casa' || idAmbiente === 'card-apartamento') {
                window.location.href = `../2.Espaco/index.html?idAmbiente=${idAmbiente}`;
            } 
            // Senão, vai direto para "Local" só com idAmbiente
            else {
                window.location.href = `../3.Local/public/index.php?idAmbiente=${idAmbiente}`;
            }
        });
    });
});
