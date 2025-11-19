// Bridge between the vanilla form.js module and the Django REST API.
// Handles both text & video testimonies (images + video uploads) via /api/testimonies/.
(function(){
  const API_ENDPOINT = '/api/testimonies/';
  const DEFAULT_VIDEO_THUMB = (window.CONFIG && window.CONFIG.DEFAULT_VIDEO_THUMBNAIL) ||
    'https://images.unsplash.com/photo-1547357245-bd63d4b7c483?auto=format&fit=crop&w=800&q=60';
  const FONT_NORMALIZE_MAP = [
    { needle: 'permanent marker', label: 'Permanent Marker' },
    { needle: 'patrick hand', label: 'Patrick Hand' },
    { needle: 'indie flower', label: 'Indie Flower' },
    { needle: 'merriweather', label: 'Merriweather' },
    { needle: 'caveat', label: 'Caveat' },
    { needle: 'kalam', label: 'Kalam' },
    { needle: 'shadows into light', label: 'Shadows Into Light' },
    { needle: 'inter', label: 'Inter' }
  ];

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

  function normalizeFontLabel(fontFamily, fallbackName){
    const css = (fontFamily || '').toLowerCase();
    const direct = (fallbackName || '').trim();
    if (direct) return direct;
    for (const entry of FONT_NORMALIZE_MAP){
      if (css.includes(entry.needle)){
        return entry.label;
      }
    }
    return 'Inter';
  }

  function formatDateLabel(isoString){
    const date = isoString ? new Date(isoString) : new Date();
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', '');
  }

  function mapApiPayloadToFrontend(apiPayload, extras = {}){
    if (!apiPayload) return null;
    const fullText = (apiPayload.text || '').trim();
    const preview = fullText.length > 240 ? `${fullText.slice(0, 240)}…` : fullText;
    const imageUrls = Array.isArray(apiPayload.images)
      ? apiPayload.images.map(img => img && img.url).filter(Boolean)
      : [];

    const testimony = {
      id: apiPayload.id,
      title: apiPayload.title || '',
      text: preview,
      fullText,
      color: apiPayload.postit_color || getSelectedColorHex(),
      font: normalizeFontLabel(apiPayload.font_family, extras.fontName),
      author: extras.author || (apiPayload.author || `${apiPayload.first_name || ''} ${apiPayload.last_name || ''}`).trim() || 'Anonyme',
      location: extras.location || '',
      date: formatDateLabel(apiPayload.created_at),
      category: apiPayload.category || '',
      amen_count: apiPayload.amen_count || 0
    };

    if (imageUrls.length){
      testimony.images = imageUrls;
      testimony.thumbnail = testimony.thumbnail || imageUrls[0];
    } else if (apiPayload.thumbnail){
      testimony.thumbnail = apiPayload.thumbnail;
    }

    const kind = (apiPayload.kind || extras.kind || 'text').toLowerCase();
    if (kind === 'video'){
      testimony.type = 'video';
      testimony.videoUrl = apiPayload.video_url || apiPayload.video || '';
      testimony.thumbnail = testimony.thumbnail || DEFAULT_VIDEO_THUMB;
    }

    return testimony;
  }

  function prependTestimony(testimony){
    if (!testimony) return null;
    if (!window.CONFIG.TESTIMONIES || !Array.isArray(window.CONFIG.TESTIMONIES)){
      window.CONFIG.TESTIMONIES = [];
    }
    window.CONFIG.TESTIMONIES.unshift(testimony);
    if (window.STATE && window.STATE.amenCounts){
      window.STATE.amenCounts[testimony.id] = testimony.amen_count || 0;
    }
    return testimony;
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

  function resolveCategoryValue() {
    const select = document.getElementById('formCategory');
    if (!select) return '';
    let value = (select.value || '').trim();
    if (!value) {
      throw new Error('Veuillez sélectionner une catégorie.');
    }
    if (value.toLowerCase() === 'autre') {
      const customInput = document.getElementById('formCategoryCustom');
      const custom = (customInput ? customInput.value : '').trim();
      if (!custom) {
        throw new Error('Veuillez préciser la catégorie lorsque vous choisissez "Autre".');
      }
      return custom;
    }
    return value;
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

  function handleServerSuccess(payload, extras = {}){
    if (!payload) return;
    const status = typeof payload.status === 'string' ? payload.status.toLowerCase() : '';
    if (status === 'approved') {
      const normalized = mapApiPayloadToFrontend(payload, extras);
      if (normalized) {
        normalized.status = payload.status;
        prependTestimony(normalized);
        refreshUI();
      }
      if (window.showToast){
        window.showToast('Témoignage publié immédiatement !', { kind: 'success' });
      } else {
        alert('Témoignage publié immédiatement !');
      }
      if (window.STATS && window.STATS.updateDynamicStats) {
        window.STATS.updateDynamicStats();
      }
    } else if (window.showToast){
      window.showToast('Témoignage envoyé. Il sera publié après validation.', { kind: 'success' });
    } else {
      alert('Témoignage envoyé. Il sera publié après validation.');
    }
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

      const formTarget = e.target.closest('form') || formEl;
      const submitBtn = formTarget ? formTarget.querySelector('.submit-btn') : null;
      const cancelBtn = formTarget ? formTarget.querySelector('.cancel-btn') : null;
      const initialLabel = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Envoi en cours...';
      }
      if (cancelBtn) {
        cancelBtn.disabled = true;
      }

      const isVideo = (window.STATE && window.STATE.testimonyType === 'video');
      try{
        const result = isVideo ? await handleVideoSubmit() : await handleTextSubmit();

        if (window.MODALS && window.MODALS.closeTestimonyForm) {
          window.MODALS.closeTestimonyForm();
        } else if (window.closeTestimonyForm) {
          window.closeTestimonyForm();
        }
        if (window.FORM && window.FORM.resetForm) {
          window.FORM.resetForm();
        }

        if (result && result.payload) {
          handleServerSuccess(result.payload, result.extras || {});
        }
      } catch(err){
        if (window.showToast) window.showToast(err.message || 'Échec de la soumission');
        else alert(err.message || 'Échec de la soumission');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          submitBtn.textContent = initialLabel || 'Soumettre mon témoignage';
        }
        if (cancelBtn) {
          cancelBtn.disabled = false;
        }
      }
    }

    async function handleTextSubmit(){
      const titleEl = document.getElementById('formTitle');
      const textEl = document.getElementById('formTestimony') || document.getElementById('formText');

      const title = titleEl ? titleEl.value.trim() : '';
      const testimonyText = textEl ? textEl.value.trim() : '';
      if (!title || !testimonyText){
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const category = resolveCategoryValue();
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

      const payload = await postFormData(fd);
      return {
        payload,
        extras: {
          kind: 'text',
          author: window.STATE.userName || `${first} ${last}`.trim(),
          fontName,
          location: window.STATE.userLocation || '',
          color: colorHex
        }
      };
    }

    async function handleVideoSubmit(){
      const titleEl = document.getElementById('formTitle');
      const title = titleEl ? titleEl.value.trim() : '';
      if (!title){
        throw new Error('Veuillez renseigner un titre pour votre témoignage vidéo.');
      }

      const rawFile = window.STATE && window.STATE.videoFile;
      if (!rawFile){
        throw new Error('Veuillez enregistrer ou sélectionner une vidéo.');
      }
      const videoFile = ensureFileObject(rawFile);
      if (!videoFile){
        throw new Error('Impossible de préparer la vidéo. Réessayez.');
      }

      const category = resolveCategoryValue();
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

      const payload = await postFormData(fd);
      return {
        payload,
        extras: {
          kind: 'video',
          author: window.STATE.userName || `${first} ${last}`.trim(),
          fontName,
          location: window.STATE.userLocation || '',
          color: colorHex
        }
      };
    }

    window.handleFormSubmit = serverHandler;
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


