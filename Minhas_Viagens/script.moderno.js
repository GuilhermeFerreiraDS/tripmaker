// script.moderno.js — interações e renderização
const viagens = [
  { id:'rj-2023', titulo:'Rio de Janeiro', pais:'Brasil', inicio:'2023-11-10', fim:'2023-11-18', tags:['praia','trilha','familia'], capa:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1400&auto=format&fit=crop' },
  { id:'sp-2022', titulo:'São Paulo', pais:'Brasil', inicio:'2022-04-30', fim:'2022-05-04', tags:['gastronomia','museus'], capa:'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1400&auto=format&fit=crop' },
  { id:'par-2021', titulo:'Paris', pais:'França', inicio:'2021-09-02', fim:'2021-09-11', tags:['romantico','museus','arquitetura'], capa:'https://images.unsplash.com/photo-1528299127031-1b3a4b6e4f9b?q=80&w=1400&auto=format&fit=crop' },
  { id:'foz-2024', titulo:'Foz do Iguaçu', pais:'Brasil', inicio:'2024-02-11', fim:'2024-02-15', tags:['natureza','cachoeiras'], capa:'https://images.unsplash.com/photo-1560969184-10fe8719f12a?q=80&w=1400&auto=format&fit=crop' },
  { id:'ny-2019', titulo:'Nova York', pais:'Estados Unidos', inicio:'2019-07-10', fim:'2019-07-20', tags:['negocios','gastronomia'], capa:'https://images.unsplash.com/photo-1505765052884-2c2e1b1b9b2d?q=80&w=1400&auto=format&fit=crop' }
];

const grid = document.getElementById('grid');
const tpl = document.getElementById('cardTpl');
const searchInput = document.getElementById('searchInput');
const cityFilter = document.getElementById('cityFilter');
const yearFilter = document.getElementById('yearFilter');
const sortFilter = document.getElementById('sortFilter');
const empty = document.getElementById('empty');
const themeToggle = document.getElementById('themeToggle');

function populateFilters(){
  const cities = [...new Set(viagens.map(v=>v.titulo))];
  cities.forEach(c=>{
    const o=document.createElement('option'); o.value=c; o.textContent=c; cityFilter.appendChild(o);
  });
  const years = [...new Set(viagens.map(v=>new Date(v.inicio).getFullYear()))].sort((a,b)=>b-a);
  years.forEach(y=>{
    const o=document.createElement('option'); o.value=y; o.textContent=y; yearFilter.appendChild(o);
  });
}
function render(list){
  grid.innerHTML='';
  if(list.length===0){ empty.hidden=false; return } else { empty.hidden=true }
  list.forEach(v=>{
    const node = tpl.content.cloneNode(true);
    const art = node.querySelector('article');
    art.id = v.id;
    node.querySelector('.cover img').src = v.capa;
    node.querySelector('.badge').textContent = v.pais;
    node.querySelector('.card-title').textContent = v.titulo;
    node.querySelector('.card-meta').textContent = `${v.pais} • ${formatDate(v.inicio)} — ${formatDate(v.fim)}`;
    const tagsWrap = node.querySelector('.tags');
    v.tags.forEach(t=>{
      const sp = document.createElement('span');
      sp.className='tag';
      sp.textContent = '#'+t;
      if(t.toLowerCase().includes('praia')) sp.setAttribute('data-theme','praia');
      if(t.toLowerCase().includes('gastronomia')) sp.setAttribute('data-theme','gastronomia');
      if(t.toLowerCase().includes('natureza')) sp.setAttribute('data-theme','natureza');
      tagsWrap.appendChild(sp);
    });
    // buttons
    node.querySelector('.btn.copy').addEventListener('click', (e)=>{
      navigator.clipboard && navigator.clipboard.writeText(location.href + '#'+v.id);
      const b = e.currentTarget;
      b.textContent = 'Copiado!';
      setTimeout(()=> b.textContent = 'Copiar link',1200);
    });
    node.querySelector('.btn.detail').addEventListener('click', ()=> alert('Abrir detalhes: '+v.titulo));
    grid.appendChild(node);
  });
  // reveal animation
  const cards = grid.querySelectorAll('.card');
  cards.forEach((c,i)=> {
    c.style.opacity=0;
    c.style.transform='translateY(10px)';
    setTimeout(()=>{ c.style.transition='opacity .45s ease, transform .45s ease'; c.style.opacity=1; c.style.transform='translateY(0)'; }, 60*i);
  });
}

function formatDate(d){
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  let list = viagens.slice();
  const city = cityFilter.value;
  const year = yearFilter.value;
  const sort = sortFilter.value;
  if(city) list = list.filter(l => l.titulo === city);
  if(year) list = list.filter(l => new Date(l.inicio).getFullYear().toString() === year);
  if(q) list = list.filter(l => (l.titulo+' '+l.pais+' '+l.tags.join(' ')).toLowerCase().includes(q));
  if(sort==='az') list.sort((a,b)=> a.titulo.localeCompare(b.titulo));
  if(sort==='recent') list.sort((a,b)=> new Date(b.inicio)-new Date(a.inicio));
  if(sort==='oldest') list.sort((a,b)=> new Date(a.inicio)-new Date(b.inicio));
  render(list);
}

searchInput.addEventListener('input', applyFilters);
cityFilter.addEventListener('change', applyFilters);
yearFilter.addEventListener('change', applyFilters);
sortFilter.addEventListener('change', applyFilters);

themeToggle.addEventListener('click', ()=>{
  const pressed = themeToggle.getAttribute('aria-pressed') === 'true';
  themeToggle.setAttribute('aria-pressed', String(!pressed));
  document.body.classList.toggle('dark', !pressed);
  themeToggle.textContent = !pressed ? '☀️' : '🌙';
});

// init
populateFilters();
render(viagens);
