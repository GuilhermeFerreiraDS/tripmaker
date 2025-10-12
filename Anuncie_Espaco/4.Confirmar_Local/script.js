document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    // 1️⃣ Pegando os parâmetros da URL
    const idAmbiente = params.get('idAmbiente');
    const idEspaco = params.get('idEspaco');
    const rua = params.get('rua');
    const numero = params.get('numero');
    const bairro = params.get('bairro');
    const cidade = params.get('cidade');
    const estado = params.get('estado');
    const cep = params.get('cep');
    const lat = params.get('lat');
    const lng = params.get('lng');

    console.log("📦 Dados recebidos na nova página:", {
        idAmbiente,
        idEspaco,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        lat,
        lng
    });

    // 2️⃣ Preenchendo automaticamente os inputs com os dados da URL
    const campos = {
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        lat,
        lng
    };

    for (const [campo, valor] of Object.entries(campos)) {
        const input = document.getElementById(`input-${campo}`);
        if (input) input.value = valor || "";
    }

    // 3️⃣ Configura o envio do formulário
    const form = document.querySelector('.form-container');
    const btnEnviar = document.getElementById('btn-enviar');

    btnEnviar.addEventListener('click', (e) => {
        e.preventDefault(); // Evita envio automático do form

        const inputs = form.querySelectorAll('input');
        let algumVazio = false;
        const valores = {};

        // 4️⃣ Pega os valores atuais dos inputs e verifica se estão preenchidos
        inputs.forEach(input => {
            const name = input.name;
            const valor = input.value.trim();
            valores[name] = valor;

            if (!valor) {
                algumVazio = true;
            }
        });

        if (algumVazio) {
            alert("Por favor, preencha todos os campos antes de continuar!");
            return;
        }

        // 5️⃣ Adiciona os IDs ao objeto de valores
        valores.idAmbiente = idAmbiente || "";
        valores.idEspaco = idEspaco || "";

        // 6️⃣ Constrói a URL da próxima página com todos os valores
        const queryString = new URLSearchParams(valores).toString();
        const proximaPagina = `../5.Quantidade/index.html?${queryString}`;

        // 7️⃣ Redireciona
        window.location.href = proximaPagina;
    });
});
