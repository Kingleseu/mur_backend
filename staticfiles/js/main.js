// ================================================
// MAIN - INITIALIZATION
// ================================================

function renderAuthButton() {
  const container = document.getElementById('authContainer');
  if (!container) return;

  if (window.STATE.userName) {
    const initial = window.STATE.userName.charAt(0).toUpperCase();
    const email =
      window.STATE.userEmail ||
      localStorage.getItem('bunda21_email') ||
      'Email non renseigné';

    container.innerHTML = `
      <div class="auth-menu">
        <button class="auth-btn" id="userMenuBtn" aria-haspopup="true" aria-expanded="false">
          <div class="user-avatar">
            <span>${initial}</span>
          </div>
          <span class="auth-name">${window.STATE.userName}</span>
        </button>

        <div class="auth-dropdown" id="userDropdown">
          <div class="auth-dropdown-header">
            <div class="auth-dropdown-name">${window.STATE.userName}</div>
            <div class="auth-dropdown-email">${email}</div>
            <div class="auth-dropdown-location" id="authLocation">
              Localisation en cours...
            </div>
          </div>
          <button class="logout-btn" id="logoutBtn">Se déconnecter</button>
        </div>
      </div>
    `;

    const menu = container.querySelector('.auth-menu');
    const btn = container.querySelector('#userMenuBtn');
    const logoutBtn = container.querySelector('#logoutBtn');

    const dropdown = container.querySelector('#userDropdown');
    if (dropdown && !dropdown.querySelector('#myTestimoniesBtn')) {
      const myBtn = document.createElement('button');
      myBtn.className = 'logout-btn';
      myBtn.id = 'myTestimoniesBtn';
      myBtn.textContent = 'Mes témoignages';
      dropdown.insertBefore(myBtn, logoutBtn);
    }
    const myTestimoniesBtn = container.querySelector('#myTestimoniesBtn');

    // Ouvrir / fermer le dropdown au clic
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Fermer au clic à l'extérieur
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Déconnexion
    logoutBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      if (logoutBtn.disabled) return;
      const initial = logoutBtn.textContent.trim();
      logoutBtn.disabled = true;
      logoutBtn.textContent = 'Déconnexion...';
      try {
        if (window.AUTH_OTP && typeof window.AUTH_OTP.signOut === 'function') {
          await window.AUTH_OTP.signOut();
        }
      } catch (err) {
        if (window.showToast) {
          window.showToast(err.message || 'Impossible de vous déconnecter');
        }
      } finally {
        logoutBtn.disabled = false;
        logoutBtn.textContent = initial;
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Localisation auto (simple)
    const locEl = document.getElementById('authLocation');
    if (navigator.geolocation && locEl) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Reverse geocoding avec OpenStreetMap
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`)
          .then(res => res.json())
          .then(data => {
            const city = data.city || data.locality || data.principalSubdivision || "Ville inconnue";
            let country = data.countryName || "";

            // Format spécial Congo
            if (country.toLowerCase().includes("république","démocratique","congo")) {
              country = "RDC";
            }

            const label = `${city}, ${country}`;

            // Affichage dans le menu
            locEl.textContent = label;

            // 🔐 Stockage dans le state + localStorage
            window.STATE.userLocation = label;
            localStorage.setItem('bunda21_user_location', label);
          })

          .catch(() => {
            locEl.textContent = "Localisation indisponible";
          });
        },
        () => {
          locEl.textContent = 'Localisation indisponible';
        }
      );
    } else if (locEl) {
      locEl.textContent = 'Localisation indisponible';
    }

  } else {
    // "Sign In"
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

    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
      signInBtn.addEventListener('click', () => {
        window.MODALS.openAuthDialog();
      });
    }
  }
}


function initializeHeroCounter() {
  const counterElement = document.getElementById('testimoniesCount');
  if (counterElement) {
    const testimonies = (
      window.UTILS && typeof window.UTILS.getApprovedTestimonies === 'function'
        ? window.UTILS.getApprovedTestimonies()
        : (window.CONFIG && Array.isArray(window.CONFIG.TESTIMONIES) ? window.CONFIG.TESTIMONIES : [])
    );
    window.UTILS.animateCounter(counterElement, testimonies.length);
  }
}

function initializeScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      window.UTILS.scrollToWall();
    });
  }
}

function initializeCTAButtons() {
  const triggerForm = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (window.MODALS && typeof window.MODALS.openTestimonyForm === 'function') {
      window.MODALS.openTestimonyForm();
    }
  };

  const heroCTA = document.getElementById('heroCTA');
  if (heroCTA) {
    heroCTA.addEventListener('click', triggerForm);
  }
  
  const addTestimonyBtn = document.getElementById('addTestimonyBtn');
  if (addTestimonyBtn) {
    addTestimonyBtn.addEventListener('click', triggerForm);
  }
  
  const footerCTA = document.getElementById('footerCTA');
  if (footerCTA) {
    footerCTA.addEventListener('click', triggerForm);
  }
}

// Main initialization
function init() {
  console.log('🚀 Initializing Bunda21 Testimonies Wall...');
  
  // Render components
  renderAuthButton();
  initializeHeroCounter();
  window.CAROUSEL.renderCarouselColumns();
  window.TESTIMONIES_GRID.renderCategoryFilters();
  window.TESTIMONIES_GRID.renderTestimoniesGrid();
  window.TESTIMONIES_GRID.renderPagination();
  
  // Initialize modals
  window.MODALS.initializeModals();
  
  // Initialize form
  window.FORM.initializeTestimonyForm();
  
  // Initialize UI elements
  initializeScrollIndicator();
  initializeCTAButtons();
  
  console.log('✅ Application initialized successfully!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export functions
window.MAIN = {
  renderAuthButton,
  initializeHeroCounter,
  initializeScrollIndicator,
  initializeCTAButtons,
  init
};
