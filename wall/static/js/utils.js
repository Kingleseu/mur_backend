// ================================================
// UTILITY FUNCTIONS
// ================================================

function getAmensForTestimony(id) {
  if (typeof window.STATE.amenCounts[id] === 'number') {
    return window.STATE.amenCounts[id];
  }
  const testimony = (window.CONFIG.TESTIMONIES || []).find(t => t.id === id);
  const count = testimony && typeof testimony.amen_count === 'number' ? testimony.amen_count : 0;
  window.STATE.amenCounts[id] = count;
  return count;
}

function getFilteredTestimonies() {
  const { TESTIMONIES } = window.CONFIG;
  const { selectedCategory } = window.STATE;

  // Ne garder que les témoignages approuvés (ou sans statut explicite)
  const approved = TESTIMONIES.filter(
    (t) => !t.status || t.status === 'approved'
  );

  if (selectedCategory === 'Tous') {
    return approved;
  } else if (selectedCategory === 'Vidéos') {
    return approved.filter(t => t.type === 'video');
  } else {
    return approved.filter(t => t.category === selectedCategory);
  }
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


function getCSRFToken() {
  const name = 'csrftoken=';
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const cookieRaw of cookies) {
    const cookie = cookieRaw.trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }
  return '';
}

function setAmenButtonsState(id, { count, liked, loading }) {
  const buttons = document.querySelectorAll(`.amen-button[data-testimony-id="${id}"]`);
  buttons.forEach(btn => {
    if (typeof count === 'number') {
      const span = btn.querySelector('.amen-count');
      if (span) span.textContent = count;
    }
    if (typeof liked === 'boolean') {
      btn.classList.toggle('amen-active', liked);
    }
    if (typeof loading === 'boolean') {
      btn.disabled = loading;
      btn.classList.toggle('disabled', loading);
    }
  });
}

async function toggleAmenRequest(id) {
  const res = await fetch(`/api/testimonies/${id}/amen/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken()
    },
    credentials: 'same-origin'
  });
  let json = {};
  try {
    json = await res.json();
  } catch (_) {}
  if (!res.ok || json.ok === false) {
    const msg = (json && (json.error || json.detail)) || '';
    throw new Error(msg || `Erreur lors de l'action Amen (${res.status})`);
  }
  return json;
}

async function handleAmen(id, event) {
  const currentCount = getAmensForTestimony(id);
  setAmenButtonsState(id, { count: currentCount, loading: true });
  try {
    const result = await toggleAmenRequest(id);
    const { amen_count, liked } = result;
    window.STATE.amenCounts[id] = amen_count;
    const testimony = (window.CONFIG.TESTIMONIES || []).find(t => t.id === id);
    if (testimony) testimony.amen_count = amen_count;
    if (liked) {
      window.STATE.amenedTestimonies.add(id);
    } else {
      window.STATE.amenedTestimonies.delete(id);
    }
    window.saveAmenedTestimonies();
    setAmenButtonsState(id, { count: amen_count, liked, loading: false });

    if (liked && event) {
      const btn = event.target.closest('.amen-button');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        triggerConfetti(x, y);
      }
    }

    window.dispatchEvent(new CustomEvent('amenClicked', {
      detail: { testimonyId: id, liked, amenCount: amen_count }
    }));
  } catch (error) {
    if (window.showToast) {
      window.showToast(error.message || 'Impossible de traiter votre Amen');
    } else {
      alert(error.message || 'Impossible de traiter votre Amen');
    }
    setAmenButtonsState(id, { loading: false });
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
        alert('Lien copié !');
      });
      break;
  }
  
  // Déclencher l'événement pour mettre à jour les stats
  window.dispatchEvent(new CustomEvent('testimonyShared', { 
    detail: { 
      testimonyId: testimony.id,
      platform: platform 
    } 
  }));
}

// Export functions
window.UTILS = {
  getAmensForTestimony,
  getFilteredTestimonies,
  getCurrentPageTestimonies,
  getTotalPages,
  animateCounter,
  triggerConfetti,
  scrollToWall,
  handleAmen,
  handleShare
};
