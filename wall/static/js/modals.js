// ================================================
// MODALS - Auth, Testimony, Video
// ================================================

function focusDialogOnMobile(dialog) {
  if (!dialog) return;
  dialog.scrollTop = 0;
  const inner = dialog.querySelector('.modal-content');
  if (inner) inner.scrollTop = 0;
  const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dialog.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 40);
  }
}

function openAuthDialog() {
  const dialog = document.getElementById('authDialog');
  if (dialog) {
    dialog.showModal();
    focusDialogOnMobile(dialog);
  }
}

function closeAuthDialog() {
  const dialog = document.getElementById('authDialog');
  if (dialog) {
    dialog.close();
  }
}

function openTestimonyModal(testimony) {
  const dialog = document.getElementById('testimonyDialog');
  if (!dialog) return;
  
  const amenCount = window.UTILS.getAmensForTestimony(testimony.id);
  const hasAmened = window.STATE.amenedTestimonies.has(testimony.id);
  
  const initial = testimony.author.charAt(0).toUpperCase();
  
  // Définir la couleur de la bande selon le post-it
  const colorStrip = dialog.querySelector('.modal-color-strip');
  if (colorStrip && testimony.color) {
    const color = window.CONFIG.COLOR_MAP[testimony.color] || testimony.color;
    colorStrip.style.background = color;
  }
  
  dialog.querySelector('.testimony-modal-title').textContent = testimony.title;
  dialog.querySelector('.testimony-avatar').textContent = initial;
  dialog.querySelector('.testimony-author').textContent = testimony.author;
  dialog.querySelector('.testimony-location').textContent = testimony.location || 'Lieu non précisé';
  dialog.querySelector('.testimony-date').textContent = testimony.date || '';
  dialog.querySelector('.testimony-content').textContent = testimony.fullText;
  
  const gallery = dialog.querySelector('#testimonyGallery');
  if (gallery) {
    if (Array.isArray(testimony.images) && testimony.images.length) {
      gallery.classList.remove('hidden');
      gallery.innerHTML = testimony.images.map((url, idx) => `
        <div class="gallery-item">
          <img src="${url}" alt="Illustration ${idx + 1}">
        </div>
      `).join('');
    } else {
      gallery.classList.add('hidden');
      gallery.innerHTML = '';
    }
  }
  
  const amenBtn = dialog.querySelector('.amen-button');
  amenBtn.dataset.testimonyId = testimony.id;
  amenBtn.disabled = false;
  amenBtn.classList.toggle('amen-active', hasAmened);
  amenBtn.classList.remove('disabled');
  amenBtn.querySelector('.amen-count').textContent = amenCount;
  
  // Setup navigation
  const testimonies = window.UTILS.getFilteredTestimonies();
  const currentIndex = testimonies.findIndex(t => t.id === testimony.id);
  
  const prevBtn = dialog.querySelector('.modal-prev');
  const nextBtn = dialog.querySelector('.modal-next');
  
  const hasMultiple = testimonies.length > 1;
  prevBtn.disabled = !hasMultiple;
  nextBtn.disabled = !hasMultiple;
  
  prevBtn.onclick = () => {
    if (!hasMultiple) return;
    const prevIndex = (currentIndex - 1 + testimonies.length) % testimonies.length;
    const prevTestimony = testimonies[prevIndex];
    if (prevTestimony.type === 'video') {
      closeTestimonyModal();
      openVideoModal(prevTestimony);
    } else {
      openTestimonyModal(prevTestimony);
    }
  };
  
  nextBtn.onclick = () => {
    if (!hasMultiple) return;
    const nextIndex = (currentIndex + 1) % testimonies.length;
    const nextTestimony = testimonies[nextIndex];
    if (nextTestimony.type === 'video') {
      closeTestimonyModal();
      openVideoModal(nextTestimony);
    } else {
      openTestimonyModal(nextTestimony);
    }
  };
  
  dialog.showModal();
  focusDialogOnMobile(dialog);
}

function closeTestimonyModal() {
  const dialog = document.getElementById('testimonyDialog');
  if (dialog) {
    dialog.close();
  }
}

function openVideoModal(testimony) {
  const dialog = document.getElementById('videoDialog');
  if (!dialog) return;
  
  const amenCount = window.UTILS.getAmensForTestimony(testimony.id);
  const hasAmened = window.STATE.amenedTestimonies.has(testimony.id);
  
  // Définir la couleur de la bande selon le post-it
  const colorStrip = dialog.querySelector('.modal-color-strip');
  if (colorStrip && testimony.color) {
    const color = window.CONFIG.COLOR_MAP[testimony.color] || testimony.color;
    colorStrip.style.background = color;
  }
  
  dialog.querySelector('.video-modal-title').textContent = testimony.title;
  
  const videoPlayer = dialog.querySelector('#videoPlayer');
  videoPlayer.src = testimony.videoUrl;
  
  dialog.querySelector('.video-author').textContent = testimony.author;
  dialog.querySelector('.video-location').textContent = testimony.location || 'Lieu non précisé';
  dialog.querySelector('.video-date').textContent = testimony.date || '';
  
  const amenBtn = dialog.querySelector('.amen-button');
  amenBtn.dataset.testimonyId = testimony.id;
  amenBtn.disabled = false;
  amenBtn.classList.toggle('amen-active', hasAmened);
  amenBtn.classList.remove('disabled');
  amenBtn.querySelector('.amen-count').textContent = amenCount;
  
  // Setup navigation
  const testimonies = window.UTILS.getFilteredTestimonies();
  const currentIndex = testimonies.findIndex(t => t.id === testimony.id);
  
  const prevBtn = dialog.querySelector('.modal-prev');
  const nextBtn = dialog.querySelector('.modal-next');
  
  const hasMultiple = testimonies.length > 1;
  prevBtn.disabled = !hasMultiple;
  nextBtn.disabled = !hasMultiple;
  
  prevBtn.onclick = () => {
    if (!hasMultiple) return;
    const prevIndex = (currentIndex - 1 + testimonies.length) % testimonies.length;
    const prevTestimony = testimonies[prevIndex];
    videoPlayer.pause();
    closeVideoModal();
    if (prevTestimony.type === 'video') {
      openVideoModal(prevTestimony);
    } else {
      openTestimonyModal(prevTestimony);
    }
  };
  
  nextBtn.onclick = () => {
    if (!hasMultiple) return;
    const nextIndex = (currentIndex + 1) % testimonies.length;
    const nextTestimony = testimonies[nextIndex];
    videoPlayer.pause();
    closeVideoModal();
    if (nextTestimony.type === 'video') {
      openVideoModal(nextTestimony);
    } else {
      openTestimonyModal(nextTestimony);
    }
  };
  
  dialog.showModal();
  focusDialogOnMobile(dialog);
  videoPlayer.play();
}

function closeVideoModal() {
  const dialog = document.getElementById('videoDialog');
  if (dialog) {
    const videoPlayer = dialog.querySelector('#videoPlayer');
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.src = '';
    }
    dialog.close();
  }
}

function openTestimonyForm(force = false) {
  const isAuthenticated = window.STATE && window.STATE.userName;
  if (!force && !isAuthenticated) {
    if (window.AUTH_OTP && typeof window.AUTH_OTP.ensureAuthThen === 'function') {
      window.AUTH_OTP.ensureAuthThen(() => openTestimonyForm(true));
    } else {
      if (typeof window.showToast === 'function') {
        window.showToast('Connectez-vous pour partager votre témoignage');
      } else {
        alert('Connectez-vous pour partager votre témoignage');
      }
    }
    return;
  }
  const dialog = document.getElementById('testimonyFormDialog');
  if (dialog) {
    dialog.showModal();
    focusDialogOnMobile(dialog);
  }
}

function closeTestimonyForm() {
  const dialog = document.getElementById('testimonyFormDialog');
  if (dialog) {
    dialog.close();
    // Reset form state
    window.FORM.resetForm();
  }
}

// Initialize modal event listeners
function initializeModals() {
  // Auth Dialog
  const authDialog = document.getElementById('authDialog');
  if (authDialog) {
    authDialog.querySelector('.modal-close').addEventListener('click', closeAuthDialog);
    authDialog.querySelector('#authForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = authDialog.querySelector('#userName').value.trim();
      if (name) {
        window.STATE.userName = name;
        localStorage.setItem('bunda21_user', name);
        window.MAIN.renderAuthButton();
        closeAuthDialog();
      }
    });
  }
  
  // Testimony Dialog
  const testimonyDialog = document.getElementById('testimonyDialog');
  if (testimonyDialog) {
    testimonyDialog.querySelector('.modal-close').addEventListener('click', closeTestimonyModal);
    
    // Amen button
    testimonyDialog.querySelector('.amen-button').addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.testimonyId);
      window.UTILS.handleAmen(id, e);
    });
    
    // Share buttons
    testimonyDialog.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(testimonyDialog.querySelector('.amen-button').dataset.testimonyId);
        const testimony = window.CONFIG.TESTIMONIES.find(t => t.id === id);
        if (testimony) {
          window.UTILS.handleShare(testimony, btn.dataset.platform);
        }
      });
    });
  }
  
  // Video Dialog
  const videoDialog = document.getElementById('videoDialog');
  if (videoDialog) {
    videoDialog.querySelector('.modal-close').addEventListener('click', closeVideoModal);
    
    videoDialog.addEventListener('close', () => {
      const videoPlayer = videoDialog.querySelector('#videoPlayer');
      if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
      }
    });
    
    // Amen button
    videoDialog.querySelector('.amen-button').addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.testimonyId);
      window.UTILS.handleAmen(id, e);
    });
    
    // Share buttons
    videoDialog.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(videoDialog.querySelector('.amen-button').dataset.testimonyId);
        const testimony = window.CONFIG.TESTIMONIES.find(t => t.id === id);
        if (testimony) {
          window.UTILS.handleShare(testimony, btn.dataset.platform);
        }
      });
    });
  }
  
  // Testimony Form Dialog
  const formDialog = document.getElementById('testimonyFormDialog');
  if (formDialog) {
    formDialog.querySelector('.modal-close').addEventListener('click', closeTestimonyForm);
  }
}

// Export functions
window.MODALS = {
  openAuthDialog,
  closeAuthDialog,
  openTestimonyModal,
  closeTestimonyModal,
  openVideoModal,
  closeVideoModal,
  openTestimonyForm,
  closeTestimonyForm,
  initializeModals
};
