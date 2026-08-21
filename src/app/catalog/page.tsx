import React from 'react';
import { DbClient } from '../../lib/db';
import { ProductCard } from '../../components/ProductCard';
import { Grid, Sparkles } from 'lucide-react';

export const revalidate = 0; // Fresh data on each load

export default async function CatalogPage() {
  const products = await DbClient.getProducts();

  // Deduplicate categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles size={10} /> Print Vatika
          </span>
          <h1 className="font-serif text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Print Product Catalog
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Select a commercial printing product below to configure size specifications, upload your graphic designs, and view custom price breaks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 rounded-lg px-3 py-1.5 self-start">
          <Grid size={14} />
          <span>{products.length} Products Available</span>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-500 font-medium">No products found in the catalog.</p>
        </div>
      )}
    </div>
  );
}
