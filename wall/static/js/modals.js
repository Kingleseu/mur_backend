// ================================================
// MODALS - Auth, Testimony, Video
// ================================================

function openAuthDialog() {
  const dialog = document.getElementById('authDialog');
  if (dialog) {
    dialog.showModal();
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
  
  dialog.querySelector('.testimony-modal-title').textContent = testimony.title;
  dialog.querySelector('.testimony-avatar').textContent = initial;
  dialog.querySelector('.testimony-author').textContent = testimony.author;
  dialog.querySelector('.testimony-location').textContent = testimony.location;
  dialog.querySelector('.testimony-date').textContent = testimony.date;
  const contentBlock = dialog.querySelector('.testimony-content');
  if (contentBlock) {
    contentBlock.textContent = testimony.fullText;
    if (window.UTILS) {
      contentBlock.style.fontFamily = window.UTILS.getFontFamilyValue(testimony);
      contentBlock.style.background = window.UTILS.getPostItColor(testimony);
    }
  }
  
  const gallery = document.getElementById('testimonyGallery');
  if (gallery) {
    const imgs = Array.isArray(testimony.images) ? testimony.images : [];
    if (imgs.length) {
      const html = imgs.map((img) => {
        const url = typeof img === 'string' ? img : (img && img.url) || '';
        if (!url) return '';
        return `<img src="${url}" alt="${testimony.title}">`;
      }).join('');
      gallery.innerHTML = html;
      gallery.classList.remove('hidden');
    } else {
      gallery.innerHTML = '';
      gallery.classList.add('hidden');
    }
  }
  
  const amenBtn = dialog.querySelector('.amen-button');
  amenBtn.dataset.testimonyId = testimony.id;
  amenBtn.classList.toggle('active', hasAmened);
  amenBtn.setAttribute('aria-pressed', hasAmened ? 'true' : 'false');
  amenBtn.querySelector('.amen-count').textContent = amenCount;
  
  // Setup navigation
  const testimonies = window.UTILS.getFilteredTestimonies();
  const currentIndex = testimonies.findIndex(t => t.id === testimony.id);
  
  const prevBtn = dialog.querySelector('.modal-prev');
  const nextBtn = dialog.querySelector('.modal-next');
  
  prevBtn.disabled = currentIndex <= 0;
  nextBtn.disabled = currentIndex >= testimonies.length - 1;
  
  prevBtn.onclick = () => {
    if (currentIndex > 0) {
      const prevTestimony = testimonies[currentIndex - 1];
      if (prevTestimony.type === 'video') {
        closeTestimonyModal();
        openVideoModal(prevTestimony);
      } else {
        openTestimonyModal(prevTestimony);
      }
    }
  };
  
  nextBtn.onclick = () => {
    if (currentIndex < testimonies.length - 1) {
      const nextTestimony = testimonies[currentIndex + 1];
      if (nextTestimony.type === 'video') {
        closeTestimonyModal();
        openVideoModal(nextTestimony);
      } else {
        openTestimonyModal(nextTestimony);
      }
    }
  };
  
  dialog.showModal();
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
  
  dialog.querySelector('.video-modal-title').textContent = testimony.title;
  
  const videoPlayer = dialog.querySelector('#videoPlayer');
  videoPlayer.src = testimony.videoUrl;
  
  dialog.querySelector('.video-author').textContent = testimony.author;
  dialog.querySelector('.video-location').textContent = testimony.location;
  dialog.querySelector('.video-date').textContent = testimony.date;
  const videoBody = dialog.querySelector('.video-modal-body');
  if (videoBody && window.UTILS) {
    videoBody.style.background = window.UTILS.getPostItColor(testimony);
    videoBody.style.fontFamily = window.UTILS.getFontFamilyValue(testimony);
  }
  
  const amenBtn = dialog.querySelector('.amen-button');
  amenBtn.dataset.testimonyId = testimony.id;
  amenBtn.classList.toggle('active', hasAmened);
  amenBtn.setAttribute('aria-pressed', hasAmened ? 'true' : 'false');
  amenBtn.querySelector('.amen-count').textContent = amenCount;
  
  // Setup navigation
  const testimonies = window.UTILS.getFilteredTestimonies();
  const currentIndex = testimonies.findIndex(t => t.id === testimony.id);
  
  const prevBtn = dialog.querySelector('.modal-prev');
  const nextBtn = dialog.querySelector('.modal-next');
  
  prevBtn.disabled = currentIndex <= 0;
  nextBtn.disabled = currentIndex >= testimonies.length - 1;
  
  prevBtn.onclick = () => {
    if (currentIndex > 0) {
      const prevTestimony = testimonies[currentIndex - 1];
      videoPlayer.pause();
      closeVideoModal();
      if (prevTestimony.type === 'video') {
        openVideoModal(prevTestimony);
      } else {
        openTestimonyModal(prevTestimony);
      }
    }
  };
  
  nextBtn.onclick = () => {
    if (currentIndex < testimonies.length - 1) {
      const nextTestimony = testimonies[currentIndex + 1];
      videoPlayer.pause();
      closeVideoModal();
      if (nextTestimony.type === 'video') {
        openVideoModal(nextTestimony);
      } else {
        openTestimonyModal(nextTestimony);
      }
    }
  };
  
  dialog.showModal();
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

function openTestimonyForm() {
  const dialog = document.getElementById('testimonyFormDialog');
  const panel = document.getElementById('testimonyForm');
  const isStandalonePanel = panel && (!dialog || !dialog.contains(panel)); // home.html overlay vs dialog form

  if (isStandalonePanel) {
    if (!panel.dataset.inited) {
      if (window.FORM && typeof window.FORM.initializeTestimonyForm === 'function') {
        try { window.FORM.initializeTestimonyForm(); panel.dataset.inited = '1'; } catch (e) { /* noop */ }
      }
    }
    panel.classList.remove('hidden');
    return;
  }

  if (dialog) {
    if (!dialog.dataset.inited) {
      if (window.FORM && typeof window.FORM.initializeTestimonyForm === 'function') {
        try { window.FORM.initializeTestimonyForm(); dialog.dataset.inited = '1'; } catch (e) { /* noop */ }
      }
    }
    dialog.showModal();
  }
}

function closeTestimonyForm() {
  const dialog = document.getElementById('testimonyFormDialog');
  const panel = document.getElementById('testimonyForm');
  const isStandalonePanel = panel && (!dialog || !dialog.contains(panel));

  if (isStandalonePanel) {
    panel.classList.add('hidden');
    if (window.FORM && window.FORM.resetForm) window.FORM.resetForm();
    return;
  }

  if (dialog) {
    dialog.close();
    if (window.FORM && window.FORM.resetForm) window.FORM.resetForm();
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

// Provide global helpers so inline onclick="openTestimonyForm()" works too
if (!window.openTestimonyForm) {
  window.openTestimonyForm = function(){
    if (window.MODALS && typeof window.MODALS.openTestimonyForm === 'function') {
      window.MODALS.openTestimonyForm();
    }
  };
}
if (!window.closeTestimonyForm) {
  window.closeTestimonyForm = function(){
    if (window.MODALS && typeof window.MODALS.closeTestimonyForm === 'function') {
      window.MODALS.closeTestimonyForm();
    }
  };
}
