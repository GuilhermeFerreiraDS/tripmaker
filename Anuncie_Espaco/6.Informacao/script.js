const cards = document.querySelectorAll('.comodidades-container .card');
const btnLeft = document.querySelector('.arrow-left');
const btnRight = document.querySelector('.arrow-right');

const cardsPerPage = 9;
let currentPage = 0;
const totalPages = Math.ceil(cards.length / cardsPerPage);

function showPage(page) {
  cards.forEach(card => card.style.display = 'none');

  const start = page * cardsPerPage;
  const end = start + cardsPerPage;
  for (let i = start; i < end && i < cards.length; i++) {
    cards[i].style.display = 'flex';
  }
}

// Inicializa
showPage(currentPage);

// Navegação
btnRight.addEventListener('click', () => {
  if (currentPage < totalPages - 1) {
    currentPage++;
    showPage(currentPage);
  }
});

btnLeft.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    showPage(currentPage);
  }
});
