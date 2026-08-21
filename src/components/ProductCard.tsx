import React from 'react';
import Link from 'next/link';
import { Product } from '../types';
import { Settings } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Product Image Cover */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-slate-100">
            {product.category}
          </span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-slate-500 text-xs mt-2 leading-relaxed flex-grow">
          {product.description}
        </p>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Starting from
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              ₹{product.base_price}
              {product.slug === 'flex-banners' && <span className="text-xs font-semibold text-slate-500"> / sqft</span>}
            </span>
          </div>

          <Link
            href={`/customize/${product.slug}`}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Settings size={14} className="animate-spin-slow" />
            Customize
          </Link>
        </div>
      </div>
    </div>
  );
};
