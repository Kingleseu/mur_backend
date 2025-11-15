// ================================================
// UTILITY FUNCTIONS
// ================================================

function getCSRFToken() {
  const name = 'csrftoken=';
  const parts = document.cookie ? document.cookie.split(';') : [];
  for (let i = 0; i < parts.length; i += 1) {
    const cookie = parts[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }
  return '';
}

function getAmensForTestimony(id) {
  if (Object.prototype.hasOwnProperty.call(window.STATE.amenCounts, id)) {
    return window.STATE.amenCounts[id];
  }
  const testimony = window.CONFIG.TESTIMONIES.find(t => t && t.id === id);
  const fallback = testimony && typeof testimony.amen_count === 'number' ? testimony.amen_count : 0;
  window.STATE.amenCounts[id] = fallback;
  return fallback;
}

function getPostItColor(testimony) {
  const defaultColor = (window.CONFIG && window.CONFIG.COLOR_MAP && window.CONFIG.COLOR_MAP.yellow) || '#FFF6D9';
  if (!testimony) return defaultColor;
  const raw = testimony.color || testimony.postit_color || defaultColor;
  if (window.CONFIG && window.CONFIG.COLOR_MAP && window.CONFIG.COLOR_MAP[raw]) {
    return window.CONFIG.COLOR_MAP[raw];
  }
  return raw || defaultColor;
}

function getFontFamilyValue(testimony) {
  const fonts = (window.CONFIG && window.CONFIG.FONT_STYLES) || [];
  const fallback = fonts[0]?.value || 'Inter, sans-serif';
  if (!testimony) return fallback;

  const fontName = testimony.font;
  if (fontName) {
    const match = fonts.find(f => f.name === fontName);
    if (match) return match.value;
  }

  if (testimony.fontCSS) return testimony.fontCSS;
  if (testimony.font_family) return testimony.font_family;

  return fallback;
}

function getFilteredTestimonies() {
  const { TESTIMONIES } = window.CONFIG;
  const { selectedCategory } = window.STATE;

  if (selectedCategory === 'Tous') {
    return TESTIMONIES;
  }
  if (selectedCategory === 'Vidéos') {
    return TESTIMONIES.filter(t => t.type === 'video');
  }
  return TESTIMONIES.filter(t => t.category === selectedCategory);
}

function getCurrentPageTestimonies() {
  const filtered = getFilteredTestimonies();
  const { currentPage } = window.STATE;
  const { ITEMS_PER_PAGE } = window.CONFIG;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return filtered.slice(startIndex, endIndex);
}

function getTotalPages() {
  const filtered = getFilteredTestimonies();
  const { ITEMS_PER_PAGE } = window.CONFIG;
  return Math.ceil(filtered.length / ITEMS_PER_PAGE);
}

function animateCounter(element, target, duration = 2000) {
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

function triggerConfetti(x, y) {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#950000', '#F5D693', '#FFD6DC'],
      ticks: 40,
      gravity: 1.2,
      scalar: 0.8
    });
  }
}

function scrollToWall() {
  const wallSection = document.getElementById('wall');
  if (wallSection) {
    wallSection.scrollIntoView({ behavior: 'smooth' });
  }
}

async function sendAmenRequest(id) {
  const response = await fetch(`/api/testimonies/${id}/amen/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCSRFToken()
    },
    credentials: 'same-origin'
  });
  let payload = {};
  try {
    payload = await response.json();
  } catch (err) {
    payload = {};
  }
  if (!response.ok || payload.ok === false) {
    const message = payload.detail || payload.error || `Impossible de dire Amen (HTTP ${response.status})`;
    throw new Error(message);
  }
  return payload;
}

function updateAmenButtonsUI(buttons, count, liked) {
  buttons.forEach(btn => {
    const countSpan = btn.querySelector('.amen-count');
    if (countSpan) {
      countSpan.textContent = count;
    }
    btn.disabled = false;
    btn.classList.remove('disabled');
    btn.classList.toggle('active', liked);
    btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
  });
}

async function handleAmen(id, event) {
  const amenButtons = document.querySelectorAll(`.amen-button[data-testimony-id="${id}"]`);
  if (!amenButtons.length) return;

  amenButtons.forEach(btn => {
    btn.disabled = true;
    btn.classList.add('disabled');
  });

  try {
    const payload = await sendAmenRequest(id);
    const newCount = typeof payload.amen_count === 'number'
      ? payload.amen_count
      : getAmensForTestimony(id);
    const liked = !!payload.liked;

    window.STATE.amenCounts[id] = newCount;
    const testimony = window.CONFIG.TESTIMONIES.find(t => t && t.id === id);
    if (testimony) testimony.amen_count = newCount;

    if (liked) {
      window.STATE.amenedTestimonies.add(id);
    } else {
      window.STATE.amenedTestimonies.delete(id);
    }
    window.saveAmenedTestimonies();

    updateAmenButtonsUI(amenButtons, newCount, liked);

    if (liked && event && event.target && typeof event.target.getBoundingClientRect === 'function') {
      const rect = event.target.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      triggerConfetti(x, y);
    }

    window.dispatchEvent(new CustomEvent('amenClicked', {
      detail: { testimonyId: id, amenCount: newCount }
    }));
  } catch (error) {
    amenButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('disabled');
    });
    if (window.showToast) {
      window.showToast(error.message || 'Impossible de dire Amen');
    } else {
      alert(error.message || 'Impossible de dire Amen');
    }
  }
}

function handleShare(testimony, platform) {
  const text = `${testimony.title} - Mur de Témoignages Bunda21`;
  const url = window.location.href;

  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
      break;
    case 'copy':
      navigator.clipboard.writeText(url).then(() => {
        if (window.showToast) window.showToast('Lien copié !');
        else alert('Lien copié !');
      });
      break;
    default:
      break;
  }

  window.dispatchEvent(new CustomEvent('testimonyShared', {
    detail: {
      testimonyId: testimony.id,
      platform
    }
  }));
}

window.UTILS = {
  getCSRFToken,
  getAmensForTestimony,
  getPostItColor,
  getFontFamilyValue,
  getFilteredTestimonies,
  getCurrentPageTestimonies,
  getTotalPages,
  animateCounter,
  triggerConfetti,
  scrollToWall,
  handleAmen,
  handleShare
};
