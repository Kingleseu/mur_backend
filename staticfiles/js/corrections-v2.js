// ================================================
// CORRECTIONS FINALES + AMÉLIORATIONS UX
// ================================================

(function() {
  'use strict';

  // ================================================
  // 1. NAVIGATION CLAVIER DANS LES MODALS
  // ================================================
  function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      const testimonyDialog = document.getElementById('testimonyDialog');
      const videoDialog = document.getElementById('videoDialog');
      
      const isTestimonyOpen = testimonyDialog && testimonyDialog.open;
      const isVideoOpen = videoDialog && videoDialog.open;
      
      if (!isTestimonyOpen && !isVideoOpen) return;
      
      const activeDialog = isTestimonyOpen ? testimonyDialog : videoDialog;
      
      // Navigation avec flèches
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevBtn = activeDialog.querySelector('.modal-prev');
        if (prevBtn && !prevBtn.disabled) {
          prevBtn.click();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextBtn = activeDialog.querySelector('.modal-next');
        if (nextBtn && !nextBtn.disabled) {
          nextBtn.click();
        }
      }
    });
    
    console.log('✅ Navigation clavier activée (← →)');
  }

  // ================================================
  // 2. ANIMATION FADE-IN POUR LES CARTES
  // ================================================
  /*function initCardAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px) rotate(var(--card-rotation, 0deg));
        }
        to {
          opacity: 1;
          transform: translateY(0) rotate(var(--card-rotation, 0deg));
        }
      }
      
      .testimony-card,
      .video-card {
        animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      }
      
      .testimony-card.stagger-0 { animation-delay: 0s; }
      .testimony-card.stagger-1 { animation-delay: 0.1s; }
      .testimony-card.stagger-2 { animation-delay: 0.2s; }
      .testimony-card.stagger-3 { animation-delay: 0.3s; }
      .testimony-card.stagger-4 { animation-delay: 0.4s; }
      .testimony-card.stagger-5 { animation-delay: 0.5s; }
      .testimony-card.stagger-6 { animation-delay: 0.6s; }
      .testimony-card.stagger-7 { animation-delay: 0.7s; }
      .testimony-card.stagger-8 { animation-delay: 0.8s; }
      
      .video-card.stagger-0 { animation-delay: 0s; }
      .video-card.stagger-1 { animation-delay: 0.1s; }
      .video-card.stagger-2 { animation-delay: 0.2s; }
      .video-card.stagger-3 { animation-delay: 0.3s; }
      .video-card.stagger-4 { animation-delay: 0.4s; }
      .video-card.stagger-5 { animation-delay: 0.5s; }
      .video-card.stagger-6 { animation-delay: 0.6s; }
      .video-card.stagger-7 { animation-delay: 0.7s; }
      .video-card.stagger-8 { animation-delay: 0.8s; }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Animations fade-in activées');
  }*/

  // ================================================
  // 3. INCLINAISON ALÉATOIRE DES CARTES
  // ================================================
  function applyCardRotations() {
    document.querySelectorAll('.testimony-card, .video-card').forEach((card, index) => {
      // Rotation aléatoire entre -3° et +3°
      const rotation = (Math.random() - 0.5) * 6;
      card.style.setProperty('--card-rotation', `${rotation}deg`);
      card.style.transform = `rotate(${rotation}deg)`;
    });
    
    console.log('✅ Inclinaisons aléatoires appliquées (-3° à +3°)');
  }

  // ================================================
  // 4. AJOUTER LES PINS (PUNAISES) AUX CARTES
  // ================================================
  function addPinsToCards() {
    document.querySelectorAll('.testimony-card, .video-card').forEach(card => {
      // Vérifier si le pin existe déjà
      if (card.querySelector('.card-pin')) return;
      
      // Créer le pin (punaise rouge)
      const pin = document.createElement('div');
      pin.className = 'card-pin';
      pin.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#950000" stroke="#950000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 17v5"></path>
          <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path>
        </svg>
      `;
      
      // Insérer au début de la carte
      card.insertBefore(pin, card.firstChild);
    });
    
    console.log('✅ Pins ajoutés aux cartes');
  }

  // ================================================
  // 5. STYLES CSS POUR LES PINS ET AMÉLIORATIONS
  // ================================================
  function injectEnhancementStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ===============================================
         CACHER L'ANCIEN PIN CSS (testimony-pin)
         =============================================== */
      .testimony-pin {
        display: none !important;
      }
      
      /* ===============================================
         PIN (PUNAISE) SUR LES CARTES
         =============================================== */
      .card-pin {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%) rotate(-15deg);
        width: 24px;
        height: 24px;
        z-index: 10;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        pointer-events: none;
        transition: transform 0.3s ease;
      }
      
      /* Animation au hover de la carte */
      .testimony-card:hover .card-pin,
      .video-card:hover .card-pin {
        animation: pinWiggle 0.5s ease-in-out;
      }
      
      @keyframes pinWiggle {
        0%, 100% { transform: translateX(-50%) rotate(-15deg); }
        25% { transform: translateX(-50%) rotate(-20deg); }
        75% { transform: translateX(-50%) rotate(-10deg); }
      }
      
      /* ===============================================
         AMÉLIORATIONS CARTES
         =============================================== */
      .testimony-card,
      .video-card {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
                    box-shadow 0.3s ease,
                    opacity 0.6s ease;
        will-change: transform;
      }
      
      /* Au hover, on redresse la carte */
      .testimony-card:hover,
      .video-card:hover {
        transform: translateY(-12px) scale(1.03) rotate(0deg) !important;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 
                    0 10px 10px -5px rgba(0, 0, 0, 0.1);
      }
      
      /* ===============================================
         CAROUSEL - MÊME STYLE
         =============================================== */
      .carousel-column .testimony-card,
      .carousel-column .video-card {
        opacity: 1;
      }
      
      .carousel-column .card-pin {
        top: -8px;
      }
      
      /* ===============================================
         RESPONSIVE
         =============================================== */
      @media (max-width: 640px) {
        .card-pin {
          width: 20px;
          height: 20px;
          top: -8px;
        }
      }
      
      /* ===============================================
         ACCESSIBILITÉ
         =============================================== */
      .testimony-card:focus-visible,
      .video-card:focus-visible {
        outline: 3px solid #950000;
        outline-offset: 4px;
        transform: translateY(-8px) scale(1.02) rotate(0deg) !important;
      }
      
      /* ===============================================
         CANVAS CONFETTI DANS LES MODALS
         =============================================== */
      dialog {
        position: relative;
      }
      
      .confetti-canvas-modal {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Styles CSS injectés');
  }

  // ================================================
  // 6. CORRECTIONS: Boutons CTA → Ouvrir Formulaire
  // ================================================
  function fixCTAButtons() {
    const ctaIds = ['heroCTA', 'addTestimonyBtn', 'footerCTA'];
    
    ctaIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.MODALS && window.MODALS.openTestimonyForm) {
            window.MODALS.openTestimonyForm();
          }
        });
      }
    });
    
    console.log('✅ Boutons CTA corrigés');
  }

  // ================================================
  // 7. CORRECTIONS: Scroll Indicator
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
  // 8. VÉRIFIER QUE LES CONFETTIS FONCTIONNENT
  // ================================================
  function ensureConfettiWorks() {
    // Vérifier que la fonction triggerConfetti existe
    if (typeof confetti !== 'function') {
      console.error('❌ Canvas-confetti non chargé !');
      return;
    }
    
    // Créer un canvas dans CHAQUE modal (pour contourner le top layer)
    function createCanvasInModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return null;
      
      let canvas = modal.querySelector('.confetti-canvas-modal');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.className = 'confetti-canvas-modal';
        canvas.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        `;
        // Insérer au début de la modal (avant le contenu)
        modal.insertBefore(canvas, modal.firstChild);
        console.log(`✅ Canvas confetti créé dans modal: ${modalId}`);
      }
      return canvas;
    }
    
    // Créer canvas dans toutes les modals
    const testimonyCanvas = createCanvasInModal('testimonyDialog');
    const videoCanvas = createCanvasInModal('videoDialog');
    
    // Créer aussi un canvas global pour les cartes du mur
    let globalCanvas = document.getElementById('confetti-canvas-global');
    if (!globalCanvas) {
      globalCanvas = document.createElement('canvas');
      globalCanvas.id = 'confetti-canvas-global';
      globalCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99999;
      `;
      document.body.appendChild(globalCanvas);
      console.log('✅ Canvas confetti global créé (pour cartes du mur)');
    }
    
    // Remplacer la fonction triggerConfetti
    window.UTILS.triggerConfetti = function(x, y) {
      console.log('🎊 triggerConfetti appelé', { x, y });
      
      if (typeof confetti !== 'function') return;
      
      // Déterminer quel canvas utiliser
      let targetCanvas = globalCanvas;
      
      // Si on est dans une modal, utiliser le canvas de cette modal
      const testimonyDialog = document.getElementById('testimonyDialog');
      const videoDialog = document.getElementById('videoDialog');
      
      if (testimonyDialog && testimonyDialog.open) {
        targetCanvas = testimonyCanvas;
        console.log('🎊 Utilisation canvas modal témoignage');
      } else if (videoDialog && videoDialog.open) {
        targetCanvas = videoCanvas;
        console.log('🎊 Utilisation canvas modal vidéo');
      } else {
        console.log('🎊 Utilisation canvas global');
      }
      
      if (!targetCanvas) {
        console.error('❌ Aucun canvas disponible');
        return;
      }
      
      // Créer l'instance confetti
      const myConfetti = confetti.create(targetCanvas, {
        resize: true,
        useWorker: true
      });
      
      // Déclencher les confettis
      myConfetti({
        particleCount: 50,
        spread: 70,
        origin: { x, y },
        colors: ['#950000', '#F5D693', '#FFD6DC'],
        ticks: 60,
        gravity: 1.2,
        scalar: 1.0,
        drift: 0,
        startVelocity: 25
      });
      
      console.log('✅ Confettis déclenchés sur canvas:', targetCanvas.id || targetCanvas.className);
    };
    
    console.log('✅ Confettis configurés (canvas dans modals + global)');
  }

  // ================================================
  // 9. APPLIQUER LES AMÉLIORATIONS AUX NOUVELLES CARTES
  // ================================================
  function applyEnhancementsToNewCards() {
    applyCardRotations();
    addPinsToCards();
  }

  // ================================================
  // 10. OBSERVER LES CHANGEMENTS DU DOM
  // ================================================
  function observeCardChanges() {
    const grid = document.getElementById('testimoniesGrid');
    const carousel = document.querySelector('.carousel-columns');
    
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.classList && 
                (node.classList.contains('testimony-card') || 
                 node.classList.contains('video-card'))) {
              needsUpdate = true;
            }
          });
        }
      });
      
      if (needsUpdate) {
        setTimeout(() => {
          applyEnhancementsToNewCards();
        }, 50);
      }
    });
    
    if (grid) {
      observer.observe(grid, { childList: true, subtree: true });
    }
    if (carousel) {
      observer.observe(carousel, { childList: true, subtree: true });
    }
    
    console.log('✅ Observer activé pour les nouvelles cartes');
  }

  // ================================================
  // 11. ÉCOUTER L'ÉVÉNEMENT testimoniesRendered
  // ================================================
  function listenToRenderEvents() {
    window.addEventListener('testimoniesRendered', () => {
      setTimeout(() => {
        applyEnhancementsToNewCards();
      }, 100);
    });
  }

  // ================================================
  // 12. INITIALISATION COMPLÈTE
  // ================================================
  function initAll() {
    console.log('🚀 Initialisation des améliorations UX...');
    
    // Styles CSS
    injectEnhancementStyles();
    //initCardAnimations();
    
    // Fonctionnalités
    initKeyboardNavigation();
    ensureConfettiWorks();
    
    // Corrections
    fixCTAButtons();
    fixScrollIndicator();
    
    // Observer & Events
    observeCardChanges();
    listenToRenderEvents();
    
    // Appliquer initialement
    setTimeout(() => {
      applyEnhancementsToNewCards();
    }, 500);
    
    console.log('✅ Toutes les améliorations appliquées !');
  }

  // ================================================
  // DÉMARRAGE
  // ================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Export pour debug
  window.ENHANCEMENTS = {
    applyCardRotations,
    addPinsToCards,
    applyEnhancementsToNewCards
  };

})();
