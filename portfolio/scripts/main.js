(function(){
  const doc = document.documentElement;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setTheme(next){
    if(next === 'dark') doc.classList.add('theme-dark');
    else doc.classList.remove('theme-dark');
    localStorage.setItem('theme', next);
  }

  // Theme toggle
  const themeToggle = $('.theme-toggle');
  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      const isDark = doc.classList.contains('theme-dark');
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // Mobile nav
  const navToggle = $('.nav-toggle');
  const siteNav = $('#site-nav');
  if(navToggle && siteNav){
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Close on link click
    siteNav.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      if(anchor){
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Projects data (edit with your real projects)
  const projects = [
    {
      title: 'Multisite Enterprise Network',
      description: 'Cisco Packet Tracer lab featuring multi‑site topology with VLANs, inter‑VLAN routing, OSPF, HSRP, ACLs, DHCP, and site‑to‑site VPN.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=60',
      tags: ['Cisco Packet Tracer', 'VLAN', 'OSPF', 'HSRP', 'ACL', 'VPN'],
      category: 'network',
      links: { code: 'projects/multisite-enterprise-network.html' }
    },
    {
      title: 'Design System – PolarisX',
      description: 'Composable component library with accessibility baked in and theming support.',
      image: 'https://images.unsplash.com/photo-1547658719-98fda9f4b065?w=1200&auto=format&fit=crop&q=60',
      tags: ['React', 'TypeScript', 'Storybook'],
      category: 'ui',
      links: { demo: 'https://example.com', code: 'https://github.com/your-username/polarisx' }
    },
    {
      title: 'Site Performance Toolkit',
      description: 'CLI and CI utilities for web performance budgets and Lighthouse audits.',
      image: 'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=1200&auto=format&fit=crop&q=60',
      tags: ['Node.js', 'Lighthouse', 'CI'],
      category: 'tooling',
      links: { code: 'https://github.com/your-username/perf-toolkit' }
    },
    {
      title: 'E‑commerce Frontend',
      description: 'SSR storefront with edge caching, seamless checkout, and robust analytics.',
      image: 'https://images.unsplash.com/photo-1519336555923-59661f41bb6d?w=1200&auto=format&fit=crop&q=60',
      tags: ['Next.js', 'Tailwind', 'Stripe'],
      category: 'web',
      links: { demo: 'https://example.com' }
    }
  ];

  function renderProjects(filter = 'all'){
    const grid = $('#project-grid');
    if(!grid) return;
    grid.innerHTML = '';
    const items = projects.filter(p => filter === 'all' ? true : p.category === filter);
    for(const p of items){
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image}" alt="" loading="lazy" />
        <div class="card-body">
          <h3 class="card-title">${p.title}</h3>
          <p class="card-desc">${p.description}</p>
          <div class="card-tags">
            ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="card-actions">
          ${p.links.demo ? `<a class="btn btn-primary" target="_blank" rel="noreferrer" href="${p.links.demo}">Live</a>` : ''}
          ${p.links.code ? `<a class="btn" target="_blank" rel="noreferrer" href="${p.links.code}">Details</a>` : ''}
        </div>
      `;
      grid.appendChild(card);
    }
    if(items.length === 0){
      const p = document.createElement('p');
      p.textContent = 'No projects match the selected filter.';
      p.style.color = 'var(--text-muted)';
      grid.appendChild(p);
    }
  }

  // Filters
  const filterChips = $$('.filters .chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      renderProjects(chip.dataset.filter);
    });
  });

  // Experience: enhance keyboard nav for timeline if needed later

  // Footer year
  const yearEl = $('#year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  // Initial render
  renderProjects('all');
})(); 