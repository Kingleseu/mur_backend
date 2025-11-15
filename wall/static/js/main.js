// ================================================
// MAIN - INITIALIZATION
// ================================================

function renderAuthButton() {
  const container = document.getElementById('authContainer');
  if (!container) return;
  
  if (window.STATE.userName) {
    const initial = window.STATE.userName.charAt(0).toUpperCase();
    container.innerHTML = `
      <button class="auth-btn" id="userMenuBtn">
        <div class="user-avatar">
          <span>${initial}</span>
        </div>
        <span>${window.STATE.userName}</span>
      </button>
    `;
    
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', () => {
        if (confirm('Se déconnecter ?')) {
          window.STATE.userName = null;
          localStorage.removeItem('bunda21_user');
          renderAuthButton();
        }
      });
    }
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
    window.UTILS.animateCounter(counterElement, window.CONFIG.TESTIMONIES.length);
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
  // Hero CTA
  const heroCTA = document.getElementById('heroCTA');
  if (heroCTA) {
    heroCTA.addEventListener('click', () => {
      if (window.MODALS && typeof window.MODALS.openTestimonyForm === 'function') {
        window.MODALS.openTestimonyForm();
      } else if (window.openTestimonyForm) {
        window.openTestimonyForm();
      } else {
        window.UTILS.scrollToWall();
      }
    });
  }
  
  // Add testimony button dans le header du wall
  const addTestimonyBtn = document.getElementById('addTestimonyBtn');
  if (addTestimonyBtn) {
    addTestimonyBtn.addEventListener('click', () => {
      window.MODALS.openTestimonyForm();
    });
  }
  
  // Footer CTA
  const footerCTA = document.getElementById('footerCTA');
  if (footerCTA) {
    footerCTA.addEventListener('click', () => {
      window.MODALS.openTestimonyForm();
    });
  }
}

// Main initialization
function init() {
  console.log('🚀 Initializing Bunda21 Testimonies Wall...');
  
  // Render components
  renderAuthButton();
  initializeHeroCounter();
  window.CAROUSEL.renderCarouselColumns();
  if (window.TESTIMONIES_GRID) {
    if (window.TESTIMONIES_GRID.renderCategoryFilters) window.TESTIMONIES_GRID.renderCategoryFilters();
    if (window.TESTIMONIES_GRID.renderTestimoniesGrid) window.TESTIMONIES_GRID.renderTestimoniesGrid();
    if (window.TESTIMONIES_GRID.renderPagination) window.TESTIMONIES_GRID.renderPagination();
  }
  
  // Initialize modals
  if (window.MODALS && window.MODALS.initializeModals) window.MODALS.initializeModals();
  
  // Initialize form
  if (window.FORM && window.FORM.initializeTestimonyForm) window.FORM.initializeTestimonyForm();
  
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
