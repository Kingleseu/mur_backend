// ================================================
// FORMULAIRE D'AJOUT DE TÉMOIGNAGE COMPLET
// ================================================

let formInitialized = false;

function setTestimonyType(type = 'text') {
  const targetType = type === 'video' ? 'video' : 'text';
  if (window.STATE) {
    window.STATE.testimonyType = targetType;
  }

  const textSection = document.getElementById('textTestimonySection');
  const videoSection = document.getElementById('videoTestimonySection');
  if (textSection && videoSection) {
    textSection.classList.toggle('hidden', targetType !== 'text');
    videoSection.classList.toggle('hidden', targetType !== 'video');
  }

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    const btnType = btn.dataset.type || 'text';
    btn.classList.toggle('active', btnType === targetType);
  });

  // Toggle required attribute so the browser doesn't block video submissions
  const testimonyTextarea = document.getElementById('formTestimony');
  if (testimonyTextarea) {
    testimonyTextarea.required = (targetType === 'text');
  }
}

function initializeTestimonyForm() {
  if (formInitialized) return;
  formInitialized = true;
  // Type de témoignage (Texte vs Vidéo)
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      setTestimonyType(btn.dataset.type);
    });
  });
  
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
    const files = Array.from(e.target.files || []);
    const existingFiles = Array.isArray(window.STATE.imageFiles) ? window.STATE.imageFiles.length : 0;
    
    if (existingFiles + files.length > 5) {
      alert('Vous pouvez ajouter maximum 5 photos');
      return;
    }
    
    files.forEach(file => {
      if (!file) return;
      if (!Array.isArray(window.STATE.imageFiles)) {
        window.STATE.imageFiles = [];
      }
      window.STATE.imageFiles.push(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        window.STATE.uploadedImages.push(evt.target.result);
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

  const initialType = (window.STATE && window.STATE.testimonyType) || 'text';
  setTestimonyType(initialType);
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
      if (Array.isArray(window.STATE.imageFiles)) {
        window.STATE.imageFiles.splice(index, 1);
      }
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
      const fileName = `temoignage-${Date.now()}.webm`;
      let fileToStore;
      try {
        fileToStore = new File([blob], fileName, { type: blob.type || 'video/webm' });
      } catch (_){
        fileToStore = blob;
        fileToStore.name = fileName;
      }
      const url = URL.createObjectURL(fileToStore);
      
      window.STATE.videoPreview = url;
      window.STATE.videoFile = fileToStore;
      
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
      location: 'Votre ville',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', ''),
      category: 'Guérison',
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
      location: 'Votre ville',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', ''),
      category: 'Famille'
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
  window.STATE.imageFiles = [];
  window.STATE.videoFile = null;
  window.STATE.videoPreview = null;
  window.STATE.recordedChunks = [];
  setTestimonyType('text');
  window.STATE.selectedColor = window.CONFIG.POST_IT_COLORS[0];
  window.STATE.selectedFont = window.CONFIG.FONT_STYLES[0];
  
  document.getElementById('photosPreview').innerHTML = '';
  document.getElementById('charCount').textContent = '0';
  
  const preview = document.getElementById('postItPreview');
  preview.style.backgroundColor = window.STATE.selectedColor.value;
  preview.style.borderColor = window.STATE.selectedColor.border;
  
  const textarea = document.getElementById('formTestimony');
  textarea.style.fontFamily = window.STATE.selectedFont.value;

}

// Export functions
window.FORM = {
  initializeTestimonyForm,
  setTestimonyType,
  renderPhotosPreview,
  startRecording,
  stopRecording,
  handleVideoUpload,
  handleFormSubmit,
  resetForm
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!formInitialized) {
      initializeTestimonyForm();
    }
  });
} else {
  if (!formInitialized) {
    initializeTestimonyForm();
  }
}
