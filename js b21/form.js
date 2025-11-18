// ================================================
// FORMULAIRE D'AJOUT DE TÉMOIGNAGE COMPLET
// ================================================

// Normalisation : minuscules + suppression des accents
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Détermination intelligente de la catégorie à partir du titre.
 * - Score plus fort pour :
 *   - correspondance exacte du mot
 *   - début de mot correspondant à la racine
 *   - phrases complètes trouvées
 */
function inferCategoryFromTitle(rawTitle) {
  const text = normalizeText(rawTitle || "");
  if (!text) return "Autre";

  // Découpe en mots (tokens)
  const tokens = text
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  let bestCategory = "Autre";
  let bestScore = 0;

  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    let score = 0;

    keywords.forEach((kw) => {
      const normKw = normalizeText(kw);

      // Si la "racine" contient un espace → on considère que c'est une phrase
      if (normKw.includes(" ")) {
        if (text.includes(normKw)) {
          score += 4; // gros bonus pour une phrase entière
        }
        return;
      }

      // Sinon, on traite comme racine à tester sur chaque token
      tokens.forEach((tok) => {
        if (tok === normKw) {
          score += 4; // mot exactement égal à la racine
        } else if (tok.startsWith(normKw)) {
          score += 3; // le mot commence par la racine : guer* → guerison, gueri...
        } else if (tok.includes(normKw)) {
          score += 1; // racine contenue quelque part dans le mot
        }
      });
    });

    // Choix de la meilleure catégorie
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });

  // Si aucun score significatif, on reste sur "Autre"
  if (bestScore === 0) return "Autre";
  return bestCategory;
}

function initializeTestimonyForm() {
  // Type de témoignage (Texte vs Vidéo)
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      window.STATE.testimonyType = btn.dataset.type;
      
      if (window.STATE.testimonyType === 'text') {
        document.getElementById('textTestimonySection').classList.remove('hidden');
        document.getElementById('videoTestimonySection').classList.add('hidden');
      } else {
        document.getElementById('textTestimonySection').classList.add('hidden');
        document.getElementById('videoTestimonySection').classList.remove('hidden');
      }
    });
  });

  // normalization and category inference are defined at module/global scope
  
  // Sélecteur de police
  const fontSelector = document.getElementById('fontSelector');
  const fontPopover = document.getElementById('fontPopover');
  
  fontSelector.addEventListener('click', (e) => {
    e.stopPropagation();
    fontPopover.classList.toggle('hidden');
    document.getElementById('colorPopover').classList.add('hidden');
  });
  
  document.querySelectorAll('.font-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const fontName = btn.dataset.font;
      window.STATE.selectedFont = window.CONFIG.FONT_STYLES.find(f => f.name === fontName);
      
      const textarea = document.getElementById('formTestimony');
      textarea.style.fontFamily = window.STATE.selectedFont.value;
      
      document.querySelectorAll('.font-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      fontPopover.classList.add('hidden');
    });
  });
  
  // Sélecteur de couleur
  const colorSelector = document.getElementById('colorSelector');
  const colorPopover = document.getElementById('colorPopover');
  
  colorSelector.addEventListener('click', (e) => {
    e.stopPropagation();
    colorPopover.classList.toggle('hidden');
    fontPopover.classList.add('hidden');
  });
  
  document.querySelectorAll('.color-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const colorValue = btn.dataset.color;
      window.STATE.selectedColor = window.CONFIG.POST_IT_COLORS.find(c => c.value === colorValue);
      
      const preview = document.getElementById('postItPreview');
      preview.style.backgroundColor = window.STATE.selectedColor.value;
      preview.style.borderColor = window.STATE.selectedColor.border;
      
      document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      colorPopover.classList.add('hidden');
    });
  });
  
  // Fermer popovers en cliquant ailleurs
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#fontSelector') && !e.target.closest('#fontPopover')) {
      fontPopover.classList.add('hidden');
    }
    if (!e.target.closest('#colorSelector') && !e.target.closest('#colorPopover')) {
      colorPopover.classList.add('hidden');
    }
  });
  
  // Compteur de caractères
  const testimonyTextarea = document.getElementById('formTestimony');
  const charCount = document.getElementById('charCount');
  
  testimonyTextarea.addEventListener('input', (e) => {
    charCount.textContent = e.target.value.length;
  });
  
  // Upload de photos
  const uploadPhotosBtn = document.getElementById('uploadPhotosBtn');
  const photoInput = document.getElementById('photoInput');
  
  uploadPhotosBtn.addEventListener('click', () => {
    photoInput.click();
  });
  
  photoInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    
    if (window.STATE.uploadedImages.length + files.length > 5) {
      alert('Vous pouvez ajouter maximum 5 photos');
      return;
    }
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        window.STATE.uploadedImages.push(e.target.result);
        renderPhotosPreview();
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    photoInput.value = '';
  });
  
  // Enregistrement vidéo
  const recordVideoBtn = document.getElementById('recordVideoBtn');
  recordVideoBtn.addEventListener('click', startRecording);
  
  const stopRecordingBtn = document.getElementById('stopRecordingBtn');
  stopRecordingBtn.addEventListener('click', stopRecording);
  
  // Upload vidéo
  const uploadVideoBtn = document.getElementById('uploadVideoBtn');
  const videoInput = document.getElementById('videoInput');
  
  uploadVideoBtn.addEventListener('click', () => {
    videoInput.click();
  });
  
  videoInput.addEventListener('change', handleVideoUpload);
  
  // Remplacer vidéo
  const replaceVideoBtn = document.getElementById('replaceVideoBtn');
  replaceVideoBtn.addEventListener('click', () => {
    window.STATE.videoFile = null;
    window.STATE.videoPreview = null;
    
    document.getElementById('videoPreviewSection').classList.add('hidden');
    document.getElementById('videoUploadOptions').classList.remove('hidden');
    
    const videoPlayer = document.getElementById('videoPreviewPlayer');
    videoPlayer.src = '';
  });
  
  // Soumission du formulaire
  const testimonyForm = document.getElementById('testimonyForm');
  testimonyForm.addEventListener('submit', handleFormSubmit);
  
  // Bouton annuler
  const cancelBtn = document.getElementById('formCancelBtn');
  cancelBtn.addEventListener('click', () => {
    window.MODALS.closeTestimonyForm();
  });
}

function renderPhotosPreview() {
  const container = document.getElementById('photosPreview');
  container.innerHTML = window.STATE.uploadedImages.map((img, index) => `
    <div class="photo-preview">
      <img src="${img}" alt="Photo ${index + 1}">
      <button type="button" class="remove-photo" data-index="${index}">×</button>
    </div>
  `).join('');
  
  container.querySelectorAll('.remove-photo').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      window.STATE.uploadedImages.splice(index, 1);
      renderPhotosPreview();
    });
  });
}

async function startRecording() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Votre navigateur ne supporte pas l\'enregistrement vidéo. Veuillez uploader une vidéo à la place.');
      return;
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
    document.getElementById('videoUploadOptions').classList.add('hidden');
    document.getElementById('recordingSection').classList.remove('hidden');
    
    const video = document.getElementById('recordingPreview');
    video.srcObject = stream;
    
    window.STATE.mediaRecorder = new MediaRecorder(stream, { 
      mimeType: 'video/webm'
    });
    window.STATE.recordedChunks = [];
    
    window.STATE.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        window.STATE.recordedChunks.push(e.data);
      }
    };
    
    window.STATE.mediaRecorder.onstop = () => {
      const blob = new Blob(window.STATE.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      window.STATE.videoPreview = url;
      window.STATE.videoFile = blob;
      
      stream.getTracks().forEach(track => track.stop());
      
      document.getElementById('recordingSection').classList.add('hidden');
      document.getElementById('videoPreviewSection').classList.remove('hidden');
      document.getElementById('videoPreviewPlayer').src = url;
    };
    
    window.STATE.mediaRecorder.start();
    
    // Auto-stop après 2 minutes
    setTimeout(() => {
      if (window.STATE.mediaRecorder && window.STATE.mediaRecorder.state === 'recording') {
        stopRecording();
        alert('Enregistrement arrêté automatiquement après 2 minutes');
      }
    }, 120000);
    
  } catch (error) {
    console.error('Error accessing camera:', error);
    
    if (error.name === 'NotAllowedError') {
      alert('Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur, ou choisissez d\'uploader une vidéo existante.');
    } else if (error.name === 'NotFoundError') {
      alert('Aucune caméra détectée sur votre appareil. Veuillez uploader une vidéo à la place.');
    } else {
      alert('Impossible d\'accéder à la caméra. Veuillez uploader une vidéo existante à la place.');
    }
  }
}

function stopRecording() {
  if (window.STATE.mediaRecorder && window.STATE.mediaRecorder.state === 'recording') {
    window.STATE.mediaRecorder.stop();
  }
}

function handleVideoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (file.size > 120 * 1024 * 1024) {
    alert('La vidéo est trop volumineuse. Maximum 120MB.');
    return;
  }
  
  window.STATE.videoFile = file;
  window.STATE.videoPreview = URL.createObjectURL(file);
  
  document.getElementById('videoUploadOptions').classList.add('hidden');
  document.getElementById('videoPreviewSection').classList.remove('hidden');
  document.getElementById('videoPreviewPlayer').src = window.STATE.videoPreview;
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('formTitle').value.trim();
  const autoCategory = inferCategoryFromTitle(title);
  
  if (window.STATE.testimonyType === 'text') {
    const testimony = document.getElementById('formTestimony').value.trim();
    
    if (!title || !testimony) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Déterminer la couleur
    let colorKey = 'yellow';
    const colorValue = window.STATE.selectedColor.value;
    if (colorValue === '#FFE5E5' || colorValue === '#FFE0E0') colorKey = 'pink';
    else if (colorValue === '#E4FFEB' || colorValue === '#E0F7FA') colorKey = 'green';
    
    const newTestimony = {
      id: Date.now(),
      title,
      text: testimony.substring(0, 100) + (testimony.length > 100 ? '...' : ''),
      fullText: testimony,
      color: colorKey,
      font: window.STATE.selectedFont.name,
      author: window.STATE.userName || 'Anonyme',
      location: window.STATE.userLocation || 'Lieu non précisé',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', ''),
      category: autoCategory,
      images: window.STATE.uploadedImages
    };
    
    window.CONFIG.TESTIMONIES.unshift(newTestimony);
    
  } else {
    if (!title || !window.STATE.videoFile) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const newTestimony = {
      id: Date.now(),
      type: 'video',
      title,
      thumbnail: 'https://images.unsplash.com/photo-1547357245-bd63d4b7c483?w=400',
      fullText: title,
      videoUrl: window.STATE.videoPreview,
      duration: '2:00',
      color: 'yellow',
      author: window.STATE.userName || 'Anonyme',
      location: window.STATE.userLocation || 'Lieu non précisé',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', ''),
      category: autoCategory
    };
    
    window.CONFIG.TESTIMONIES.unshift(newTestimony);
  }
  
  // Reset et fermer
  resetForm();
  window.MODALS.closeTestimonyForm();
  
  // Re-render
  window.STATE.selectedCategory = 'Tous';
  window.STATE.currentPage = 1;
  window.TESTIMONIES_GRID.renderTestimoniesGrid();
  window.TESTIMONIES_GRID.renderPagination();
  window.CAROUSEL.renderCarouselColumns();
  
  alert('Témoignage soumis ! Il sera publié après validation par le CMP.');
}

function resetForm() {
  document.getElementById('testimonyForm').reset();
  window.STATE.uploadedImages = [];
  window.STATE.videoFile = null;
  window.STATE.videoPreview = null;
  window.STATE.recordedChunks = [];
  window.STATE.testimonyType = 'text';
  window.STATE.selectedColor = window.CONFIG.POST_IT_COLORS[0];
  window.STATE.selectedFont = window.CONFIG.FONT_STYLES[0];
  
  document.getElementById('textTestimonySection').classList.remove('hidden');
  document.getElementById('videoTestimonySection').classList.add('hidden');
  document.getElementById('photosPreview').innerHTML = '';
  document.getElementById('charCount').textContent = '0';
  
  const preview = document.getElementById('postItPreview');
  preview.style.backgroundColor = window.STATE.selectedColor.value;
  preview.style.borderColor = window.STATE.selectedColor.border;
  
  const textarea = document.getElementById('formTestimony');
  textarea.style.fontFamily = window.STATE.selectedFont.value;
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.type === 'text') btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

(function () {
  const FONT_FAMILIES = {
    "Sans-serif": "Inter, sans-serif",
    "Serif": "Merriweather, serif",
    "Indie Flower": "'Indie Flower', cursive",
    "Caveat": "Caveat, cursive",
    "Patrick Hand": "'Patrick Hand', cursive",
    "Kalam": "Kalam, cursive",
    "Permanent Marker": "'Permanent Marker', cursive",
    "Shadows Into Light": "'Shadows Into Light', cursive"
  };

  const fontBtn = document.getElementById('fontSelector');
  const fontLabel = document.getElementById('fontSelectorLabel');
  const fontPopover = document.getElementById('fontPopover');
  if (!fontBtn || !fontLabel || !fontPopover) return;

  function updateFontSelectorPreview(fontKey) {
    const family = FONT_FAMILIES[fontKey] || FONT_FAMILIES["Sans-serif"];
    fontLabel.style.fontFamily = family;
    fontLabel.textContent = "Aa";
    fontBtn.title = `Police : ${fontKey}`;

    // poids légèrement plus marqué pour lisibilité sur petit bouton
    if (fontKey === "Serif") {
      fontLabel.style.fontWeight = "700";
    } else if (fontKey === "Permanent Marker") {
      fontLabel.style.fontWeight = "700";
      fontLabel.style.letterSpacing = "0.4px";
    } else {
      fontLabel.style.fontWeight = "600";
      fontLabel.style.letterSpacing = "0.2px";
    }

    // option : géométrie différente pour certaines polices manuscrites
    if (fontKey === "Indie Flower" || fontKey === "Caveat" || fontKey === "Patrick Hand" || fontKey === "Kalam" || fontKey === "Shadows Into Light") {
      fontLabel.style.transform = "translateY(1px)";
    } else {
      fontLabel.style.transform = "translateY(1px)";
    }
  }

  // 1) init à partir du bouton actif dans le popover
  const active = fontPopover.querySelector('.font-option.active');
  const initialKey = active?.getAttribute('data-font') || "Sans-serif";
  updateFontSelectorPreview(initialKey);

  // 2) écoute les clics de changement de police
  fontPopover.addEventListener('click', (e) => {
    const btn = e.target.closest('.font-option');
    if (!btn) return;
    const key = btn.getAttribute('data-font');
    if (!key) return;

    // gère l'état actif visuel si besoin
    fontPopover.querySelectorAll('.font-option.active').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    updateFontSelectorPreview(key);

    // si ton code stocke aussi dans STATE, laisse-le faire ; ici on ne touche pas à ta logique
  });

  // 3) si toi (ou Figma Make) changes la police ailleurs dans ton JS,
  // expose une petite API pour mettre à jour l'aperçu :
  window.updateFontSelectorPreview = updateFontSelectorPreview;
})();

// ================================================
// JS DIVERS POUR LE FORMULAIRE DE TÉMOIGNAGE
// ================================================
(function(){
  // === Segmented control : fallback JS si :has() pas supporté
  const tabs = document.getElementById('typeTabs');
  if (tabs) {
    const indicator = tabs.querySelector('.tab-indicator');
    const textBtn = tabs.querySelector('.tab-btn[data-type="text"]');
    const videoBtn = tabs.querySelector('.tab-btn[data-type="video"]');
    const supportsHas = CSS.supports?.('selector(:has(*))');

    function setActive(which){
      textBtn.classList.toggle('active', which === 'text');
      videoBtn.classList.toggle('active', which === 'video');
      if (!supportsHas && indicator) {
        indicator.style.transform = (which === 'video') ? 'translateX(calc(100% + 8px))' : 'translateX(0)';
      }
      // afficher/masquer sections si ce n'est pas déjà fait par ton JS
      const textSec = document.getElementById('textTestimonySection');
      const videoSec = document.getElementById('videoTestimonySection');
      if (textSec && videoSec) {
        textSec.classList.toggle('hidden', which !== 'text');
        videoSec.classList.toggle('hidden', which !== 'video');
      }
    }

    tabs.addEventListener('click', (e)=>{
      const b = e.target.closest('.tab-btn'); if (!b) return;
      setActive(b.dataset.type);
    });

    // init
    setActive(textBtn.classList.contains('active') ? 'text' : 'video');
  }

  // === Timer d'enregistrement (2 minutes max)
  const recSection = document.getElementById('recordingSection');
  const recMax = recSection ? parseInt(recSection.dataset.maxSeconds || '120', 10) : 120;
  const ringFg = recSection ? recSection.querySelector('.ring-fg') : null;
  const mm = document.getElementById('recMinutes');
  const ss = document.getElementById('recSeconds');
  const circumference = 125.66; // 2πr pour r=20
  let raf = null, startTs = null, remaining = recMax;

  function fmt(n){ return String(n).padStart(2,'0'); }
  function draw(t){
    const elapsed = Math.min((t - startTs) / 1000, recMax);
    const left = Math.max(0, recMax - elapsed);
    const m = Math.floor(left / 60), s = Math.floor(left % 60);
    if (mm && ss){ mm.textContent = fmt(m); ss.textContent = fmt(s); }
    if (ringFg){
      const ratio = elapsed / recMax; // 0 -> 1
      ringFg.style.strokeDashoffset = String(circumference * ratio);
    }
    if (left <= 0){
      stopTimer(true);
      // si tu as une fonction qui arrête l'enregistrement, appelle-la ici :
      // window.stopRecording && window.stopRecording();
      document.getElementById('stopRecordingBtn')?.click(); // fallback
      return;
    }
    raf = requestAnimationFrame(draw);
  }

  function startTimer(){
    cancelAnimationFrame(raf); raf = null;
    startTs = performance.now();
    remaining = recMax;
    if (ringFg) ringFg.style.strokeDashoffset = '0';
    raf = requestAnimationFrame(draw);
  }
  function stopTimer(resetToFull){
    cancelAnimationFrame(raf); raf = null;
    if (resetToFull){
      if (mm && ss){ mm.textContent = '02'; ss.textContent = '00'; }
      if (ringFg) ringFg.style.strokeDashoffset = '0';
    }
  }

  // Expose si tu veux piloter depuis ailleurs
  window.REC_TIMER = { start: startTimer, stop: stopTimer };

  // Raccord simple avec tes boutons existants
  document.getElementById('recordVideoBtn')?.addEventListener('click', ()=>{
    // après avoir lancé ton getUserMedia, démarre le timer :
    startTimer();
  });
  document.getElementById('stopRecordingBtn')?.addEventListener('click', ()=>{
    stopTimer(true);
  });
  document.getElementById('replaceVideoBtn')?.addEventListener('click', ()=>{
    stopTimer(true);
  });
})();

document.getElementById('stopRecordingBtn')?.addEventListener('click', ()=>{
  REC_TIMER.stop(true);
  document.querySelector('.recording-dot')?.classList.remove('active');
});


// Export functions
window.FORM = {
  initializeTestimonyForm,
  renderPhotosPreview,
  startRecording,
  stopRecording,
  handleVideoUpload,
  handleFormSubmit,
  resetForm
};
