import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Neon Tetra',
    scientificName: 'Paracheirodon innesi',
    price: 3.99,
    category: 'fish',
    image: 'https://images.unsplash.com/photo-1544255562-f254e43f5540?auto=format&fit=crop&q=80&w=800',
    description: 'A vibrant blue and red schooling fish, perfect for community tanks.',
    difficulty: 'Easy'
  },
  {
    id: '2',
    name: 'Betta Splendens (Koi)',
    scientificName: 'Betta splendens',
    price: 24.99,
    category: 'fish',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=800',
    description: 'Unique koi-patterned Betta fish with flowing fins and bold colors.',
    difficulty: 'Intermediate'
  },
  {
    id: '3',
    name: 'Discus Fish (Red Turquoise)',
    scientificName: 'Symphysodon',
    price: 85.00,
    category: 'fish',
    image: 'https://images.unsplash.com/photo-1627308595229-7833a5c91f1f?auto=format&fit=crop&q=80&w=800',
    description: 'The king of the aquarium. Stunning patterns and elegant circular shape.',
    difficulty: 'Advanced'
  },
  {
    id: '4',
    name: 'Anubias Nana',
    scientificName: 'Anubias barteri var. nana',
    price: 12.50,
    category: 'plants',
    image: 'https://images.unsplash.com/photo-1502472545332-e24172e7d801?auto=format&fit=crop&q=80&w=800',
    description: 'A slow-growing, hardy aquatic plant with dark green leaves.',
    difficulty: 'Easy'
  },
  {
    id: '5',
    name: 'Java Moss',
    scientificName: 'Taxiphyllum barbieri',
    price: 9.99,
    category: 'plants',
    image: 'https://images.unsplash.com/photo-1614705193499-19ec01f3747d?auto=format&fit=crop&q=80&w=800',
    description: 'Versatile moss that can attach to rocks or driftwood.',
    difficulty: 'Easy'
  },
  {
    id: '6',
    name: 'Rimless Glass Tank (30L)',
    scientificName: 'Precision Aqua',
    price: 149.99,
    category: 'equipment',
    image: 'https://images.unsplash.com/photo-1520038410233-7141f77e49aa?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-clear low-iron glass aquarium with minimalist design.',
    difficulty: 'Easy'
  }
];
