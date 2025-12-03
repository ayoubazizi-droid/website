export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  notes: string; // Scent notes (e.g., "Sandalwood, Jasmine")
  color: string; // Accent color for UI
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}