'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X, Printer, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cart.length;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-primary-700 font-extrabold text-xl tracking-tight">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Printer size={20} className="stroke-[2.5]" />
              </div>
              <span className="bg-gradient-to-r from-primary-700 to-indigo-600 bg-clip-text text-transparent">
                Print Vatika
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 font-semibold text-slate-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/catalog" className="hover:text-primary-600 transition-colors">
              Print Catalog
            </Link>
            <Link href="/track" className="hover:text-primary-600 transition-colors">
              Track Order
            </Link>
            <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-indigo-600 text-slate-500 font-medium border border-slate-200 rounded-full px-3 py-1 hover:bg-slate-50 transition-colors">
              <ShieldAlert size={14} /> Admin Portal
            </Link>

            {/* Cart Icon Bubble */}
            <Link href="/cart" className="relative p-2 bg-slate-50 rounded-full border border-slate-200 text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold animate-pulse shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative p-2 bg-slate-50 rounded-full border border-slate-200 text-slate-700">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 focus:outline-none hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 text-sm font-semibold text-slate-700">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/catalog"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              Print Catalog
            </Link>
            <Link
              href="/track"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              Track Order
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
