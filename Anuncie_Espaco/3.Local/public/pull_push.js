document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const idAmbiente = params.get('idAmbiente');
    const idEspaco = params.get('idEspaco');

    console.log("ID do Ambiente recebido:", idAmbiente);
    console.log("ID do Espaço recebido:", idEspaco);

    // Guardar para usar no redirecionamento
    if (idAmbiente) localStorage.setItem('idAmbiente', idAmbiente);
    if (idEspaco) localStorage.setItem('idEspaco', idEspaco);
});
