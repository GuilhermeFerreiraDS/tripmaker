document.addEventListener("DOMContentLoaded", () => {
    const addressInput = document.getElementById('address');
    let map, marker;
    let enderecoSelecionado = null; // vai armazenar o endereço escolhido

    // Inicializa mapa
    if (document.getElementById('map')) {
        map = L.map('map').setView([-23.55052, -46.633308], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }

    // Autocomplete
    if (addressInput) {
        const autocomplete = new google.maps.places.Autocomplete(addressInput, { types: ['geocode'] });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                alert('Endereço não encontrado');
                return;
            }

            let rua = null,
                numero = null,
                bairro = null,
                cidade = null,
                estado = null,
                cep = null;

            place.address_components.forEach(component => {
                const types = component.types;
                if (types.includes('route')) rua = component.long_name;
                if (types.includes('street_number')) numero = component.long_name;
                if (types.includes('sublocality') || types.includes('neighborhood') || types.includes('sublocality_level_1')) bairro = component.long_name;
                if (types.includes('locality')) cidade = component.long_name;
                if (types.includes('administrative_area_level_1')) estado = component.short_name;
                if (types.includes('postal_code')) cep = component.long_name;
            });

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            if (marker) map.removeLayer(marker);
            marker = L.marker([lat, lng]).addTo(map);
            map.setView([lat, lng], 16);

            // Salva endereço em memória para enviar no clique do botão
            enderecoSelecionado = { rua, numero, bairro, cidade, estado, cep, lat, lng };
            console.log('Endereço selecionado:', enderecoSelecionado);
        });
    }

    // Botão Confirmar
    const button = document.getElementById('confirmButton');
    button.addEventListener('click', () => {
        if (!enderecoSelecionado) {
            alert("Selecione um endereço antes de confirmar!");
            return;
        }

        // IDs do localStorage
        const idAmbiente = localStorage.getItem('idAmbiente') || '';
        const idEspaco = localStorage.getItem('idEspaco') || '';

        // Monta URL da página destino
        const url = new URL('../../4.Confirmar_Local/index.html', window.location.href);
        url.searchParams.set('idAmbiente', idAmbiente);
        url.searchParams.set('idEspaco', idEspaco);
        url.searchParams.set('rua', enderecoSelecionado.rua || '');
        url.searchParams.set('numero', enderecoSelecionado.numero || '');
        url.searchParams.set('bairro', enderecoSelecionado.bairro || '');
        url.searchParams.set('cidade', enderecoSelecionado.cidade || '');
        url.searchParams.set('estado', enderecoSelecionado.estado || '');
        url.searchParams.set('cep', enderecoSelecionado.cep || '');
        url.searchParams.set('lat', enderecoSelecionado.lat);
        url.searchParams.set('lng', enderecoSelecionado.lng);

        window.location.href = url.toString();

    });
});