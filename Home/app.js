let nextBtn = document.querySelector('.next')
let prevBtn = document.querySelector('.prev')

let slider = document.querySelector('.slider')
let sliderList = slider.querySelector('.list')
let thumbnail = slider.querySelector('.thumbnail')
let thumbnailItems = thumbnail.querySelectorAll('.item')

// BOLINHAS DO INDICADOR
let indicatorDots = document.querySelectorAll('.indicator-dot')

// Mapeamento cidade → índice
const cityToIndex = {
    'SOROCABA': 0,
    'ITU': 1,
    'TATUÍ': 2,
    'BOITUVA': 3
}

// Ajuste inicial
thumbnail.appendChild(thumbnailItems[0])

// -------------------------------
// 🔵 1. Pegar índice do slide visível
// -------------------------------
function getCurrentSlideIndex() {
    let visibleSlide = document.querySelector('.list .item')
    if (!visibleSlide) return 0

    let titleElement = visibleSlide.querySelector('.title')
    if (!titleElement) return 0

    let cityName = titleElement.textContent.trim()
    return cityToIndex[cityName] ?? 0
}

// -------------------------------
// 🔵 2. Atualizar bolinhas
// -------------------------------
function updateIndicators() {
    let currentIndex = getCurrentSlideIndex()

    indicatorDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex)
    })
}

// -------------------------------
// 🔵 3. Navegar via bolinhas
// -------------------------------
indicatorDots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlideByCity(index))
})

function goToSlideByCity(targetIndex) {
    let sliderItems = sliderList.querySelectorAll('.item')
    let thumbnailItems = thumbnail.querySelectorAll('.item')

    let targetCity = Object.keys(cityToIndex).find(city => cityToIndex[city] === targetIndex)
    if (!targetCity) return

    let slideIndex = [...sliderItems].findIndex(item =>
        item.querySelector('.title').textContent.trim() === targetCity
    )

    if (slideIndex === -1) return

    // Mover até o slide desejado
    while (slideIndex > 0) {
        sliderList.appendChild(sliderItems[0])
        thumbnail.appendChild(thumbnailItems[0])
        sliderItems = sliderList.querySelectorAll('.item')
        thumbnailItems = thumbnail.querySelectorAll('.item')
        slideIndex--
    }

    slider.classList.add('next')
    updateIndicators()

    setTimeout(() => slider.classList.remove('next'), 500)
}

// -------------------------------
// 📌 4. Botões next / prev
// -------------------------------
function moveSlider(direction) {
    let sliderItems = sliderList.querySelectorAll('.item')
    let thumbItems = thumbnail.querySelectorAll('.item')

    if (direction === 'next') {
        sliderList.appendChild(sliderItems[0])
        thumbnail.appendChild(thumbItems[0])
        slider.classList.add('next')
    } else {
        sliderList.prepend(sliderItems[sliderItems.length - 1])
        thumbnail.prepend(thumbItems[thumbItems.length - 1])
        slider.classList.add('prev')
    }

    setTimeout(updateIndicators, 300)

    slider.addEventListener(
        'animationend',
        () => slider.classList.remove('next', 'prev'),
        { once: true }
    )
}

if (nextBtn) nextBtn.onclick = () => moveSlider('next')
if (prevBtn) prevBtn.onclick = () => moveSlider('prev')

// -------------------------------
// ⏱️ 5. AUTO SLIDE + PAUSE
// -------------------------------
let autoSlide = setInterval(() => {
    moveSlider('next')
    setTimeout(updateIndicators, 100)
}, 3000)

function pauseAutoSlide() {
    clearInterval(autoSlide)
}

function resumeAutoSlide() {
    autoSlide = setInterval(() => {
        moveSlider('next')
        setTimeout(updateIndicators, 100)
    }, 3000)
}

slider.addEventListener('mouseenter', pauseAutoSlide)
slider.addEventListener('mouseleave', resumeAutoSlide)

// Caso tenha indicadores ao lado
let verticalIndicators = document.querySelector('.vertical-indicators')
if (verticalIndicators) {
    verticalIndicators.addEventListener('mouseenter', pauseAutoSlide)
    verticalIndicators.addEventListener('mouseleave', resumeAutoSlide)
}

// -------------------------------
// 🔢 6. Contadores animados
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const contadores = document.querySelectorAll('.contador-numero')

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const contador = entry.target
                    const target = parseInt(contador.dataset.target)
                    let count = 0

                    const increment = target / 100

                    const updateCount = () => {
                        if (count < target) {
                            count += increment
                            contador.textContent = Math.floor(count)
                            setTimeout(updateCount, 10)
                        } else {
                            contador.textContent = target
                        }
                    }

                    updateCount()
                    observer.unobserve(contador)
                }
            })
        },
        { threshold: 0.5 }
    )

    contadores.forEach(cont => observer.observe(cont))
})

// -------------------------------
// 🟦 7. Efeito hover nos cards
// -------------------------------
const cards = document.querySelectorAll(
    '.card-hotel-estilizado, .card-ponto, .card-destino-premium'
)

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10'
    })
    card.addEventListener('mouseleave', () => {
        card.style.zIndex = '1'
    })
})

// -------------------------------
// 🟡 8. Garantir bolinhas corretas no carregamento
// -------------------------------
window.addEventListener('load', () => {
    setTimeout(updateIndicators, 400)
})

function refreshActiveState() {
    let items = document.querySelectorAll('.list .item');
    items.forEach((item, i) => {
        item.classList.remove('active');
    });
    items[0].classList.add('active');
}

setTimeout(refreshActiveState, 50);
