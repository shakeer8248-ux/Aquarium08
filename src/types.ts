export interface Product {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  category: 'fish' | 'plants' | 'equipment';
  image: string;
  description: string;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerUid: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

