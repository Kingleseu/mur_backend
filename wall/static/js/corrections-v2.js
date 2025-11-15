// ================================================
// CORRECTIONS FINALES - COHÉRENCE REACT
// ================================================

(function() {
  'use strict';

  // ================================================
  // 1. HELPER: Récupération de dialog avec plusieurs IDs possibles
  // ================================================
  function getDialog(...ids) {
    for (const id of ids) {
      const dlg = document.getElementById(id);
      if (dlg) return dlg;
    }
    return null;
  }

  // ================================================
  // 2. HELPER: Récupération d'élément avec plusieurs IDs possibles
  // ================================================
  function getElement(...ids) {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  }

  // ================================================
  // 3. CORRECTION: Boutons CTA → Ouvrir Formulaire (PAS scroll)
  // ================================================
  function fixCTAButtons() {
    // Tous les boutons qui doivent ouvrir le formulaire
    const ctaIds = ['heroCTA', 'heroCtaBtn', 'addTestimonyBtn', 'footerCTA', 'footerCtaBtn'];
    
    ctaIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        // Supprimer tous les anciens listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Ajouter le bon listener
        newBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.MODALS && window.MODALS.openTestimonyForm) {
            window.MODALS.openTestimonyForm();
          }
        });
      }
    });
    
    console.log('✅ Boutons CTA corrigés : ouverture formulaire uniquement');
  }

  // ================================================
  // 4. CORRECTION: Scroll Indicator → scrollToWall uniquement
  // ================================================
  function fixScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      const newIndicator = scrollIndicator.cloneNode(true);
      scrollIndicator.parentNode.replaceChild(newIndicator, scrollIndicator);
      
      newIndicator.addEventListener('click', () => {
        const wallSection = document.getElementById('wall');
        if (wallSection) {
          wallSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // ================================================
  // 5. CORRECTION: Fermeture des modales (avec backdrop)
  // ================================================
  function fixModalClosing() {
    const modals = [
      { dialog: getDialog('authDialog'), closeIds: ['authDialogClose'] },
      { dialog: getDialog('testimonyDialog', 'testimonyModal'), closeIds: ['testimonyModalClose'] },
      { dialog: getDialog('videoDialog', 'videoModal'), closeIds: ['videoModalClose'] },
      { dialog: getDialog('testimonyFormDialog'), closeIds: ['testimonyFormClose'] }
    ];

    modals.forEach(({ dialog, closeIds }) => {
      if (!dialog) return;

      // Bouton close (X)
      closeIds.forEach(id => {
        const closeBtn = dialog.querySelector(`#${id}, .modal-close`);
        if (closeBtn) {
          closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dialog.close();
          });
        }
      });

      // Clic sur backdrop (en dehors du contenu)
      dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        
        if (!isInDialog) {
          dialog.close();
        }
      });

      // Empêcher la fermeture si on clique dans le contenu
      const content = dialog.querySelector('.modal-content');
      if (content) {
        content.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      // Touche Esc
      dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dialog.close();
        }
      });
    });

    console.log('✅ Fermeture modales corrigée (backdrop + Esc)');
  }

  // ================================================
  // 6. CORRECTION: Compteur de témoignages unifié
  // ================================================
  function fixTestimoniesCounter() {
    const counter = getElement('testimoniesCount', 'testimoniesCounter');
    if (counter && window.CONFIG && window.CONFIG.TESTIMONIES) {
      const total = window.CONFIG.TESTIMONIES.length;
      
      // Animation du compteur
      let current = 0;
      const increment = total / 60; // 60 frames
      const timer = setInterval(() => {
        current += increment;
        if (current >= total) {
          counter.textContent = total;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 16);
    }
  }

  // ================================================
  // 7. CORRECTION: Inclinaison aléatoire des post-it
  // ================================================
  function applyRandomRotation() {
    document.querySelectorAll('.testimony-card').forEach(card => {
      const rotation = (Math.random() * 10 - 5).toFixed(1); // -5° à +5°
      card.style.setProperty('--rot', rotation + 'deg');
      card.style.transform = `rotate(${rotation}deg)`;
    });
    
    console.log('✅ Inclinaisons aléatoires appliquées (-5° à +5°)');
  }

  // ================================================
  // 8. CORRECTION: Type="button" sur tous les boutons
  // ================================================
  function fixButtonTypes() {
    document.querySelectorAll('button:not([type])').forEach(btn => {
      btn.setAttribute('type', 'button');
    });
    
    console.log('✅ Tous les boutons ont type="button"');
  }

  // ================================================
  // 9. CORRECTION: Pin en CSS pur (supprimer SVG)
  // ================================================
  function fixPins() {
    document.querySelectorAll('.testimony-pin').forEach(pin => {
      // Vider le contenu (supprimer SVG)
      pin.innerHTML = '';
      // Ajouter classe pour le CSS
      pin.classList.add('pin-pure-css');
    });
    
    console.log('✅ Pins convertis en CSS pur');
  }

  // ================================================
  // 10. CORRECTION: Harmonisation des icônes
  // ================================================
  function fixIcons() {
    document.querySelectorAll('svg').forEach(svg => {
      if (!svg.classList.contains('logo-img')) {
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('stroke-width', '1.8');
        svg.style.verticalAlign = 'middle';
      }
    });
    
    console.log('✅ Icônes harmonisées (20x20, stroke 1.8)');
  }

  // ================================================
  // 11. CORRECTION: Re-render avec rotations après chargement
  // ================================================
  function reRenderWithCorrections() {
    // Re-render carousel avec rotations
    if (window.CAROUSEL && window.CAROUSEL.renderCarouselColumns) {
      window.CAROUSEL.renderCarouselColumns();
      setTimeout(() => {
        applyRandomRotation();
        fixPins();
      }, 100);
    }

    // Re-render grille avec rotations
    if (window.TESTIMONIES_GRID && window.TESTIMONIES_GRID.renderTestimoniesGrid) {
      window.TESTIMONIES_GRID.renderTestimoniesGrid();
      setTimeout(() => {
        applyRandomRotation();
        fixPins();
      }, 100);
    }
  }

  // ================================================
  // 12. INITIALISATION DES CORRECTIONS
  // ================================================
  function initCorrections() {
    console.log('🔧 Application des corrections finales...');
    
    // Attendre que tout soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyAllCorrections);
    } else {
      applyAllCorrections();
    }
  }

  function applyAllCorrections() {
    // Corrections JS
    fixCTAButtons();
    fixScrollIndicator();
    fixModalClosing();
    fixTestimoniesCounter();
    fixButtonTypes();
    fixIcons();
    
    // Attendre un peu puis appliquer les corrections visuelles
    setTimeout(() => {
      applyRandomRotation();
      fixPins();
    }, 500);

    // Observer les changements du DOM pour réappliquer les corrections
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          setTimeout(() => {
            applyRandomRotation();
            fixPins();
            fixIcons();
          }, 50);
        }
      });
    });

    // Observer le carousel et la grille
    const carousel = document.querySelector('.carousel-columns');
    const grid = document.getElementById('testimoniesGrid');
    
    if (carousel) {
      observer.observe(carousel, { childList: true, subtree: true });
    }
    if (grid) {
      observer.observe(grid, { childList: true, subtree: true });
    }

    console.log('✅ Toutes les corrections appliquées !');
  }

  // ================================================
  // DÉMARRAGE
  // ================================================
  initCorrections();

  // Export pour debug
  window.CORRECTIONS = {
    applyRandomRotation,
    fixPins,
    fixCTAButtons,
    fixModalClosing,
    reRenderWithCorrections
  };

})();
