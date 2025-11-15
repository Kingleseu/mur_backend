// ================================================
// CONFIGURATION & DATA
// ================================================

const DEFAULT_VIDEO_THUMBNAIL = 'https://images.unsplash.com/photo-1547357245-bd63d4b7c483?auto=format&fit=crop&w=800&q=60';

const TESTIMONIES = [
  {
    id: 1,
    title: "Guérison miraculeuse",
    text: "Après 5 ans de maladie...",
    fullText: "Après des années de souffrance et de traitements sans succès, j'ai décidé de remettre ma santé entre les mains de Dieu. Lors d'une soirée de prière au CMP, j'ai ressenti une chaleur intense dans mon corps. Le lendemain, en allant voir mon médecin, les examens ont révélé que ma maladie chronique avait complètement disparu. Les médecins n'en reviennent toujours pas. C'est un miracle que seul Dieu pouvait accomplir. Toute la gloire Lui revient !",
    color: 'green',
    font: 'Inter',
    author: "Marie D.",
    location: "Kinshasa, RDC",
    date: "1 nov.",
    category: "Guérison"
  },
  {
    id: 2,
    title: "Provision financière",
    text: "J'étais au chômage depuis 2 ans...",
    fullText: "Face à des difficultés financières insurmontables, j'ai choisi de faire confiance à Dieu plutôt qu'à mes propres forces. J'ai continué à payer ma dîme malgré le manque. Quelques semaines plus tard, j'ai reçu une opportunité professionnelle inespérée qui a non seulement résolu mes problèmes financiers, mais m'a aussi permis d'aider d'autres personnes dans le besoin. Sa providence est réelle !",
    color: 'yellow',
    font: 'Merriweather',
    author: "Jean-Paul K.",
    location: "Paris, France",
    date: "25 oct.",
    category: "Provision"
  },
  {
    id: 3,
    title: "Restauration familiale",
    text: "Mon mariage était brisé...",
    fullText: "Mon épouse et moi étions séparés depuis 6 mois et les papiers de divorce étaient prêts. Désespéré, j'ai commencé à prier et jeûner. Le pasteur nous a accompagnés dans un processus de guérison. Aujourd'hui, non seulement nous sommes de nouveau ensemble, mais notre amour est plus profond qu'avant. Dieu est le Dieu de la restauration !",
    color: 'pink',
    font: 'Indie Flower',
    author: "Famille Mbala",
    location: "Bruxelles, Belgique",
    date: "28 oct.",
    category: "Famille"
  },
  {
    id: 4,
    type: 'video',
    title: "Ma délivrance totale",
    thumbnail: "https://images.unsplash.com/photo-1547357245-bd63d4b7c483?w=400",
    fullText: "Témoignage vidéo de délivrance",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "2:15",
    color: 'green',
    author: "Samuel T.",
    location: "Lubumbashi, RDC",
    date: "22 oct.",
    category: "Délivrance"
  },
  {
    id: 5,
    title: "Miracle d'admission",
    text: "Mon dossier était refusé partout...",
    fullText: "J'avais raté mes examens deux années consécutives. Découragé, j'ai commencé à prier chaque matin avant d'étudier, demandant à Dieu la sagesse. Mes notes se sont améliorées progressivement. Cette année, j'ai non seulement réussi, mais j'ai obtenu une mention. Merci Seigneur pour la sagesse que tu donnes !",
    color: 'pink',
    font: 'Caveat',
    author: "Grace N.",
    location: "Montréal, Canada",
    date: "20 oct.",
    category: "Éducation"
  },
  {
    id: 6,
    title: "Protection divine",
    text: "Un accident terrible évité...",
    fullText: "Mon véhicule a fait plusieurs tonneaux sur l'autoroute. La voiture était complètement détruite. Les pompiers ont dit que personne n'aurait dû survivre à un tel accident. Mais je suis sorti sans une égratignure. Les médecins l'ont qualifié de miracle. Je sais que Dieu a envoyé ses anges pour me protéger ce jour-là.",
    color: 'yellow',
    font: 'Patrick Hand',
    author: "Daniel M.",
    location: "Goma, RDC",
    date: "18 oct.",
    category: "Protection"
  },
  {
    id: 7,
    type: 'video',
    title: "Témoignage de foi et restauration",
    thumbnail: "https://images.unsplash.com/photo-1559154352-06e29e1e11aa?w=400",
    fullText: "Témoignage vidéo de réconciliation familiale",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "3:20",
    color: 'pink',
    author: "Claire M.",
    location: "Londres, UK",
    date: "12 oct.",
    category: "Famille"
  },
  {
    id: 8,
    title: "Maternité après 12 ans",
    text: "Les médecins disaient que c'était impossible...",
    fullText: "Mariés depuis 8 ans, nous avions essayé tous les traitements de fertilité possibles sans succès. Les médecins avaient déclaré que nous ne pourrions jamais avoir d'enfants naturellement. Nous avons décidé de nous en remettre complètement à Dieu. Un an plus tard, ma femme était enceinte... de jumeaux ! Notre Dieu fait des miracles !",
    color: 'green',
    font: 'Kalam',
    author: "Couple Mutombo",
    location: "Douala, Cameroun",
    date: "15 oct.",
    category: "Famille"
  },
  {
    id: 9,
    title: "Entreprise prospère",
    text: "Mon business était en faillite...",
    fullText: "Je travaillais dans un environnement toxique qui affectait ma santé mentale et physique. J'ai prié pour une issue. En quelques semaines, j'ai reçu trois offres d'emploi différentes, toutes meilleures que ma situation actuelle. J'ai choisi celle qui alignait le mieux avec mes valeurs, et aujourd'hui je m'épanouis dans ma carrière.",
    color: 'yellow',
    font: 'Permanent Marker',
    author: "Christelle B.",
    location: "Genève, Suisse",
    date: "10 oct.",
    category: "Provision"
  },
  {
    id: 10,
    title: "Libération spirituelle",
    text: "J'étais tourmenté par des cauchemars...",
    fullText: "Pendant des années, j'étais tourmenté par des cauchemars et des peurs inexplicables. Ma vie était paralysée par l'anxiété. Lors d'une session de délivrance au CMP, j'ai ressenti une paix profonde m'envahir. Depuis ce jour, je dors paisiblement et je vis dans la liberté que Christ offre. Gloire à Dieu !",
    color: 'pink',
    font: 'Shadows Into Light',
    author: "André M.",
    location: "Abidjan, Côte d'Ivoire",
    date: "5 oct.",
    category: "Délivrance"
  },
  {
    id: 11,
    type: 'video',
    title: "Miracle de famille restaurée",
    thumbnail: "https://images.unsplash.com/photo-1577897113176-6888367369bf?w=400",
    fullText: "Témoignage vidéo de famille restaurée",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1:55",
    color: 'yellow',
    author: "Famille Nsiona",
    location: "Yaoundé, Cameroun",
    date: "8 oct.",
    category: "Famille"
  },
  {
    id: 12,
    title: "Guérison émotionnelle",
    text: "La dépression me consumait...",
    fullText: "Après la perte de mon enfant, je suis tombé dans une dépression profonde. Rien ne semblait avoir de sens. À l'église, j'ai rencontré des personnes qui ont prié avec moi et m'ont accompagné. Progressivement, Dieu a guéri mon cœur brisé. Aujourd'hui, je peux témoigner de Sa fidélité même dans la douleur.",
    color: 'green',
    font: 'Inter',
    author: "Rachel T.",
    location: "Lomé, Togo",
    date: "2 oct.",
    category: "Guérison"
  }
];

const CATEGORIES = [
  "Tous",
  "Vidéos",
  "Guérison",
  "Provision",
  "Famille",
  "Délivrance",
  "Éducation",
  "Protection"
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
  { name: 'Pêche', value: '#FFE0B2', border: '#FFCC80' },
  { name: 'Bleu Ciel', value: '#E3F2FD', border: '#BBDEFB' },
  { name: 'Corail', value: '#FFE0E0', border: '#FFCDD2' },
  { name: 'Menthe Claire', value: '#E0F7FA', border: '#B2EBF2' }
];

const FONT_STYLES = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Indie Flower', value: 'Indie Flower, cursive' },
  { name: 'Caveat', value: 'Caveat, cursive' },
  { name: 'Patrick Hand', value: 'Patrick Hand, cursive' },
  { name: 'Kalam', value: 'Kalam, cursive' },
  { name: 'Permanent Marker', value: 'Permanent Marker, cursive' },
  { name: 'Shadows Into Light', value: 'Shadows Into Light, cursive' }
];

const ITEMS_PER_PAGE = 9;

// Export pour utilisation globale
window.CONFIG = {
  TESTIMONIES,
  CATEGORIES,
  COLOR_MAP,
  POST_IT_COLORS,
  FONT_STYLES,
  ITEMS_PER_PAGE,
  DEFAULT_VIDEO_THUMBNAIL
};
