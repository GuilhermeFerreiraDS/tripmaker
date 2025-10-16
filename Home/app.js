let nextBtn = document.querySelector('.next')
let prevBtn = document.querySelector('.prev')

let slider = document.querySelector('.slider')
let sliderList = slider.querySelector('.slider .list')
let thumbnail = document.querySelector('.slider .thumbnail')
let thumbnailItems = thumbnail.querySelectorAll('.item')

thumbnail.appendChild(thumbnailItems[0])

// Eventos de clique
if (nextBtn) {
    nextBtn.onclick = function () {
        moveSlider('next')
    }
}
if (prevBtn) {
    prevBtn.onclick = function () {
        moveSlider('prev')
    }
}

function moveSlider(direction) {
    let sliderItems = sliderList.querySelectorAll('.item')
    let thumbnailItems = document.querySelectorAll('.thumbnail .item')

    if (direction === 'next') {
        sliderList.appendChild(sliderItems[0])
        thumbnail.appendChild(thumbnailItems[0])
        slider.classList.add('next')
    } else {
        sliderList.prepend(sliderItems[sliderItems.length - 1])
        thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1])
        slider.classList.add('prev')
    }

    // remove a classe quando a animação terminar
    slider.addEventListener('animationend', function () {
        slider.classList.remove('next')
        slider.classList.remove('prev')
    }, { once: true })
}

// ------------------- AUTO SLIDE -------------------
let autoSlide = setInterval(() => moveSlider('next'), 3000)

// Pausar quando o mouse entra no slider
slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlide)
})

// Retomar quando o mouse sai do slider
slider.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => moveSlider('next'), 3000)
})
