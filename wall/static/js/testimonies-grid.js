// ================================================
// TESTIMONIES GRID & PAGINATION
// ================================================

function renderTestimoniesGrid() {
  const grid = document.getElementById('testimoniesGrid');
  if (!grid) return;
  
  const testimonies = window.UTILS.getCurrentPageTestimonies();
  const totalPages = window.UTILS.getTotalPages();
  const isLastPage = window.STATE.currentPage === totalPages;
  
  // Générer le HTML des cartes de témoignage
  const testimoniesHTML = testimonies.map((testimony, index) => {
    if (testimony.type === 'video') {
      return renderVideoCard(testimony, index);
    } else {
      return renderTextCard(testimony, index);
    }
  }).join('');
  
  // Ajouter la carte "Ajouter un témoignage" seulement sur la dernière page et à la fin
  grid.innerHTML = testimoniesHTML + (isLastPage ? renderAddCard() : '');
  
  // Add event listeners
  addGridEventListeners();
  
  // Déclencher un événement pour que les enhancements puissent réagir
  window.dispatchEvent(new CustomEvent('testimoniesRendered'));
}

function resolveCardColor(rawColor) {
  if (!rawColor) {
    return '#FFF6D9';
  }
  const map = (window.CONFIG && window.CONFIG.COLOR_MAP) || {};
  return map[rawColor] || rawColor;
}

function resolveFontFamily(fontName) {
  const styles = (window.CONFIG && window.CONFIG.FONT_STYLES) || [];
  if (!fontName && styles.length > 0) {
    return styles[0].value;
  }
  const match = styles.find(style => style.name === fontName);
  if (match) {
    return match.value;
  }
  if (fontName) {
    return fontName;
  }
  return 'Inter, sans-serif';
}

function hasAttachedImages(testimony) {
  return Array.isArray(testimony?.images) && testimony.images.length > 0;
}

function getPrimaryImageUrl(testimony) {
  if (!testimony) return '';
  if (testimony.thumbnail) return testimony.thumbnail;
  if (hasAttachedImages(testimony)) {
    return testimony.images[0];
  }
  return '';
}

function renderImagePreview(testimony) {
  const url = getPrimaryImageUrl(testimony);
  if (!url) return '';
  const remaining = hasAttachedImages(testimony) ? Math.max(0, testimony.images.length - 1) : 0;
  const badge = remaining > 0 ? `<span class="testimony-media-count">+${remaining}</span>` : '';
  const safeTitle = testimony.title ? testimony.title.replace(/"/g, '&quot;') : 'Illustration témoignage';
  return `
    <div class="testimony-card-media">
      <img src="${url}" alt="${safeTitle}">
      ${badge}
    </div>
  `;
}

function renderTextCard(testimony, index) {
  const rotation = (Math.random() - 0.5) * 6;
  const bgColor = resolveCardColor(testimony.color);
  const fontFamily = resolveFontFamily(testimony.font);
  const amenCount = window.UTILS.getAmensForTestimony(testimony.id);
  const hasAmened = window.STATE.amenedTestimonies.has(testimony.id);
  const staggerClass = `stagger-${index % 9}`;
  const mediaHtml = renderImagePreview(testimony);
  const hasMedia = Boolean(mediaHtml);
  
  return `
    <div class="testimony-card ${staggerClass}" 
        style="background: ${bgColor}; transform: rotate(${rotation}deg);"  
         data-testimony-id="${testimony.id}"
         data-type="text"
         data-has-media="${hasMedia ? '1' : '0'}">
      <div class="testimony-pin">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="17" x2="12" y2="3"></line>
          <path d="m6 11 6 6 6-6"></path>
          <path d="M19 21 H5"></path>
        </svg>
      </div>
      ${mediaHtml}
      
      <div class="testimony-card-content" style="font-family: ${fontFamily};">
        <h3 class="testimony-card-title">${testimony.title}</h3>
        <p class="testimony-card-text">${testimony.text || testimony.fullText.substring(0, 120) + '...'}</p>
        <p class="testimony-card-author">- ${testimony.author}</p>
        <div class="testimony-card-meta">
          <span class="testimony-card-location">${testimony.location}</span>
          <span>${testimony.date}</span>
        </div>
      </div>
      
      <div class="testimony-card-actions">
        <button class="amen-button ${hasAmened ? 'amen-active' : ''}" 
                data-testimony-id="${testimony.id}">
          <span>🙌</span>
          Amen (<span class="amen-count">${amenCount}</span>)
        </button>
        <div class="share-buttons">
          <button class="share-btn" data-platform="twitter" data-testimony-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </button>
          <button class="share-btn" data-platform="whatsapp" data-testimony-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
          <button class="share-btn" data-platform="copy" data-testimony-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderVideoCard(testimony, index) {
  const rotation = (Math.random() - 0.5) * 6;
  const bgColor = resolveCardColor(testimony.color);
  const fontFamily = resolveFontFamily(testimony.font);
  const amenCount = window.UTILS.getAmensForTestimony(testimony.id);
  const hasAmened = window.STATE.amenedTestimonies.has(testimony.id);
  const staggerClass = `stagger-${index % 9}`;
  const coverUrl = getPrimaryImageUrl(testimony);
  const hasCover = Boolean(coverUrl);
  const mediaMarkup = hasCover
    ? `<img src="${coverUrl}" alt="${testimony.title || 'Miniature vidéo'}" class="video-thumbnail video-thumbnail-img">`
    : `<video class="video-thumbnail" muted autoplay loop playsinline>
         <source src="${testimony.videoUrl}" type="video/mp4">
       </video>`;
  
  return `
    <div class="testimony-card video-card ${staggerClass}" 
        style="background: ${bgColor}; transform: rotate(${rotation}deg);" 
         data-testimony-id="${testimony.id}"
         data-type="video"
         data-has-media="1">
      <div class="testimony-pin">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="17" x2="12" y2="3"></line>
          <path d="m6 11 6 6 6-6"></path>
          <path d="M19 21 H5"></path>
        </svg>
      </div>
      
      <div class="video-thumbnail-wrapper">
        ${mediaMarkup}
        <div class="video-play-overlay">
          <div class="video-play-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
        <div class="video-duration">${testimony.duration}</div>
      </div>
      
      <div class="testimony-card-content" style="font-family: ${fontFamily};">
        <h3 class="testimony-card-title">${testimony.title}</h3>
        <p class="testimony-card-author">- ${testimony.author}</p>
        <div class="testimony-card-meta">
          <span class="testimony-card-location">${testimony.location}</span>
          <span>${testimony.date}</span>
        </div>
      </div>
      
      <div class="testimony-card-actions">
        <button class="amen-button ${hasAmened ? 'amen-active' : ''}" 
                data-testimony-id="${testimony.id}">
          <span>🙌</span>
          Amen (<span class="amen-count">${amenCount}</span>)
        </button>
        <div class="share-buttons">
          <button class="share-btn" data-platform="twitter" data-testimony-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </button>
          <button class="share-btn" data-platform="whatsapp" data-testimony-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
          <button class="share-btn" data-platform="copy" data-testimony-id="${testimony.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderAddCard() {
  return `
    <div class="add-card" id="addTestimonyCard">
      <div class="add-card-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
      <p class="add-card-text">Ajoutez votre témoignage</p>
    </div>
  `;
}

function addGridEventListeners() {
  const grid = document.getElementById('testimoniesGrid');
  if (!grid) return;
  
  // Click sur cartes → Ouvrir modal
  grid.querySelectorAll('.testimony-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.testimony-card-actions')) return;
      if (e.target.closest('.video-play-overlay')) return;
      if (e.target.closest('.video-fullscreen-btn')) return;
      
      const id = parseInt(card.dataset.testimonyId);
      const testimony = window.CONFIG.TESTIMONIES.find(t => t.id === id);
      
      if (testimony) {
        if (testimony.type === 'video') {
          window.MODALS.openVideoModal(testimony);
        } else {
          window.MODALS.openTestimonyModal(testimony);
        }
      }
    });
  });
  
  // Boutons Amen
  grid.querySelectorAll('.amen-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.testimonyId);
      window.UTILS.handleAmen(id, e);
    });
  });
  
  // Boutons partage
  grid.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.testimonyId);
      const testimony = window.CONFIG.TESTIMONIES.find(t => t.id === id);
      if (testimony) {
        window.UTILS.handleShare(testimony, btn.dataset.platform);
      }
    });
  });
  
  // Play vidéo inline
  grid.querySelectorAll('.video-play-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = overlay.closest('.testimony-card');
      const id = parseInt(card.dataset.testimonyId);
      const testimony = window.CONFIG.TESTIMONIES.find(t => t.id === id);
      
      if (testimony && testimony.videoUrl) {
        playVideoInlineGrid(card, testimony);
      }
    });
  });
  
  // Add card
  const addCard = document.getElementById('addTestimonyCard');
  if (addCard) {
    addCard.addEventListener('click', () => {
      window.MODALS.openTestimonyForm();
    });
  }
}

function playVideoInlineGrid(card, testimony) {
  const wrapper = card.querySelector('.video-thumbnail-wrapper');
  wrapper.innerHTML = `
    <video class="video-thumbnail" controls autoplay>
      <source src="${testimony.videoUrl}" type="video/mp4">
    </video>
    <button class="video-fullscreen-btn" data-testimony-id="${testimony.id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
      </svg>
    </button>
  `;
  
  const fullscreenBtn = wrapper.querySelector('.video-fullscreen-btn');
  fullscreenBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const video = wrapper.querySelector('video');
    if (video) video.pause();
    window.MODALS.openVideoModal(testimony);
  });
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  
  const totalPages = window.UTILS.getTotalPages();
  const { currentPage } = window.STATE;

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    pagination.classList.add('hidden');
    return;
  }

  pagination.classList.remove('hidden');
  
  pagination.innerHTML = `
    <button class="pagination-btn" id="prevPage" ${currentPage <= 1 ? 'disabled' : ''}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Précédent
    </button>
    
    <div class="pagination-dots">
      ${Array.from({ length: totalPages }, (_, i) => `
        <button class="pagination-dot ${i + 1 === currentPage ? 'active' : ''}" data-page="${i + 1}"></button>
      `).join('')}
    </div>
    
    <button class="pagination-btn" id="nextPage" ${currentPage >= totalPages ? 'disabled' : ''}>
      Suivant
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;
  
  // Event listeners
  const prevBtn = pagination.querySelector('#prevPage');
  const nextBtn = pagination.querySelector('#nextPage');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        window.STATE.currentPage--;
        renderTestimoniesGrid();
        renderPagination();
        window.UTILS.scrollToWall();
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        window.STATE.currentPage++;
        renderTestimoniesGrid();
        renderPagination();
        window.UTILS.scrollToWall();
      }
    });
  }
  
  pagination.querySelectorAll('.pagination-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const page = parseInt(dot.dataset.page);
      window.STATE.currentPage = page;
      renderTestimoniesGrid();
      renderPagination();
      window.UTILS.scrollToWall();
    });
  });
}

function renderCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;
  
  container.innerHTML = window.CONFIG.CATEGORIES.map(cat => `
    <button class="category-filter ${cat === window.STATE.selectedCategory ? 'active' : ''}" 
            data-category="${cat}">
      ${cat}
    </button>
  `).join('');
  
  container.querySelectorAll('.category-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      window.STATE.selectedCategory = btn.dataset.category;
      window.STATE.currentPage = 1;
      renderCategoryFilters();
      renderTestimoniesGrid();
      renderPagination();
    });
  });
}

// Export functions
window.TESTIMONIES_GRID = {
  renderTestimoniesGrid,
  renderPagination,
  renderCategoryFilters,
  renderTextCard,
  renderVideoCard,
  renderAddCard,
  addGridEventListeners,
  playVideoInlineGrid
};
