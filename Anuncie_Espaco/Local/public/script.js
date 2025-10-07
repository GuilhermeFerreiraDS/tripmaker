document.addEventListener("DOMContentLoaded", () => {
    const addressInput = document.getElementById('address');
    const mapDiv = document.getElementById('map');
    let map, marker;

    // Inicializa mapa Leaflet imediatamente
    map = L.map('map').setView([-23.55052, -46.633308], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Google Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(addressInput, {
        types: ['geocode']
    });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            alert('Endereço não encontrado');
            return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Remove marcador anterior
        if (marker) map.removeLayer(marker);

        // Adiciona marcador Leaflet
        marker = L.marker([lat, lng]).addTo(map);

        // Centraliza mapa na marcação
        map.setView([lat, lng], 16);

        // Salvar temporariamente
        let anuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
        anuncios.push({
            endereco: addressInput.value,
            lat,
            lng
        });
        localStorage.setItem('anuncios', JSON.stringify(anuncios));

        console.log('Endereço marcado:', { endereco: addressInput.value, lat, lng });
    });
});
