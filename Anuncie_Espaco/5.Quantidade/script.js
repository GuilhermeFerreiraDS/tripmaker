document.querySelectorAll('.increase').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const countEl = document.getElementById(targetId);

    let currentValue = parseInt(countEl.textContent);
    if (isNaN(currentValue)) currentValue = 0; // Garante que comece em 0 se não for número

    countEl.textContent = currentValue + 1;
  });
});

document.querySelectorAll('.decrease').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const countEl = document.getElementById(targetId);

    let currentValue = parseInt(countEl.textContent);
    if (isNaN(currentValue) || currentValue <= 0) {
      currentValue = 0; // Não permite números negativos
    } else {
      currentValue--;
    }

    countEl.textContent = currentValue;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  // Pegando todos os dados da URL
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

  console.log("📦 Dados recebidos na página 5.Quantidade:", {
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

  // Exemplo: colocar os valores nos inputs se houver
  const campos = { rua, numero, bairro, cidade, estado, cep, lat, lng };

  for (const [campo, valor] of Object.entries(campos)) {
    const input = document.getElementById(`input-${campo}`);
    if (input) input.value = valor || "";
  }

  // Se você quiser usar os IDs em variáveis
  // idAmbiente e idEspaco já estão disponíveis para usar no script
});
