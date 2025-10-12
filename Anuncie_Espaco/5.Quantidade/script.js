// AUMENTAR
document.querySelectorAll('.increase').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const countEl = document.getElementById(targetId);

    let currentValue = parseInt(countEl.textContent);
    if (isNaN(currentValue)) currentValue = 0;

    countEl.textContent = currentValue + 1;
  });
});

// DIMINUIR
document.querySelectorAll('.decrease').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const countEl = document.getElementById(targetId);

    let currentValue = parseInt(countEl.textContent);
    if (isNaN(currentValue) || currentValue <= 0) {
      currentValue = 0;
    } else {
      currentValue--;
    }

    countEl.textContent = currentValue;
  });
});

// PEGAR OS DADOS DA URL AO CARREGAR
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

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

  const campos = { rua, numero, bairro, cidade, estado, cep, lat, lng };
  for (const [campo, valor] of Object.entries(campos)) {
    const input = document.getElementById(`input-${campo}`);
    if (input) input.value = valor || "";
  }

  // ✅ FUNÇÃO DO BOTÃO CONFIRMAR
  const confirmBtn = document.getElementById('confirm');
  confirmBtn.addEventListener('click', () => {

    // Pegar todos os IDs das divs com contadores
    const contadores = ['hospedes', 'quartos', 'banheiros', 'cozinhas', 'salas'];
    const dadosContadores = {};

    contadores.forEach(id => {
      const el = document.getElementById(id);
      dadosContadores[id] = el ? parseInt(el.textContent) : 0;
    });

    console.log("📊 Quantidades selecionadas:", dadosContadores);

    // Montar nova URL com os dados antigos + novos
    const novaURL = new URL('../6.Informacao/index.html', window.location.href);

    // Adicionar os dados antigos
    novaURL.searchParams.set('idAmbiente', idAmbiente);
    novaURL.searchParams.set('idEspaco', idEspaco);
    novaURL.searchParams.set('rua', rua);
    novaURL.searchParams.set('numero', numero);
    novaURL.searchParams.set('bairro', bairro);
    novaURL.searchParams.set('cidade', cidade);
    novaURL.searchParams.set('estado', estado);
    novaURL.searchParams.set('cep', cep);
    novaURL.searchParams.set('lat', lat);
    novaURL.searchParams.set('lng', lng);

    // Adicionar os novos dados (contadores)
    for (const [chave, valor] of Object.entries(dadosContadores)) {
      novaURL.searchParams.set(chave, valor);
    }

    // Verificar a URL final no console
    console.log("🌐 Redirecionando para:", novaURL.toString());

    // Redirecionar
    window.location.href = novaURL.toString();
  });
});
