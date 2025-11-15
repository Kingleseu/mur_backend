// ================================================
// REACTIVE STATE MANAGEMENT
// ================================================

const state = {
  userName: localStorage.getItem('bunda21_user') || null,
  userEmail: '',
  selectedCategory: 'Tous',
  currentPage: 1,
  amenCounts: {},
  amenedTestimonies: new Set(JSON.parse(localStorage.getItem('bunda21_amened') || '[]')),
  
  // Form state
  testimonyType: 'text',
  selectedColor: window.CONFIG.POST_IT_COLORS[0],
  selectedFont: window.CONFIG.FONT_STYLES[0],
  uploadedImages: [],
  imageFiles: [],
  videoFile: null,
  videoPreview: null,
  mediaRecorder: null,
  recordedChunks: [],
  
  // UI state
  isCarouselPaused: false
};

if (window.CONFIG && Array.isArray(window.CONFIG.TESTIMONIES)) {
  window.CONFIG.TESTIMONIES.forEach((testimony) => {
    if (!testimony || typeof testimony.id === 'undefined') return;
    const count = typeof testimony.amen_count === 'number' ? testimony.amen_count : 0;
    state.amenCounts[testimony.id] = count;
  });
}

// Save amened testimonies to localStorage
function saveAmenedTestimonies() {
  localStorage.setItem('bunda21_amened', JSON.stringify([...state.amenedTestimonies]));
}

// Export state
window.STATE = state;
window.saveAmenedTestimonies = saveAmenedTestimonies;
