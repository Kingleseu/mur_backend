// ================================================
// CONFIGURATION (LES TÉMOIGNAGES VIENNENT DU BACKEND)
// ================================================

(function initConfig() {
  const config = window.CONFIG || {};

  const CATEGORIES = [
     "Tous",
      "Vidéos",
      "Guérison",
      "Provision",
      "Famille",
      "Délivrance",
      "Éducation",
      "Protection",
      "Autre"
  ];

  const COLOR_MAP = {
    yellow: '#FFF6D9',
    pink: '#FFE5E5',
    green: '#E4FFEB'
  };

  const POST_IT_COLORS = [
    { name: 'Jaune Doux', value: '#FFF6D9', border: '#F5D693' },
    { name: 'Rose Clair', value: '#FFE5E5', border: '#FFD6DC' },
    { name: 'Vert Menthe', value: '#E4FFEB', border: '#B8E6C3' },
    { name: 'Lavande', value: '#F3E5F5', border: '#E1BEE7' },
    { name: 'PǦche', value: '#FFE0B2', border: '#FFCC80' },
    { name: 'Bleu Ciel', value: '#E3F2FD', border: '#BBDEFB' },
    { name: 'Corail', value: '#FFE0E0', border: '#FFCDD2' },
    { name: 'Menthe Claire', value: '#E0F7FA', border: '#B2EBF2' }
  ];

  const FONT_STYLES = [
    { name: 'Sans-serif', value: 'Inter, sans-serif' },
    { name: 'Serif', value: 'Merriweather, serif' },
    { name: 'Indie Flower', value: 'Indie Flower, cursive' },
    { name: 'Caveat', value: 'Caveat, cursive' },
    { name: 'Patrick Hand', value: 'Patrick Hand, cursive' },
    { name: 'Kalam', value: 'Kalam, cursive' },
    { name: 'Permanent Marker', value: 'Permanent Marker, cursive' },
    { name: 'Shadows Into Light', value: 'Shadows Into Light, cursive' }
  ];

  config.TESTIMONIES = Array.isArray(config.TESTIMONIES) ? config.TESTIMONIES : [];
  config.CATEGORIES = config.CATEGORIES || CATEGORIES;
  config.COLOR_MAP = config.COLOR_MAP || COLOR_MAP;
  config.POST_IT_COLORS = config.POST_IT_COLORS || POST_IT_COLORS;
  config.FONT_STYLES = config.FONT_STYLES || FONT_STYLES;
  config.ITEMS_PER_PAGE = config.ITEMS_PER_PAGE || 9;

  window.CONFIG = config;
})();
