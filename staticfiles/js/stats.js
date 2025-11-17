// ================================================
// STATS - STATISTIQUES DYNAMIQUES
// ================================================

/**
 * Calcule le total des "Amen" reçus sur tous les témoignages
 * @returns {number} - Total des Amens
 */
function calculateTotalAmens() {
  if (!window.CONFIG || !window.CONFIG.TESTIMONIES) {
    return 0;
  }
  
  return window.CONFIG.TESTIMONIES.reduce((sum, testimony) => {
    let count = 0;

    if (window.UTILS && typeof window.UTILS.getAmensForTestimony === 'function') {
      count = window.UTILS.getAmensForTestimony(testimony.id);
    } else if (window.STATE && window.STATE.amenCounts && typeof window.STATE.amenCounts[testimony.id] === 'number') {
      count = window.STATE.amenCounts[testimony.id];
    } else if (typeof testimony.amen_count === 'number') {
      count = testimony.amen_count;
    }

    return sum + count;
  }, 0);
}

/**
 * Calcule le total des partages (si tracking implémenté)
 * @returns {number} - Total des partages
 */
function calculateTotalShares() {
  // Pour le moment, on retourne une valeur stockée dans localStorage
  // Cette fonction peut être étendue pour tracker chaque partage individuel
  return parseInt(localStorage.getItem('bunda21_total_shares')) || 0;
}

/**
 * Incrémente le compteur de partages global
 */
function incrementSharesCount() {
  const currentShares = calculateTotalShares();
  localStorage.setItem('bunda21_total_shares', currentShares + 1);
  updateDynamicStats();
}

/**
 * Met à jour toutes les statistiques dynamiques de l'application
 */
function updateDynamicStats() {
  const totalTestimonies = window.CONFIG ? window.CONFIG.TESTIMONIES.length : 0;
  const totalAmens = calculateTotalAmens();
  const totalShares = calculateTotalShares();
  
  // Mettre à jour le compteur Hero
  const heroCounter = document.getElementById('testimoniesCount');
  if (heroCounter && heroCounter.textContent !== totalTestimonies.toString()) {
    // Animation du compteur
    if (window.UTILS && window.UTILS.animateCounter) {
      window.UTILS.animateCounter(heroCounter, totalTestimonies);
    } else {
      heroCounter.textContent = totalTestimonies;
    }
  }
  
  // Mettre à jour les badges du footer
  const footerTestimonies = document.getElementById('footerTestimoniesCount');
  const footerAmens = document.getElementById('footerAmensCount');
  const footerShares = document.getElementById('footerSharesCount');
  
  if (footerTestimonies) footerTestimonies.textContent = totalTestimonies;
  if (footerAmens) footerAmens.textContent = totalAmens.toLocaleString('fr-FR');
  if (footerShares) footerShares.textContent = totalShares;
  
  // Log des stats dans la console (pour debugging)
  console.log('📊 Statistiques dynamiques:');
  console.log(`   • ${totalTestimonies} témoignages partagés`);
  console.log(`   • ${totalAmens} Amens reçus`);
  console.log(`   • ${totalShares} partages effectués`);
  
  // Dispatch un événement personnalisé pour que d'autres composants puissent réagir
  window.dispatchEvent(new CustomEvent('statsUpdated', {
    detail: {
      testimonies: totalTestimonies,
      amens: totalAmens,
      shares: totalShares
    }
  }));
}

/**
 * Obtient les statistiques actuelles
 * @returns {Object} - Objet avec les statistiques
 */
function getStats() {
  return {
    testimonies: window.CONFIG ? window.CONFIG.TESTIMONIES.length : 0,
    amens: calculateTotalAmens(),
    shares: calculateTotalShares()
  };
}

/**
 * Initialise les statistiques au chargement
 */
function initializeStats() {
  console.log('📊 Initializing dynamic stats...');
  
  // Mettre à jour immédiatement
  updateDynamicStats();
  
  // Écouter les événements de "Amen" pour mettre à jour les stats
  window.addEventListener('amenClicked', () => {
    setTimeout(updateDynamicStats, 100);
  });
  
  // Écouter les événements de partage pour mettre à jour les stats
  window.addEventListener('testimonyShared', () => {
    incrementSharesCount();
  });
  
  // Écouter les événements de nouveau témoignage
  window.addEventListener('testimonyAdded', () => {
    setTimeout(updateDynamicStats, 100);
  });
  
  console.log('✅ Dynamic stats initialized');
}

// Export des fonctions
window.STATS = {
  calculateTotalAmens,
  calculateTotalShares,
  incrementSharesCount,
  updateDynamicStats,
  getStats,
  initializeStats
};

// Auto-initialisation si le DOM est déjà chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStats);
} else {
  // Le DOM est déjà chargé, on attend un peu que les autres scripts se chargent
  setTimeout(initializeStats, 100);
}
