// Bridge between the vanilla form.js module and the Django REST API.
// Handles both text & video testimonies (images + video uploads) via /api/testimonies/.
(function(){
  const API_ENDPOINT = '/api/testimonies/';
  const DEFAULT_VIDEO_THUMB = (window.CONFIG && window.CONFIG.DEFAULT_VIDEO_THUMBNAIL) ||
    'https://images.unsplash.com/photo-1547357245-bd63d4b7c483?auto=format&fit=crop&w=800&q=60';

  function getCSRF(){
    const name = 'csrftoken=';
    const parts = document.cookie ? document.cookie.split(';') : [];
    for (let i = 0; i < parts.length; i++){
      const c = parts[i].trim();
      if (c.indexOf(name) === 0) return c.substring(name.length);
    }
    return '';
  }

  function splitName(fullName){
    const safe = (fullName || '').trim();
    if (!safe) return { first: 'Anonyme', last: '' };
    const chunks = safe.split(/\s+/);
    const first = chunks.shift() || 'Anonyme';
    const last = chunks.join(' ');
    return { first, last };
  }

  function getSelectedColorHex(){
    if (window.STATE && window.STATE.selectedColor && window.STATE.selectedColor.value){
      return window.STATE.selectedColor.value;
    }
    return '#FFF6D9';
  }

  function ensureFileObject(fileOrBlob){
    if (!fileOrBlob) return null;
    if (fileOrBlob instanceof File) return fileOrBlob;
    const type = fileOrBlob.type || 'video/mp4';
    const name = `temoignage-${Date.now()}.${type.includes('webm') ? 'webm' : 'mp4'}`;
    try{
      return new File([fileOrBlob], name, { type });
    } catch(_){
      fileOrBlob.name = name;
      fileOrBlob.type = type;
      return fileOrBlob;
    }
  }

  async function postFormData(fd){
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: fd,
      credentials: 'same-origin',
      headers: { 'X-CSRFToken': getCSRF() }
    });
    let json = null;
    try { json = await res.json(); } catch(_){}
    if (!res.ok){
      const errorText = (json && (json.error || json.detail)) || (await res.text().catch(() => ''));
      throw new Error(errorText || `Erreur serveur (${res.status})`);
    }
    return json || {};
  }

  function refreshUI(){
    if (window.TESTIMONIES_GRID){
      if (window.TESTIMONIES_GRID.renderCategoryFilters) window.TESTIMONIES_GRID.renderCategoryFilters();
      if (window.TESTIMONIES_GRID.renderTestimoniesGrid) window.TESTIMONIES_GRID.renderTestimoniesGrid();
      if (window.TESTIMONIES_GRID.renderPagination) window.TESTIMONIES_GRID.renderPagination();
    }
    if (window.CAROUSEL && window.CAROUSEL.renderCarouselColumns) {
      window.CAROUSEL.renderCarouselColumns();
    }
    if (window.STATS && window.STATS.updateDynamicStats) {
      window.STATS.updateDynamicStats();
    }
    window.dispatchEvent(new CustomEvent('testimonyAdded'));
  }

  function ensureAuthenticated(){
    if (window.STATE && window.STATE.userEmail) return true;
    if (window.AUTH_OTP && window.AUTH_OTP.ensureAuthThen){
      window.AUTH_OTP.ensureAuthThen(() => {});
    }
    if (window.showToast) {
      window.showToast('Connectez-vous avant de publier votre tÃ©moignage.');
    } else {
      alert('Connectez-vous avant de publier votre tÃ©moignage.');
    }
    return false;
  }

  function attachHandler(){
    if (!window.FORM || typeof window.FORM.handleFormSubmit !== 'function'){
      setTimeout(attachHandler, 80);
      return;
    }

    const original = window.FORM.handleFormSubmit;
    const formEl = document.getElementById('testimonyForm');

    async function serverHandler(e){
      e.preventDefault();

      if (!ensureAuthenticated()) return;

      const isVideo = (window.STATE && window.STATE.testimonyType === 'video');
      try{
        if (isVideo){
          await handleVideoSubmit();
        } else {
          await handleTextSubmit();
        }

        if (window.MODALS && window.MODALS.closeTestimonyForm) {
          window.MODALS.closeTestimonyForm();
        } else if (window.closeTestimonyForm) {
          window.closeTestimonyForm();
        }
        if (window.FORM && window.FORM.resetForm) {
          window.FORM.resetForm();
        }

        refreshUI();
      } catch(err){
        if (window.showToast) window.showToast(err.message || 'Ã‰chec de la soumission');
        else alert(err.message || 'Ã‰chec de la soumission');
      }
    }

    async function handleTextSubmit(){
      const titleEl = document.getElementById('formTitle');
      const textEl = document.getElementById('formTestimony') || document.getElementById('formText');
      const categorySelect = document.getElementById('formCategory');

      const title = titleEl ? titleEl.value.trim() : '';
      const testimonyText = textEl ? textEl.value.trim() : '';
      if (!title || !testimonyText){
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const category = categorySelect && categorySelect.value ? categorySelect.value : '';
      const colorHex = getSelectedColorHex();
      const fontName = window.STATE && window.STATE.selectedFont && window.STATE.selectedFont.name ? window.STATE.selectedFont.name : 'Inter';
      const fontCSS = window.STATE && window.STATE.selectedFont && window.STATE.selectedFont.value ? window.STATE.selectedFont.value : 'Inter, sans-serif';
      const { first, last } = splitName(window.STATE.userName || 'Anonyme');

      const fd = new FormData();
      fd.append('kind', 'text');
      fd.append('first_name', first);
      fd.append('last_name', last);
      fd.append('title', title);
      fd.append('text', testimonyText);
      fd.append('verification_type', 'email');
      fd.append('email', window.STATE.userEmail || '');
      fd.append('postit_color', colorHex);
      fd.append('font_family', fontCSS);
      if (category) fd.append('category', category);

      const imageFiles = Array.isArray(window.STATE && window.STATE.imageFiles) ? window.STATE.imageFiles : [];
      imageFiles.slice(0, 5).forEach(file => {
        if (file) fd.append('images', file);
      });

      await postFormData(fd);

      if (window.showToast){
        window.showToast('TǸmoignage envoyǸ. En attente de validation.', { kind: 'success' });
      }
    }

    async function handleVideoSubmit(){
      const titleEl = document.getElementById('formTitle');
      const categorySelect = document.getElementById('formCategory');
      const title = titleEl ? titleEl.value.trim() : '';
      if (!title){
        throw new Error('Veuillez renseigner un titre pour votre tǸmoignage vidǸo.');
      }

      const rawFile = window.STATE && window.STATE.videoFile;
      if (!rawFile){
        throw new Error('Veuillez enregistrer ou sǸlectionner une vidǸo.');
      }
      const videoFile = ensureFileObject(rawFile);
      if (!videoFile){
        throw new Error('Impossible de prǸparer la vidǸo. RǸessayez.');
      }

      const category = categorySelect && categorySelect.value ? categorySelect.value : '';
      const colorHex = getSelectedColorHex();
      const fontName = window.STATE && window.STATE.selectedFont && window.STATE.selectedFont.name ? window.STATE.selectedFont.name : 'Inter';
      const fontCSS = window.STATE && window.STATE.selectedFont && window.STATE.selectedFont.value ? window.STATE.selectedFont.value : 'Inter, sans-serif';
      const { first, last } = splitName(window.STATE.userName || 'Anonyme');

      const fd = new FormData();
      fd.append('kind', 'video');
      fd.append('first_name', first);
      fd.append('last_name', last);
      fd.append('title', title);
      fd.append('text', '');
      fd.append('verification_type', 'email');
      fd.append('email', window.STATE.userEmail || '');
      fd.append('postit_color', colorHex);
      fd.append('font_family', fontCSS);
      if (category) fd.append('category', category);
      fd.append('video_file', videoFile);

      await postFormData(fd);

      if (window.showToast){
        window.showToast('TǸmoignage vidǸo envoyǸ. En attente de validation.', { kind: 'success' });
      }
    }

    window.FORM.handleFormSubmit = serverHandler;

    if (formEl){
      formEl.removeEventListener('submit', original);
      formEl.addEventListener('submit', serverHandler);
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', attachHandler);
  } else {
    attachHandler();
  }
})();


