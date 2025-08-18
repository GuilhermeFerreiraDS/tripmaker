// === Dados de exemplo (edite/adicione à vontade) ===
const viagens = [
    { id: 'rj-2023', titulo: 'Rio de Janeiro', pais: 'Brasil', continente: 'América do Sul', inicio: '2023-11-10', fim: '2023-11-18',
      tags: ['praia','trilha','família'],
      capa: 'https://images.unsplash.com/photo-1509824227185-9c7519a40d1e?q=80&w=1600&auto=format&fit=crop'
    },
    { id: 'sp-2022', titulo: 'São Paulo', pais: 'Brasil', continente: 'América do Sul', inicio: '2022-05-01', fim: '2022-05-05',
      tags: ['gastronomia','museus','negócios'],
      capa: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1600&auto=format&fit=crop'
    },
    { id: 'foz-2024', titulo: 'Foz do Iguaçu', pais: 'Brasil', continente: 'América do Sul', inicio: '2024-02-12', fim: '2024-02-16',
      tags: ['natureza','cachoeiras','fronteira'],
      capa: 'https://images.unsplash.com/photo-1560969184-10fe8719f12a?q=80&w=1600&auto=format&fit=crop'
    },
    { id: 'par-2021', titulo: 'Paris', pais: 'França', continente: 'Europa', inicio: '2021-09-03', fim: '2021-09-12',
      tags: ['romântico','museus','arquitetura'],
      capa: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1600&auto=format&fit=crop'
    },
    { id: 'bue-2020', titulo: 'Buenos Aires', pais: 'Argentina', continente: 'América do Sul', inicio: '2020-03-10', fim: '2020-03-15',
      tags: ['gastronomia','arte','tango'],
      capa: 'https://images.unsplash.com/photo-1602626063333-59f64478cd12?q=80&w=1600&auto=format&fit=crop'
    },
    { id: 'ny-2019', titulo: 'Nova York', pais: 'Estados Unidos', continente: 'América do Norte', inicio: '2019-07-20', fim: '2019-07-29',
      tags: ['cidade grande','shows','compras'],
      capa: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop'
    },
    { id: 'lis-2024', titulo: 'Lisboa', pais: 'Portugal', continente: 'Europa', inicio: '2024-05-04', fim: '2024-05-11',
      tags: ['história','miradouros','gastronomia'],
      capa: 'https://images.unsplash.com/photo-1501611724492-c0e1ee48d2ff?q=80&w=1600&auto=format&fit=crop'
    },
    { id: 'tok-2025', titulo: 'Tóquio', pais: 'Japão', continente: 'Ásia', inicio: '2025-03-14', fim: '2025-03-26',
      tags: ['tecnologia','templo','comida'],
      capa: 'https://images.unsplash.com/photo-1505064192971-4a9b8a59d0aa?q=80&w=1600&auto=format&fit=crop'
    }
  ];

  // === Utilitários ===
  const fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  const byRecent = (a,b) => new Date(b.inicio) - new Date(a.inicio);
  const byOldest = (a,b) => new Date(a.inicio) - new Date(b.inicio);
  const byAZ = (a,b) => a.titulo.localeCompare(b.titulo, 'pt-BR');

  function yearOf(v) { return new Date(v.inicio).getFullYear(); }

  function uniqueYears(list) {
    return [...new Set(list.map(yearOf))].sort((a,b)=>b-a);
  }

  // Preencher select de anos
  function fillYears() {
    const years = uniqueYears(viagens);
    const sel = document.getElementById('year');
    years.forEach(y => {
      const o = document.createElement('option');
      o.value = String(y); o.textContent = y; sel.appendChild(o);
    });
  }

  // Renderizar cards
  function render(list) {
    const grid = document.getElementById('grid');
    const empty = document.getElementById('empty');
    grid.innerHTML = '';
    if (!list.length) { empty.hidden = false; return; } else { empty.hidden = true; }

    const frag = document.createDocumentFragment();
    list.forEach(v => {
      const el = document.createElement('article');
      el.className = 'card'; el.role = 'listitem'; el.tabIndex = 0;
      el.innerHTML = `
        <div class="cover">
          <img src="${v.capa}" alt="${v.titulo}" loading="lazy"/>
          <span class="badge">${v.pais}</span>
        </div>
        <div class="content">
          <h3 class="title">${v.titulo}</h3>
          <div class="meta">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 21s-7-4.35-7-10a7 7 0 1114 0c0 5.65-7 10-7 10z" stroke="#9bb0c2" stroke-width="1.5"/></svg>
              ${v.pais} · ${v.continente}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="3" stroke="#9bb0c2" stroke-width="1.5"/><path d="M8 2v4M16 2v4M3 10h18" stroke="#9bb0c2" stroke-width="1.5"/></svg>
              ${fmt.format(new Date(v.inicio))} – ${fmt.format(new Date(v.fim))}
            </span>
          </div>
          <div class="chips">${v.tags.map(t=>`<span class="chip">#${t}</span>`).join('')}</div>
          <div class="actions">
            <button class="btn primary" data-id="${v.id}">Ver detalhes</button>
            <button class="btn" data-copy>Copiar link</button>
          </div>
        </div>
      `;
      frag.appendChild(el);
    });
    grid.appendChild(frag);

    // ações
    grid.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const title = card.querySelector('.title').textContent.trim();
        const share = `${location.origin}${location.pathname}#${encodeURIComponent(title)}`;
        navigator.clipboard.writeText(share).then(()=>{
          btn.textContent = 'Link copiado!';
          setTimeout(()=>btn.textContent = 'Copiar link', 1500);
        });
      });
    });
  }

  function applyFilters() {
    const q = document.getElementById('q').value.trim().toLowerCase();
    const continent = document.getElementById('continent').value;
    const year = document.getElementById('year').value;
    const sort = document.getElementById('sort').value;

    let list = viagens.filter(v => {
      const text = `${v.titulo} ${v.pais} ${v.continente} ${v.tags.join(' ')}`.toLowerCase();
      const matchesQ = !q || text.includes(q);
      const matchesC = !continent || v.continente === continent;
      const matchesY = !year || String(yearOf(v)) === year;
      return matchesQ && matchesC && matchesY;
    });

    if (sort === 'recent') list.sort(byRecent); else if (sort === 'oldest') list.sort(byOldest); else list.sort(byAZ);
    render(list);
  }

  function restoreFromHash() {
    // Se houver um hash com título, foca o card correspondente.
    const hash = decodeURIComponent(location.hash.replace('#',''));
    if (!hash) return;
    const card = [...document.querySelectorAll('.card .title')].find(t=>t.textContent.trim()===hash);
    if (card) card.closest('.card').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Eventos
  ['q','continent','year','sort'].forEach(id => {
    document.getElementById(id).addEventListener('input', applyFilters);
    document.getElementById(id).addEventListener('change', applyFilters);
  });

  // Init
  fillYears();
  applyFilters();
  window.addEventListener('hashchange', restoreFromHash);
  window.setTimeout(restoreFromHash, 50);