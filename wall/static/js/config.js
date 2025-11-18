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

  // Mots-clés pour l'autocatégorisation (normalisés sans accents)
  const CATEGORY_KEYWORDS = {
    "Guérison": [
      "gueri", "gueris", "guéri", "guérison", "heal", "sante", "santé", "maladie", "malade",
      "douleur", "operation", "chirurgie", "miracle", "fibrome", "fibromes", "kyste", "kystes",
      "ulcere", "ulcère", "infection", "infections", "virus", "palud", "paludisme", "cancer",
      "diabete", "diabète", "sida", "vih"
    ],
    "Provision": [
      "job", "emploi", "travail", "embauche", "recrut", "contrat", "cdi", "cdd",
      "business", "financ", "provision", "faveur", "bourse", "augmentation", "prime",
      "facture", "loyer", "dette", "rembourse", "appel d'offres", "commande", "client"
    ],
    "Famille": [
      "famille", "mariage", "conjoint", "époux", "épouse", "enfant", "grossesse", "naissance",
      "fiançailles", "fiancailles", "union", "reconciliation", "reconcil", "restauration"
    ],
    "Délivrance": [
      "delivr", "délivr", "libere", "libéré", "chaine", "oppression", "sorcellerie", "marabout",
      "esprit", "possession", "attaque", "rejet", "blocage", "malédiction", "incube", "succube"
    ],
    "Éducation": [
      "etude", "étude", "ecole", "école", "scolair", "classe", "examen", "concours", "univers",
      "facult", "licenc", "master", "doctorat", "memoire", "mémoire", "these", "thèse", "bourse", "stage"
    ],
    "Protection": [
      "protege", "protégé", "protection", "sauve", "sauvetage", "evite", "évit", "echappe",
      "accident", "collision", "crash", "agression", "attaque", "braquage", "vol", "kidnap",
      "incendie", "feu", "inondation", "danger", "risque"
    ]
  };

  config.TESTIMONIES = Array.isArray(config.TESTIMONIES) ? config.TESTIMONIES : [];
  config.CATEGORIES = config.CATEGORIES || CATEGORIES;
  config.CATEGORY_KEYWORDS = config.CATEGORY_KEYWORDS || CATEGORY_KEYWORDS;
  config.COLOR_MAP = config.COLOR_MAP || COLOR_MAP;
  config.POST_IT_COLORS = config.POST_IT_COLORS || POST_IT_COLORS;
  config.FONT_STYLES = config.FONT_STYLES || FONT_STYLES;
  config.ITEMS_PER_PAGE = config.ITEMS_PER_PAGE || 9;

  window.CONFIG = config;
})();
