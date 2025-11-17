// ================================================
// DATA - Testimonies Array
// ================================================
const TESTIMONIES = [
  {
    id: 1,
    title: "Guérison miraculeuse",
    text: "Après 5 ans de maladie...",
    fullText: "Après des années de souffrance et de traitements sans succès, j'ai décidé de remettre ma santé entre les mains de Dieu. Lors d'une soirée de prière au CMP, j'ai ressenti une chaleur intense dans mon corps. Le lendemain, en allant voir mon médecin, les examens ont révélé que ma maladie chronique avait complètement disparu. Les médecins n'en reviennent toujours pas. C'est un miracle que seul Dieu pouvait accomplir. Toute la gloire Lui revient !",
    color: 'green',
    font: 'Inter',
    author: "Marie D.",
    location: "Kinshasa, RDC",
    date: "1 nov.",
    category: "Guérison"
  },
  {
    id: 2,
    title: "Provision financière",
    text: "J'étais au chômage depuis 2 ans...",
    fullText: "Face à des difficultés financières insurmontables, j'ai choisi de faire confiance à Dieu plutôt qu'à mes propres forces. J'ai continué à payer ma dîme malgré le manque. Quelques semaines plus tard, j'ai reçu une opportunité professionnelle inespérée qui a non seulement résolu mes problèmes financiers, mais m'a aussi permis d'aider d'autres personnes dans le besoin. Sa providence est réelle !",
    color: 'yellow',
    font: 'Merriweather',
    author: "Jean-Paul K.",
    location: "Paris, France",
    date: "25 oct.",
    category: "Provision"
  },
  {
    id: 3,
    title: "Restauration familiale",
    text: "Mon mariage était brisé...",
    fullText: "Mon épouse et moi étions séparés depuis 6 mois et les papiers de divorce étaient prêts. Désespéré, j'ai commencé à prier et jeûner. Le pasteur nous a accompagnés dans un processus de guérison. Aujourd'hui, non seulement nous sommes de nouveau ensemble, mais notre amour est plus profond qu'avant. Dieu est le Dieu de la restauration !",
    color: 'pink',
    font: 'Indie Flower',
    author: "Famille Mbala",
    location: "Bruxelles, Belgique",
    date: "28 oct.",
    category: "Famille"
  },
  {
    id: 4,
    type: 'video',
    title: "Ma délivrance totale",
    thumbnail: "https://images.unsplash.com/photo-1547357245-bd63d4b7c483?w=400",
    fullText: "Témoignage vidéo de délivrance",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "2:15",
    color: 'green',
    author: "Samuel T.",
    location: "Lubumbashi, RDC",
    date: "22 oct.",
    category: "Délivrance"
  },
  {
    id: 5,
    title: "Miracle d'admission",
    text: "Mon dossier était refusé partout...",
    fullText: "J'avais raté mes examens deux années consécutives. Découragé, j'ai commencé à prier chaque matin avant d'étudier, demandant à Dieu la sagesse. Mes notes se sont améliorées progressivement. Cette année, j'ai non seulement réussi, mais j'ai obtenu une mention. Merci Seigneur pour la sagesse que tu donnes !",
    color: 'pink',
    font: 'Caveat',
    author: "Grace N.",
    location: "Montréal, Canada",
    date: "20 oct.",
    category: "Éducation"
  },
  {
    id: 6,
    title: "Protection divine",
    text: "Un accident terrible évité...",
    fullText: "Mon véhicule a fait plusieurs tonneaux sur l'autoroute. La voiture était complètement détruite. Les pompiers ont dit que personne n'aurait dû survivre à un tel accident. Mais je suis sorti sans une égratignure. Les médecins l'ont qualifié de miracle. Je sais que Dieu a envoyé ses anges pour me protéger ce jour-là.",
    color: 'yellow',
    font: 'Patrick Hand',
    author: "Daniel M.",
    location: "Goma, RDC",
    date: "18 oct.",
    category: "Protection"
  },
  {
    id: 7,
    type: 'video',
    title: "Témoignage de foi et restauration",
    thumbnail: "https://images.unsplash.com/photo-1559154352-06e29e1e11aa?w=400",
    fullText: "Témoignage vidéo de réconciliation familiale",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "3:20",
    color: 'pink',
    author: "Claire M.",
    location: "Londres, UK",
    date: "12 oct.",
    category: "Famille"
  },
  {
    id: 8,
    title: "Maternité après 12 ans",
    text: "Les médecins disaient que c'était impossible...",
    fullText: "Mariés depuis 8 ans, nous avions essayé tous les traitements de fertilité possibles sans succès. Les médecins avaient déclaré que nous ne pourrions jamais avoir d'enfants naturellement. Nous avons décidé de nous en remettre complètement à Dieu. Un an plus tard, ma femme était enceinte... de jumeaux ! Notre Dieu fait des miracles !",
    color: 'green',
    font: 'Kalam',
    author: "Couple Mutombo",
    location: "Douala, Cameroun",
    date: "15 oct.",
    category: "Famille"
  },
  {
    id: 9,
    title: "Entreprise prospère",
    text: "Mon business était en faillite...",
    fullText: "Je travaillais dans un environnement toxique qui affectait ma santé mentale et physique. J'ai prié pour une issue. En quelques semaines, j'ai reçu trois offres d'emploi différentes, toutes meilleures que ma situation actuelle. J'ai choisi celle qui alignait le mieux avec mes valeurs, et aujourd'hui je m'épanouis dans ma carrière.",
    color: 'yellow',
    font: 'Permanent Marker',
    author: "Christelle B.",
    location: "Genève, Suisse",
    date: "10 oct.",
    category: "Provision"
  },
  {
    id: 10,
    title: "Libération spirituelle",
    text: "J'étais tourmenté par des cauchemars...",
    fullText: "Pendant des années, j'étais tourmenté par des cauchemars et des peurs inexplicables. Ma vie était paralysée par l'anxiété. Lors d'une session de délivrance au CMP, j'ai ressenti une paix profonde m'envahir. Depuis ce jour, je dors paisiblement et je vis dans la liberté que Christ offre. Gloire à Dieu !",
    color: 'pink',
    font: 'Shadows Into Light',
    author: "André M.",
    location: "Abidjan, Côte d'Ivoire",
    date: "5 oct.",
    category: "Délivrance"
  },
  {
    id: 11,
    type: 'video',
    title: "Miracle de famille restaurée",
    thumbnail: "https://images.unsplash.com/photo-1577897113176-6888367369bf?w=400",
    fullText: "Témoignage vidéo de famille restaurée",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1:55",
    color: 'yellow',
    author: "Famille Nsiona",
    location: "Yaoundé, Cameroun",
    date: "8 oct.",
    category: "Famille"
  },
  {
    id: 12,
    title: "Guérison émotionnelle",
    text: "La dépression me consumait...",
    fullText: "Après la perte de mon enfant, je suis tombé dans une dépression profonde. Rien ne semblait avoir de sens. À l'église, j'ai rencontré des personnes qui ont prié avec moi et m'ont accompagné. Progressivement, Dieu a guéri mon cœur brisé. Aujourd'hui, je peux témoigner de Sa fidélité même dans la douleur.",
    color: 'green',
    font: 'Inter',
    author: "Rachel T.",
    location: "Lomé, Togo",
    date: "2 oct.",
    category: "Guérison"
  },
  {
    id: 13,
    title: "Nouveau départ",
    text: "J'étais sans emploi depuis 2 ans...",
    fullText: "Pendant deux ans, j'ai cherché un emploi sans succès. J'étais découragé et ma famille souffrait. À l'église, on m'a encouragé à ne pas abandonner et à faire confiance à Dieu. Trois semaines après, j'ai reçu une offre pour un poste encore meilleur que ce que j'espérais. Dieu pourvoit toujours au bon moment !",
    color: 'yellow',
    font: 'Merriweather',
    author: "François K.",
    location: "Dakar, Sénégal",
    date: "30 sept.",
    category: "Provision"
  },
  {
    id: 14,
    title: "Délivrance des addictions",
    text: "L'alcool détruisait ma vie...",
    fullText: "Pendant 10 ans, l'alcool a contrôlé ma vie. J'ai perdu mon travail, ma famille me tournait le dos. Lors d'une croisade d'évangélisation, j'ai donné ma vie à Christ. Depuis ce jour, je n'ai plus touché une goutte d'alcool. Jésus m'a libéré et restauré complètement. Il est fidèle !",
    color: 'pink',
    font: 'Indie Flower',
    author: "Michel S.",
    location: "Pointe-Noire, Congo",
    date: "27 sept.",
    category: "Délivrance"
  }
];

const CATEGORIES = [
  "Tous",
  "Vidéos",
  "Guérison",
  "Provision",
  "Famille",
  "Délivrance",
  "Éducation",
  "Protection"
];

const COLOR_MAP = {
  yellow: '#FFF6D9',
  pink: '#FFE5E5',
  green: '#E4FFEB'
};

const ITEMS_PER_PAGE = 9;

// ================================================
// REACTIVE STATE using Proxy
// ================================================
const state = {
  userName: localStorage.getItem('bunda21_user') || null,
  selectedCategory: 'Tous',
  currentPage: 1,
  selectedTestimonyIndex: null,
  amenCounts: {}, // Track amen counts per testimony
  amenedTestimonies: new Set() // Track which testimonies user has "amened"
};

const stateHandlers = {
  set(target, property, value) {
    target[property] = value;
    // Re-render on state change
    if (property === 'selectedCategory' || property === 'currentPage') {
      renderTestimoniesGrid();
      renderPagination();
    }
    if (property === 'userName') {
      renderAuthButton();
    }
    return true;
  }
};

const reactiveState = new Proxy(state, stateHandlers);

// ================================================
// UTILITY FUNCTIONS
// ================================================

// Get Amens for testimony (seed-based for consistency)
function getAmensForTestimony(id) {
  if (reactiveState.amenCounts[id]) {
    return reactiveState.amenCounts[id];
  }
  const seed = id * 7 + 23;
  const count = 10 + Math.floor((Math.sin(seed) * 0.5 + 0.5) * 50);
  reactiveState.amenCounts[id] = count;
  return count;
}

// Filter testimonies by category
function getFilteredTestimonies() {
  if (reactiveState.selectedCategory === 'Tous') {
    return TESTIMONIES;
  } else if (reactiveState.selectedCategory === 'Vidéos') {
    return TESTIMONIES.filter(t => t.type === 'video');
  } else {
    return TESTIMONIES.filter(t => t.category === reactiveState.selectedCategory);
  }
}

// Get testimonies for current page
function getCurrentPageTestimonies() {
  const filtered = getFilteredTestimonies();
  const startIndex = (reactiveState.currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return filtered.slice(startIndex, endIndex);
}

// Calculate total pages
function getTotalPages() {
  const filtered = getFilteredTestimonies();
  return Math.ceil(filtered.length / ITEMS_PER_PAGE);
}

// Animate counter
function animateCounter(element, target, duration = 2000) {
  const increment = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// ================================================
// CONFETTI (using canvas-confetti library)
// ================================================
function triggerConfetti(x, y) {
  confetti({
    particleCount: 30,
    spread: 60,
    origin: { x, y },
    colors: ['#950000', '#F5D693', '#FFD6DC'],
    ticks: 40,
    gravity: 1.2,
    scalar: 0.8
  });
}

// ================================================
// RENDER FUNCTIONS
// ================================================

// Render Auth Button
function renderAuthButton() {
  const container = document.getElementById('authContainer');
  
  if (reactiveState.userName) {
    const initial = reactiveState.userName.charAt(0).toUpperCase();
    container.innerHTML = `
      <button class="auth-btn" id="userMenuBtn">
        <div class="user-avatar">
          <span>${initial}</span>
        </div>
        <span>${reactiveState.userName}</span>
      </button>
    `;
    
    // Simple dropdown functionality (click to logout)
    document.getElementById('userMenuBtn').addEventListener('click', () => {
      if (confirm('Se déconnecter ?')) {
        reactiveState.userName = null;
        localStorage.removeItem('bunda21_user');
      }
    });
  } else {
    container.innerHTML = `
      <button class="auth-btn" id="signInBtn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
        Sign In
      </button>
    `;
    
    document.getElementById('signInBtn').addEventListener('click', () => {
      openAuthDialog();
    });
  }
}

// Render Hero Carousel Columns
function renderCarouselColumns() {
  // Sort by amens
  const sortedTestimonies = [...TESTIMONIES]
    .map(t => ({ ...t, amens: getAmensForTestimony(t.id) }))
    .sort((a, b) => b.amens - a.amens);
  
  // Top 12
  const topTestimonies = sortedTestimonies.slice(0, 12);
  
  // Split into 2 columns
  const column1 = topTestimonies.slice(0, 6);
  const column2 = topTestimonies.slice(6, 12);
  
  // Triple for infinite loop
  const infiniteColumn1 = [...column1, ...column1, ...column1];
  const infiniteColumn2 = [...column2, ...column2, ...column2];
  
  // Render Column 1
  const col1Container = document.getElementById('carouselCol1');
  if (col1Container) {
    const scrollContainer1 = document.createElement('div');
    scrollContainer1.className = 'carousel-scroll-container';
    scrollContainer1.innerHTML = infiniteColumn1.map(t => renderCarouselCard(t)).join('');
    col1Container.appendChild(scrollContainer1);
  }
  
  // Render Column 2
  const col2Container = document.getElementById('carouselCol2');
  if (col2Container) {
    const scrollContainer2 = document.createElement('div');
    scrollContainer2.className = 'carousel-scroll-container';
    scrollContainer2.innerHTML = infiniteColumn2.map(t => renderCarouselCard(t)).join('');
    col2Container.appendChild(scrollContainer2);
  }
}

// Render individual carousel card
function renderCarouselCard(testimony) {
  const rotation = (Math.random() - 0.5) * 6;
  const bgColor = COLOR_MAP[testimony.color];
  
  if (testimony.type === 'video') {
    return `
      <div class="testimony-card video-card" style="background: ${bgColor}; transform: rotate(${rotation}deg);" data-id="${testimony.id}">
        <div class="testimony-pin">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="17" x2="12" y2="3"></line>
            <path d="m6 11 6 6 6-6"></path>
            <path d="M19 21H5"></path>
          </svg>
        </div>
        <div class="video-thumbnail-wrapper">
          <img src="${testimony.thumbnail}" alt="${testimony.title}" class="video-thumbnail">
          <div class="video-play-overlay">
            <div class="video-play-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
          <div class="video-duration">${testimony.duration}</div>
        </div>
        <div class="testimony-card-content">
          <h3 class="testimony-card-title">${testimony.title}</h3>
          <div class="testimony-card-meta">
            <span class="testimony-card-author">${testimony.author}</span>
            <span>${testimony.date}</span>
          </div>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="testimony-card" style="background: ${bgColor}; transform: rotate(${rotation}deg);" data-id="${testimony.id}">
        <div class="testimony-pin">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="17" x2="12" y2="3"></line>
            <path d="m6 11 6 6 6-6"></path>
            <path d="M19 21H5"></path>
          </svg>
        </div>
        <div class="testimony-card-content">
          <h3 class="testimony-card-title">${testimony.title}</h3>
          <p class="testimony-card-text">${testimony.text || testimony.fullText}</p>
          <div class="testimony-card-meta">
            <span class="testimony-card-author">${testimony.author}</span>
            <span>${testimony.date}</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Render Category Filters
function renderCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  container.innerHTML = CATEGORIES.map(category => `
    <button 
      class="category-filter ${category === reactiveState.selectedCategory ? 'active' : ''}" 
      data-category="${category}"
    >
      ${category}
    </button>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('.category-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      reactiveState.selectedCategory = btn.dataset.category;
      reactiveState.currentPage = 1;
      renderCategoryFilters();
    });
  });
}

// Render Testimonies Grid
function renderTestimoniesGrid() {
  const container = document.getElementById('testimoniesGrid');
  const testimonies = getCurrentPageTestimonies();
  const totalPages = getTotalPages();
  const isLastPage = reactiveState.currentPage === totalPages;
  
  container.innerHTML = '';
  
  testimonies.forEach((testimony, index) => {
    const card = createTestimonyCard(testimony, index);
    container.appendChild(card);
  });
  
  // Add "Add Testimony" card on last page
  if (isLastPage) {
    const addCard = createAddTestimonyCard();
    container.appendChild(addCard);
  }
}

// Create Testimony Card Element
function createTestimonyCard(testimony, index) {
  const div = document.createElement('div');
  const rotation = (Math.random() - 0.5) * 6;
  const bgColor = COLOR_MAP[testimony.color];
  const amenCount = getAmensForTestimony(testimony.id);
  const hasAmened = reactiveState.amenedTestimonies.has(testimony.id);
  
  div.className = `testimony-card stagger-${(index % 9) + 1}`;
  div.style.background = bgColor;
  div.style.transform = `rotate(${rotation}deg)`;
  div.dataset.id = testimony.id;
  
  if (testimony.type === 'video') {
    div.innerHTML = `
      <div class="testimony-pin">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="17" x2="12" y2="3"></line>
          <path d="m6 11 6 6 6-6"></path>
          <path d="M19 21H5"></path>
        </svg>
      </div>
      <div class="video-thumbnail-wrapper">
        <img src="${testimony.thumbnail}" alt="${testimony.title}" class="video-thumbnail">
        <div class="video-play-overlay">
          <div class="video-play-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
        <div class="video-duration">${testimony.duration}</div>
      </div>
      <div class="testimony-card-content">
        <h3 class="testimony-card-title">${testimony.title}</h3>
        <div class="testimony-card-meta">
          <span class="testimony-card-author">${testimony.author}</span>
          <span>${testimony.date}</span>
        </div>
      </div>
      <div class="testimony-card-actions">
        <button class="amen-button ${hasAmened ? 'disabled' : ''}" data-id="${testimony.id}" ${hasAmened ? 'disabled' : ''}>
          <span>🙌</span>
          Amen (<span class="amen-count">${amenCount}</span>)
        </button>
        <div class="share-buttons">
          <button class="share-btn" data-platform="twitter" data-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </button>
          <button class="share-btn" data-platform="whatsapp" data-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
          <button class="share-btn" data-platform="copy" data-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
  } else {
    div.innerHTML = `
      <div class="testimony-pin">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="17" x2="12" y2="3"></line>
          <path d="m6 11 6 6 6-6"></path>
          <path d="M19 21H5"></path>
        </svg>
      </div>
      <div class="testimony-card-content">
        <h3 class="testimony-card-title">${testimony.title}</h3>
        <p class="testimony-card-text">${testimony.text || testimony.fullText}</p>
        <p class="testimony-card-author">- ${testimony.author}</p>
        <div class="testimony-card-meta">
          <span class="testimony-card-location">${testimony.location}</span>
          <span>${testimony.date}</span>
        </div>
      </div>
      <div class="testimony-card-actions">
        <button class="amen-button ${hasAmened ? 'disabled' : ''}" data-id="${testimony.id}" ${hasAmened ? 'disabled' : ''}>
          <span>🙌</span>
          Amen (<span class="amen-count">${amenCount}</span>)
        </button>
        <div class="share-buttons">
          <button class="share-btn" data-platform="twitter" data-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </button>
          <button class="share-btn" data-platform="whatsapp" data-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
          <button class="share-btn" data-platform="copy" data-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
  }
  
  // Add click handler to open modal
  div.addEventListener('click', (e) => {
    // Don't open modal if clicking on action buttons
    if (e.target.closest('.testimony-card-actions')) {
      return;
    }
    openTestimonyModal(testimony);
  });
  
  // Add amen button handler
  const amenBtn = div.querySelector('.amen-button');
  if (amenBtn) {
    amenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleAmen(testimony.id, e);
    });
  }
  
  // Add share button handlers
  div.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleShare(testimony, btn.dataset.platform);
    });
  });
  
  return div;
}

// Create Add Testimony Card
function createAddTestimonyCard() {
  const div = document.createElement('div');
  div.className = 'add-card stagger-9';
  div.innerHTML = `
    <div class="add-card-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>
    <p class="add-card-text">Ajouter mon témoignage</p>
  `;
  
  div.addEventListener('click', openTestimonyForm);
  
  return div;
}

// Render Pagination
function renderPagination() {
  const container = document.getElementById('pagination');
  const totalPages = getTotalPages();
  const currentPage = reactiveState.currentPage;
  
  container.innerHTML = `
    <button class="pagination-btn" id="prevPageBtn" ${currentPage === 1 ? 'disabled' : ''}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      <span>Précédent</span>
    </button>
    
    <div class="pagination-dots">
      ${Array.from({ length: totalPages }, (_, i) => `
        <button 
          class="pagination-dot ${i + 1 === currentPage ? 'active' : ''}" 
          data-page="${i + 1}"
          aria-label="Page ${i + 1}"
        ></button>
      `).join('')}
    </div>
    
    <button class="pagination-btn" id="nextPageBtn" ${currentPage === totalPages ? 'disabled' : ''}>
      <span>Suivant</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;
  
  // Add event listeners
  document.getElementById('prevPageBtn')?.addEventListener('click', () => {
    if (currentPage > 1) {
      reactiveState.currentPage--;
      scrollToWall();
    }
  });
  
  document.getElementById('nextPageBtn')?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      reactiveState.currentPage++;
      scrollToWall();
    }
  });
  
  container.querySelectorAll('.pagination-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      reactiveState.currentPage = parseInt(dot.dataset.page);
      scrollToWall();
    });
  });
}

// Render Footer Badges
function renderFooterBadges() {
  const container = document.getElementById('footerBadges');
  const totalTestimonies = TESTIMONIES.length;
  const totalAmens = TESTIMONIES.reduce((acc, t) => acc + getAmensForTestimony(t.id), 0);
  const totalShares = Math.floor(totalAmens * 0.35);
  
  container.innerHTML = `
    <div class="footer-badge">🏆 ${totalTestimonies} témoignages partagés</div>
    <div class="footer-badge">✨ ${totalAmens.toLocaleString()} Amens reçus</div>
    <div class="footer-badge">💝 ${totalShares} partages</div>
  `;
}

// ================================================
// EVENT HANDLERS
// ================================================

function handleAmen(testimonyId, event) {
  if (reactiveState.amenedTestimonies.has(testimonyId)) {
    return;
  }
  
  // Increment amen count
  reactiveState.amenCounts[testimonyId]++;
  reactiveState.amenedTestimonies.add(testimonyId);
  
  // Update UI
  const amenCountSpan = event.target.closest('.amen-button').querySelector('.amen-count');
  if (amenCountSpan) {
    amenCountSpan.textContent = reactiveState.amenCounts[testimonyId];
  }
  
  // Disable button
  const btn = event.target.closest('.amen-button');
  btn.disabled = true;
  btn.classList.add('disabled');
  
  // Trigger confetti
  const rect = btn.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  triggerConfetti(x, y);
}

function handleShare(testimony, platform) {
  const text = `${testimony.title} - Mur de Témoignages Bunda21`;
  const url = window.location.href;
  
  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
      break;
    case 'copy':
      navigator.clipboard.writeText(url);
      alert('Lien copié !');
      break;
  }
}

function scrollToWall() {
  const wallSection = document.getElementById('wall');
  if (wallSection) {
    wallSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// ================================================
// MODAL FUNCTIONS
// ================================================

function openAuthDialog() {
  const dialog = document.getElementById('authDialog');
  dialog.showModal();
}

function closeAuthDialog() {
  const dialog = document.getElementById('authDialog');
  dialog.close();
}

function openTestimonyForm() {
  if (!reactiveState.userName) {
    alert('Veuillez vous connecter pour partager un témoignage.');
    openAuthDialog();
    return;
  }
  
  const dialog = document.getElementById('testimonyFormDialog');
  dialog.showModal();
}

function closeTestimonyForm() {
  const dialog = document.getElementById('testimonyFormDialog');
  dialog.close();
  // Reset form
  document.getElementById('testimonyForm').reset();
}

function openTestimonyModal(testimony) {
  if (testimony.type === 'video') {
    openVideoModal(testimony);
    return;
  }
  
  const dialog = document.getElementById('testimonyModal');
  const filtered = getFilteredTestimonies();
  const currentIndex = filtered.findIndex(t => t.id === testimony.id);
  
  // Populate modal
  document.getElementById('testimonyModalTitle').textContent = testimony.title;
  document.getElementById('testimonyAuthor').textContent = testimony.author;
  document.getElementById('testimonyLocation').textContent = testimony.location;
  document.getElementById('testimonyDate').textContent = testimony.date;
  document.getElementById('testimonyContent').textContent = testimony.fullText;
  
  // Avatar initial
  const initial = testimony.author.charAt(0).toUpperCase();
  document.getElementById('testimonyAvatarInitial').textContent = initial;
  
  // Amen button
  const amenCount = getAmensForTestimony(testimony.id);
  const hasAmened = reactiveState.amenedTestimonies.has(testimony.id);
  const amenBtn = document.getElementById('modalAmenBtn');
  document.getElementById('modalAmenCount').textContent = amenCount;
  amenBtn.disabled = hasAmened;
  if (hasAmened) {
    amenBtn.classList.add('disabled');
  } else {
    amenBtn.classList.remove('disabled');
  }
  
  // Navigation buttons
  document.getElementById('testimonyPrevBtn').disabled = currentIndex === 0;
  document.getElementById('testimonyNextBtn').disabled = currentIndex === filtered.length - 1;
  
  dialog.showModal();
  
  // Store current testimony for navigation
  dialog.dataset.currentIndex = currentIndex;
}

function closeTestimonyModal() {
  const dialog = document.getElementById('testimonyModal');
  dialog.close();
}

function navigateTestimony(direction) {
  const dialog = document.getElementById('testimonyModal');
  const filtered = getFilteredTestimonies();
  let currentIndex = parseInt(dialog.dataset.currentIndex);
  
  currentIndex += direction;
  
  if (currentIndex >= 0 && currentIndex < filtered.length) {
    const testimony = filtered[currentIndex];
    closeTestimonyModal();
    setTimeout(() => openTestimonyModal(testimony), 100);
  }
}

function openVideoModal(testimony) {
  const dialog = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('videoPlayer');
  
  document.getElementById('videoModalTitle').textContent = testimony.title;
  document.getElementById('videoAuthor').textContent = testimony.author;
  document.getElementById('videoLocation').textContent = testimony.location;
  
  videoPlayer.src = testimony.videoUrl;
  
  dialog.showModal();
  videoPlayer.play();
}

function closeVideoModal() {
  const dialog = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('videoPlayer');
  
  videoPlayer.pause();
  videoPlayer.src = '';
  
  dialog.close();
}

// ================================================
// FORM SUBMISSION HANDLERS
// ================================================

function handleAuthSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('authNameInput');
  const name = nameInput.value.trim();
  
  if (name) {
    reactiveState.userName = name;
    localStorage.setItem('bunda21_user', name);
    closeAuthDialog();
    nameInput.value = '';
  }
}

function handleTestimonySubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('testimonyTitle').value.trim();
  const category = document.getElementById('testimonyCategory').value;
  const text = document.getElementById('testimonyText').value.trim();
  
  if (title && category && text) {
    // Create new testimony
    const newTestimony = {
      id: Date.now(),
      title,
      text: text.substring(0, 100) + '...',
      fullText: text,
      color: ['yellow', 'pink', 'green'][Math.floor(Math.random() * 3)],
      font: 'Inter',
      author: reactiveState.userName,
      location: 'Location',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      category
    };
    
    // Add to beginning of array
    TESTIMONIES.unshift(newTestimony);
    
    // Close modal and reset form
    closeTestimonyForm();
    
    // Reset to first page and show all categories
    reactiveState.selectedCategory = 'Tous';
    reactiveState.currentPage = 1;
    
    // Re-render
    renderTestimoniesGrid();
    renderPagination();
    renderFooterBadges();
    
    // Update counter
    const counterEl = document.getElementById('testimoniesCounter');
    animateCounter(counterEl, TESTIMONIES.length);
    
    alert('Témoignage publié avec succès !');
  }
}

// ================================================
// INITIALIZATION
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  // Render initial UI
  renderAuthButton();
  renderCarouselColumns();
  renderCategoryFilters();
  renderTestimoniesGrid();
  renderPagination();
  renderFooterBadges();
  
  // Animate counter
  const counterEl = document.getElementById('testimoniesCounter');
  animateCounter(counterEl, TESTIMONIES.length);
  
  // Setup event listeners
  
  // Scroll indicator
  document.getElementById('scrollIndicator').addEventListener('click', scrollToWall);
  
  // CTA buttons
  document.getElementById('heroCtaBtn').addEventListener('click', openTestimonyForm);
  document.getElementById('addTestimonyBtn').addEventListener('click', openTestimonyForm);
  document.getElementById('footerCtaBtn').addEventListener('click', openTestimonyForm);
  
  // Auth dialog
  document.getElementById('authDialogClose').addEventListener('click', closeAuthDialog);
  document.getElementById('authForm').addEventListener('submit', handleAuthSubmit);
  
  // Testimony form dialog
  document.getElementById('testimonyFormClose').addEventListener('click', closeTestimonyForm);
  document.getElementById('testimonyForm').addEventListener('submit', handleTestimonySubmit);
  
  // Testimony modal
  document.getElementById('testimonyModalClose').addEventListener('click', closeTestimonyModal);
  document.getElementById('testimonyPrevBtn').addEventListener('click', () => navigateTestimony(-1));
  document.getElementById('testimonyNextBtn').addEventListener('click', () => navigateTestimony(1));
  
  // Modal amen button
  document.getElementById('modalAmenBtn').addEventListener('click', (e) => {
    const dialog = document.getElementById('testimonyModal');
    const filtered = getFilteredTestimonies();
    const currentIndex = parseInt(dialog.dataset.currentIndex);
    const testimony = filtered[currentIndex];
    handleAmen(testimony.id, e);
  });
  
  // Modal share buttons
  document.querySelectorAll('#testimonyModal .share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dialog = document.getElementById('testimonyModal');
      const filtered = getFilteredTestimonies();
      const currentIndex = parseInt(dialog.dataset.currentIndex);
      const testimony = filtered[currentIndex];
      handleShare(testimony, btn.dataset.platform);
    });
  });
  
  // Video modal
  document.getElementById('videoModalClose').addEventListener('click', closeVideoModal);
  
  // Close modals on backdrop click
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });
  });
  
  // ESC key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuthDialog();
      closeTestimonyForm();
      closeTestimonyModal();
      closeVideoModal();
    }
  });
});