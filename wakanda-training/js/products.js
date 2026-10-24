/**
 * Wakanda Training — default product catalog + delivery zones
 * Used as fallback when remote catalog.json is unavailable.
 * Admin publishes overrides to Cloudinary; public site merges:
 *   localStorage drafts → remote catalog → these defaults
 */
window.WT_DEFAULTS = {
  updatedAt: null,
  products: [
    {
      id: 'tshirt-amarela',
      name: 'T-shirt Athlete Amarela',
      name_en: 'Athlete T-shirt Yellow',
      description: 'Energia, vitalidade e foco. Tecido poliéster microperfurado.',
      description_en: 'Energy, vitality and focus. Micro-perforated polyester fabric.',
      price: 18000,
      category: 'apparel',
      image: 'images/tshirt-amarela-athlete.jpg',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      active: true,
      order: 1
    },
    {
      id: 'tshirt-preta',
      name: 'T-shirt Athlete Preta',
      name_en: 'Athlete T-shirt Black',
      description: 'Elegância, poder e atitude. Mesma qualidade técnica.',
      description_en: 'Elegance, power and attitude. Same technical quality.',
      price: 18000,
      category: 'apparel',
      image: 'images/tshirt-preta-athlete.jpg',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      active: true,
      order: 2
    },
    {
      id: 'banda-45',
      name: 'Banda Elástica 45 mm',
      name_en: 'Resistance Band 45 mm',
      description: 'Verde • Semperfit',
      description_en: 'Green • Semperfit',
      price: 30000,
      category: 'accessories',
      image: 'images/banda-45mm-verde.jpg',
      sizes: null,
      active: true,
      order: 3
    },
    {
      id: 'banda-32',
      name: 'Banda Elástica 32 mm',
      name_en: 'Resistance Band 32 mm',
      description: 'Roxa • Semperfit',
      description_en: 'Purple • Semperfit',
      price: 23000,
      category: 'accessories',
      image: 'images/banda-32mm-roxa.jpg',
      sizes: null,
      active: true,
      order: 4
    },
    {
      id: 'banda-22',
      name: 'Banda Elástica 22 mm',
      name_en: 'Resistance Band 22 mm',
      description: 'Preta • Semperfit',
      description_en: 'Black • Semperfit',
      price: 14000,
      category: 'accessories',
      image: 'images/banda-22mm-preta.jpg',
      sizes: null,
      active: true,
      order: 5
    },
    {
      id: 'banda-13',
      name: 'Banda Elástica 13 mm',
      name_en: 'Resistance Band 13 mm',
      description: 'Vermelha • Semperfit',
      description_en: 'Red • Semperfit',
      price: 10000,
      category: 'accessories',
      image: 'images/banda-13mm-vermelha.jpg',
      sizes: null,
      active: true,
      order: 6
    },
    {
      id: 'grip-glove',
      name: 'Grip Glove',
      name_en: 'Grip Glove',
      description: 'Luvas de grip para levantamento e CrossFit.',
      description_en: 'Grip gloves for lifting and CrossFit.',
      price: 25000,
      category: 'accessories',
      image: 'images/grip-glove.jpg',
      sizes: null,
      active: true,
      order: 7
    },
    {
      id: 'ligadura',
      name: 'Ligadura de Pulso',
      name_en: 'Wrist Wrap',
      description: 'Suporte e estabilidade para o pulso.',
      description_en: 'Support and stability for the wrist.',
      price: 6000,
      category: 'accessories',
      image: 'images/ligadura-pulso.jpg',
      sizes: null,
      active: true,
      order: 8
    },
    {
      id: 'jump-rope',
      name: 'Speed Jump Rope',
      name_en: 'Speed Jump Rope',
      description: 'Corda de salto rápida para treino de alta intensidade.',
      description_en: 'Speed jump rope for high-intensity training.',
      price: 20000,
      category: 'accessories',
      image: 'images/jump-rope.jpg',
      sizes: null,
      active: true,
      order: 9
    }
  ],
  zones: [
    { name: 'Benfica / Kikolo', price: 0 },
    { name: 'Talatona', price: 2000 },
    { name: 'Luanda Sul', price: 2500 },
    { name: 'Viana', price: 3000 },
    { name: 'Cacuaco', price: 3500 }
  ],
  texts: {
    pt: {},
    en: {}
  },
  images: {
    // keys match data-site-img / data-site-img-bg attributes
    'hero-loja': 'images/modalidades-hero.jpg',
    'modalidades-hero': 'images/modalidades-hero.jpg'
  }
};

// Convenience aliases used by older code paths
window.PRODUCTS = window.WT_DEFAULTS.products;
window.DELIVERY_ZONES = window.WT_DEFAULTS.zones;
