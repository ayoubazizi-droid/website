import React, { useState } from 'react';
import { ShoppingCart, Star, Shield, ArrowRight, Trash2, Plus, Minus, Gem } from 'lucide-react';
import { Scene3D } from './components/Scene3D';
import { ChatInterface } from './components/ChatInterface';
import { Product, CartItem } from './types';

// Perfume Data
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Midnight Rose',
    price: 125,
    description: 'A deep, mysterious blend capturing the essence of a blooming garden under the moonlight. The signature vessel holds the secret to eternal elegance.',
    notes: 'Black Rose, Oud, Vanilla, Patchouli',
    color: '#be123c', // Rose Red
  },
  {
    id: '2',
    name: 'Oceanic Drift',
    price: 98,
    description: 'Crisp and refreshing, like a cool breeze over the Atlantic. Encased in our classic glass silhouette, it brings clarity to the mind.',
    notes: 'Sea Salt, Bergamot, Driftwood, White Musk',
    color: '#0ea5e9', // Sky Blue
  },
  {
    id: '3',
    name: 'Golden Amber',
    price: 150,
    description: 'Warm, resinous, and inviting. This fragrance wraps you in a blanket of luxury. The bottle refracts light like a precious gem.',
    notes: 'Amber, Honey, Cinnamon, Tobacco',
    color: '#d97706', // Amber/Gold
  },
  {
    id: '4',
    name: 'Verdant Vetiver',
    price: 110,
    description: 'Earthy and grounded. A sophisticated choice for those who walk their own path. Presented in our iconic crystal form.',
    notes: 'Vetiver, Green Tea, Cedar, Moss',
    color: '#059669', // Emerald Green
  },
  {
    id: '5',
    name: 'Noir Absolu',
    price: 185,
    description: 'Intense and unforgettable. A fragrance for the bold. The darkness of the scent contrasts with the clarity of the glass.',
    notes: 'Black Pepper, Leather, Incense, Dark Chocolate',
    color: '#475569', // Slate/Black
  }
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-rose-500 selection:text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gem className="w-8 h-8 text-rose-500" />
            <span className="text-2xl font-light tracking-widest">LUXE <span className="font-semibold text-rose-500">ESSENCE</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 hover:bg-neutral-800 rounded-full transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 text-neutral-300 group-hover:text-white" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left: 3D Preview (Sticky on desktop, Centered on mobile) */}
          <div className="lg:sticky lg:top-28 space-y-8 flex flex-col items-center w-full">
            <div className="h-[500px] sm:h-[600px] w-full relative group shadow-2xl shadow-rose-900/10 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent pointer-events-none" />
              <Scene3D product={selectedProduct} />
            </div>
            
            <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 backdrop-blur-sm w-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-light text-white mb-2 tracking-wide">{selectedProduct.name}</h1>
                  <p className="text-rose-400 font-mono text-xl">${selectedProduct.price}</p>
                </div>
                <div className="flex gap-2">
                   <div 
                      className="w-8 h-8 rounded-full border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
                      style={{ backgroundColor: selectedProduct.color }} 
                   />
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <h3 className="text-sm uppercase tracking-widest text-neutral-500 font-semibold">Fragrance Notes</h3>
                <p className="text-neutral-300 italic font-serif text-lg">
                  {selectedProduct.notes}
                </p>
              </div>
              
              <p className="text-neutral-400 leading-relaxed mb-8 font-light">
                {selectedProduct.description}
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => addToCart(selectedProduct)}
                  className="flex-1 bg-white hover:bg-rose-50 text-neutral-900 font-semibold py-4 px-6 rounded-none transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Bag
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product List */}
          <div className="space-y-10 pt-4 w-full">
            <div className="flex items-center gap-2 text-neutral-500 mb-6 border-b border-neutral-800 pb-4">
              <Star className="w-4 h-4 text-rose-500" />
              <span className="uppercase tracking-[0.2em] text-xs font-semibold">Signature Collection</span>
            </div>

            <div className="grid gap-6">
              {PRODUCTS.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`group relative p-6 rounded-xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                    selectedProduct.id === product.id
                      ? 'bg-neutral-800/80 border-rose-900/50 shadow-lg shadow-rose-900/10' 
                      : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-6">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden"
                        style={{ backgroundColor: `${product.color}15` }}
                      >
                         <div 
                           className="absolute inset-0 opacity-20"
                           style={{ backgroundColor: product.color }}
                         />
                         <span className="font-serif text-2xl opacity-50" style={{ color: product.color }}>
                            {product.name.charAt(0)}
                         </span>
                      </div>
                      <div>
                        <h3 className={`text-lg font-light tracking-wide transition-colors ${selectedProduct.id === product.id ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
                          {product.name}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">{product.notes.split(',')[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-mono text-neutral-400">${product.price}</span>
                      <ArrowRight className={`w-5 h-5 text-rose-500 transition-all duration-500 ${selectedProduct.id === product.id ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                    </div>
                  </div>
                  {/* Selection Indicator */}
                  {selectedProduct.id === product.id && (
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-rose-700" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 rounded-none bg-neutral-900 border border-neutral-800/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
               <div className="flex items-start gap-5 relative z-10">
                 <div className="p-3 bg-rose-500/10 rounded-full text-rose-500">
                   <Shield className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-white mb-2 tracking-wide uppercase text-sm">Authenticity Guaranteed</h3>
                   <p className="text-sm text-neutral-400 leading-relaxed font-light">
                     Every bottle is batch-coded and verified directly from our master perfumery in Grasse, France. 
                     We ensure optimal storage conditions during transport to preserve the integrity of the top notes.
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-neutral-950 border-l border-neutral-800 shadow-2xl transform transition-transform duration-300">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
                <h2 className="text-lg font-light text-white flex items-center gap-3 tracking-widest uppercase">
                  <ShoppingCart className="w-4 h-4 text-rose-500" />
                  Your Bag
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-6">
                    <Gem className="w-16 h-16 text-neutral-800" />
                    <p className="font-light tracking-wide">Your collection is empty.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-rose-400 hover:text-rose-300 text-sm border-b border-rose-500/30 pb-1"
                    >
                      Explore Fragrances
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-neutral-900/50 p-4 border border-neutral-800">
                      <div 
                         className="w-20 h-20 flex items-center justify-center flex-shrink-0 bg-neutral-800"
                      >
                         <div className="w-8 h-8 rounded-full opacity-50" style={{ backgroundColor: item.color }} />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium text-white tracking-wide">{item.name}</h3>
                            <span className="font-mono text-neutral-300">${item.price * item.quantity}</span>
                          </div>
                          <p className="text-xs text-neutral-500 mb-3">${item.price} each</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="hover:text-white text-neutral-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="hover:text-white text-neutral-500 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-600 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-neutral-900 border-t border-neutral-800">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-neutral-400 uppercase tracking-widest text-xs">Subtotal</span>
                    <span className="text-2xl font-light text-white">${cartTotal}</span>
                  </div>
                  <button className="w-full bg-white hover:bg-rose-50 text-neutral-900 font-bold py-4 transition-all uppercase tracking-widest text-xs">
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* AI Assistant */}
      <ChatInterface currentProduct={selectedProduct} />
    </div>
  );
}

// Icon helper
function X(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18"/><path d="m6 6 18 18"/>
    </svg>
  );
}