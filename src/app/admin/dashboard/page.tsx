'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Order, Product, ProductOption, PricingRule, OrderStatus, PaymentStatus } from '../../../types';
import {
  Printer,
  ShoppingBag,
  TrendingUp,
  Clock,
  ShieldCheck,
  Search,
  Sliders,
  DollarSign,
  Download,
  Notebook,
  RefreshCw,
  LogOut,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Info,
  CheckCircle,
  Truck,
  Building,
  User,
  Settings,
  X,
  Loader2,
  Phone
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // Tab Management
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'pricing'>('orders');
  
  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('business-cards');
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Order for Details View Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Edit Pricing states
  const [editingBasePrices, setEditingBasePrices] = useState<Record<string, number>>({});
  const [isSavingPrice, setIsSavingPrice] = useState(false);

  // Authentication check & Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch options when product selected in pricing tab changes
  useEffect(() => {
    if (activeTab === 'pricing') {
      fetchProductPricingConfigs(selectedProductSlug);
    }
  }, [activeTab, selectedProductSlug]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Fetch Orders from Admin API
      const ordersRes = await fetch('/api/admin/orders');
      if (ordersRes.status === 401) {
        // Redirect to admin login if cookie check fails
        router.push('/admin/login');
        return;
      }
      if (!ordersRes.ok) throw new Error('Failed to load orders.');
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      // 2. Fetch Products
      const productsRes = await fetch('/api/orders/products'); // public endpoint or standard catalog query
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
        // Sync editing base prices state
        const initialPrices: Record<string, number> = {};
        productsData.forEach((p: Product) => {
          initialPrices[p.slug] = p.base_price;
        });
        setEditingBasePrices(initialPrices);
      }
    } catch (e: any) {
      setError(e.message || 'Error syncing data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  const fetchProductPricingConfigs = async (slug: string) => {
    try {
      const res = await fetch(`/api/orders/products?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setProductOptions(data.options || []);
        setPricingRules(data.rules || []);
      }
    } catch (err) {
      console.error('Error fetching product pricing', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) {
      console.error(e);
    }
  };

  // Status updates PUT handler
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          orderStatus: nextStatus,
          notes: statusUpdateNote || `Order status updated to ${nextStatus}`
        })
      });

      if (!res.ok) throw new Error('Status update failed.');
      
      const data = await res.json();
      
      // Update local orders list state
      setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
      setSelectedOrder(data.order);
      setStatusUpdateNote('');
      alert(`Order status updated to ${nextStatus}. Customer has been notified.`);
    } catch (e: any) {
      alert(e.message || 'Failed to update order.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Modify base price PUT handler
  const handleUpdateBasePrice = async (slug: string) => {
    setIsSavingPrice(true);
    const basePrice = editingBasePrices[slug];
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updatePrice',
          slug,
          basePrice
        })
      });
      if (res.ok) {
        alert('Base price updated in press database.');
        fetchDashboardData();
      } else {
        alert('Failed to save price.');
      }
    } catch (err) {
      alert('Network failure saving price.');
    } finally {
      setIsSavingPrice(false);
    }
  };

  // Toggle active product PUT handler
  const handleToggleProductActive = async (slug: string) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggleActive',
          slug
        })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Option Modifiers submit PUT handler
  const handleSaveOptionModifiers = async () => {
    setIsSavingPrice(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedProductSlug,
          options: productOptions,
          rules: pricingRules
        })
      });
      if (res.ok) {
        alert('Custom pricing rules and modifiers saved successfully.');
        fetchProductPricingConfigs(selectedProductSlug);
      } else {
        alert('Failed to save options.');
      }
    } catch (e) {
      alert('Error saving modifications.');
    } finally {
      setIsSavingPrice(false);
    }
  };

  // Statistics Computations
  const stats = {
    totalOrders: orders.length,
    todayOrders: orders.filter(o => o.created_at.startsWith(new Date().toISOString().split('T')[0])).length,
    pendingCount: orders.filter(o => o.order_status === 'PAYMENT_PENDING' || o.order_status === 'PAID' || o.order_status === 'CONFIRMED').length,
    printingCount: orders.filter(o => o.order_status === 'PRINTING').length,
    revenue: orders.filter(o => o.payment_status === 'PAID').reduce((sum, o) => sum + o.total_amount, 0),
    deliveredCount: orders.filter(o => o.order_status === 'DELIVERED').length
  };

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'ALL' || o.order_status === statusFilter;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="animate-spin text-primary-600" size={40} />
        <span className="text-sm text-slate-500 font-semibold">Syncing Press Operations Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Navbar Brand */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 text-white p-2.5 rounded-2xl shadow-md">
            <Printer size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Admin Console</h1>
            <span className="text-slate-400 text-xs font-semibold">Print Vatika (Jaipur Hub)</span>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-slate-600 border border-slate-200 rounded-xl px-3.5 py-2 hover:bg-slate-50 text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh Press Data
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-red-600 border border-red-200 hover:bg-red-50 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <LogOut size={14} />
            Logout Session
          </button>
        </div>
      </div>

      {/* Tabs selectors */}
      <div className="flex border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-500 space-x-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3.5 border-b-2 transition-all ${activeTab === 'orders' ? 'border-primary-600 text-primary-700' : 'border-transparent hover:text-slate-700'}`}
        >
          Orders Queue ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3.5 border-b-2 transition-all ${activeTab === 'products' ? 'border-primary-600 text-primary-700' : 'border-transparent hover:text-slate-700'}`}
        >
          Product Catalog Catalog
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-3.5 border-b-2 transition-all ${activeTab === 'pricing' ? 'border-primary-600 text-primary-700' : 'border-transparent hover:text-slate-700'}`}
        >
          Pricing Configurator
        </button>
      </div>

      {activeTab === 'orders' && (
        <>
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Orders Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Orders</span>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-slate-900">{stats.totalOrders}</span>
                <ShoppingBag className="text-primary-500 shrink-0" size={20} />
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Press Revenue</span>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-slate-900">₹{stats.revenue.toLocaleString('en-IN')}</span>
                <TrendingUp className="text-emerald-500 shrink-0" size={20} />
              </div>
            </div>

            {/* Pending Verification Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Queue Pending</span>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-slate-900">{stats.pendingCount}</span>
                <Clock className="text-amber-500 shrink-0" size={20} />
              </div>
            </div>

            {/* Currently Printing Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">On Press Plates</span>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-slate-900">{stats.printingCount}</span>
                <Printer className="text-indigo-500 shrink-0" size={20} />
              </div>
            </div>
          </div>

          {/* MAIN ORDERS TABLE LIST & FILTER CONTROLS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full sm:max-w-xs">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search order id, customer name..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 self-end sm:self-auto overflow-x-auto max-w-full pb-1 sm:pb-0">
                {['ALL', 'PAYMENT_PENDING', 'CONFIRMED', 'PRINTING', 'READY', 'DELIVERED', 'CANCELLED'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all shrink-0 ${
                      statusFilter === filter
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table Grid */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                    <th className="p-4">OrderID</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Fulfillment</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Printing Progress</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{o.id}</td>
                        <td className="p-4 font-semibold text-slate-900">
                          <div>{o.customer_name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{o.customer_phone}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 font-bold text-[9px] px-2 py-0.5 rounded capitalize ${o.fulfillment_type === 'delivery' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                            {o.fulfillment_type === 'delivery' ? <Truck size={10} /> : <Building size={10} />}
                            {o.fulfillment_type}
                          </span>
                        </td>
                        <td className="p-4 font-extrabold text-slate-950">₹{o.total_amount.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded ${o.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {o.payment_status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            o.order_status === 'DELIVERED' || o.order_status === 'READY'
                              ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100'
                              : o.order_status === 'CANCELLED'
                              ? 'bg-red-50 text-red-700 border border-red-150'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-150 animate-pulse'
                          }`}>
                            {o.order_status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold px-3 py-1.5 rounded-lg border border-primary-150 transition-all text-[10px]"
                          >
                            Manage Order
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">
                        No orders in queue matching parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Catalog Visibility & Core Surcharges</h2>
              <p className="text-slate-400 text-xs">Configure base item pricing values</p>
            </div>
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <Info size={12} /> Click check toggle to show/hide products
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(p => (
              <div key={p.id} className="border border-slate-200 rounded-2xl p-4 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={p.image_url} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="overflow-hidden">
                    <span className="font-bold text-slate-900 text-sm block truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Price input */}
                  <div className="flex items-center border border-slate-200 bg-white rounded-xl px-2.5 py-1">
                    <span className="text-slate-400 font-semibold text-xs pr-1">₹</span>
                    <input
                      type="number"
                      step="0.1"
                      value={editingBasePrices[p.slug] || 0}
                      onChange={e => setEditingBasePrices(prev => ({ ...prev, [p.slug]: parseFloat(e.target.value) || 0 }))}
                      className="w-16 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                    <button
                      onClick={() => handleUpdateBasePrice(p.slug)}
                      disabled={isSavingPrice}
                      className="text-primary-600 hover:text-primary-700 font-bold text-[10px] pl-2 border-l border-slate-100"
                    >
                      Save
                    </button>
                  </div>

                  {/* Active Toggle */}
                  <button
                    onClick={() => handleToggleProductActive(p.slug)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {p.is_active ? (
                      <ToggleRight size={28} className="text-emerald-500" />
                    ) : (
                      <ToggleLeft size={28} className="text-slate-300" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Custom pricing rules & Option Modifiers</h2>
              <p className="text-slate-400 text-xs">Modify select values and discount tiers</p>
            </div>
            
            {/* Select Product */}
            <select
              value={selectedProductSlug}
              onChange={e => setSelectedProductSlug(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {products.map(p => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Pricing configurations forms */}
          {productOptions.length > 0 ? (
            <div className="space-y-6">
              {productOptions.map((opt, optIdx) => {
                if (opt.type !== 'select') return null;
                
                return (
                  <div key={opt.id} className="border border-slate-150 rounded-2xl p-4 bg-slate-50/20 space-y-3">
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block border-b pb-2">
                      Option: {opt.display_name} ({opt.name})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {opt.options_json.map((choice, choiceIdx) => (
                        <div key={choice.value} className="flex justify-between items-center border border-slate-200 rounded-xl p-3 bg-white">
                          <span className="text-xs font-bold text-slate-800">{choice.label}</span>
                          
                          <div className="flex items-center border rounded-lg px-2 py-1 bg-slate-50">
                            <span className="text-[10px] text-slate-400 font-semibold pr-1">₹</span>
                            <input
                              type="number"
                              value={choice.price_modifier || 0}
                              onChange={e => {
                                const val = parseFloat(e.target.value) || 0;
                                setProductOptions(prev => {
                                  const copy = [...prev];
                                  copy[optIdx].options_json[choiceIdx].price_modifier = val;
                                  return copy;
                                });
                              }}
                              className="w-16 text-xs text-right font-extrabold bg-transparent focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Volume tiers */}
              {pricingRules.length > 0 && (
                <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/20 space-y-3">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block border-b pb-2">
                    Bulk Discounts & Quantity Tier Rules
                  </span>

                  <div className="space-y-3">
                    {pricingRules.map((rule, ruleIdx) => (
                      <div key={rule.id} className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-white text-xs font-semibold">
                        <span className="text-slate-800 uppercase font-bold">
                          If {rule.option_key} exceeds {rule.tier_min_qty}
                        </span>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-medium">Apply Discount Factor:</span>
                          <input
                            type="number"
                            step="0.05"
                            min="0.5"
                            max="1.0"
                            value={rule.tier_discount_factor}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 1.0;
                              setPricingRules(prev => {
                                const copy = [...prev];
                                copy[ruleIdx].tier_discount_factor = val;
                                return copy;
                              });
                            }}
                            className="w-16 border rounded-lg px-2 py-1 text-xs text-center font-extrabold focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                          <span className="text-[10px] text-emerald-600 font-bold">
                            ({Math.round((1 - rule.tier_discount_factor) * 100)}% off)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save changes */}
              <button
                onClick={handleSaveOptionModifiers}
                disabled={isSavingPrice}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-xs"
              >
                Save Option Pricing Modifications
              </button>
            </div>
          ) : (
            <p className="text-slate-400 text-xs">No select choices configurable for this specialty product.</p>
          )}
        </div>
      )}

      {/* DETAIL MODAL OVERLAY: MANAGE ORDER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Modal close */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg"
            >
              <X size={18} />
            </button>

            {/* Header info */}
            <div className="border-b pb-4 pr-8 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider block w-fit mb-1.5">
                  Order Management
                </span>
                <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
                  Order ID: {selectedOrder.id}
                </h3>
                <span className="text-slate-400 text-xs font-medium">Placed on: {new Date(selectedOrder.created_at).toLocaleString()}</span>
              </div>

              {/* Delivery badge */}
              <div className="sm:text-right shrink-0">
                <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-3 py-1 rounded-full uppercase border ${
                  selectedOrder.fulfillment_type === 'delivery' 
                    ? 'bg-blue-50 text-blue-700 border-blue-100' 
                    : 'bg-orange-50 text-orange-700 border-orange-100'
                }`}>
                  {selectedOrder.fulfillment_type === 'delivery' ? <Truck size={12} /> : <Building size={12} />}
                  {selectedOrder.fulfillment_type}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
              {/* Left detail grid */}
              <div className="lg:col-span-7 space-y-6">
                {/* Customer specs */}
                <div className="space-y-3">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block border-b pb-1">Customer Profile</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-600">
                      <User size={14} className="text-slate-400" />
                      <span>{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-slate-600">
                      <Phone size={14} className="text-slate-400" />
                      <span>{selectedOrder.customer_phone}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-slate-600 sm:col-span-2">
                      <Notebook size={14} className="text-slate-400" />
                      <span>{selectedOrder.customer_email}</span>
                    </div>
                  </div>
                </div>

                {/* Fulfillment specifics */}
                {selectedOrder.fulfillment_type === 'delivery' && (
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block border-b pb-1">Delivery Address</span>
                    <p className="text-slate-500 text-xs leading-normal">
                      {selectedOrder.delivery_address}, {selectedOrder.delivery_city}, {selectedOrder.delivery_state} - {selectedOrder.delivery_pincode}
                    </p>
                  </div>
                )}

                {/* Items and files list */}
                <div className="space-y-4">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block border-b pb-1">Items Configured</span>
                  
                  {selectedOrder.items?.map((item, i) => (
                    <div key={item.id} className="border border-slate-150 rounded-2xl p-4 space-y-3.5">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{item.product_name}</h4>
                          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Quantity: {item.quantity} units</span>
                        </div>
                        <span className="font-bold text-slate-900 text-xs">₹{item.total_price.toFixed(2)}</span>
                      </div>

                      {/* Display configured choices */}
                      <div className="flex flex-wrap gap-1 text-[9px]">
                        {Object.entries(item.selected_options).map(([k, v]) => (
                          <span key={k} className="bg-slate-100 text-slate-600 border border-slate-150 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {k}: {v}
                          </span>
                        ))}
                      </div>

                      {/* Files assets */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {/* Preview proof thumbnail */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden p-2 text-center bg-slate-50">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Visual Preview proof</span>
                          <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden border border-slate-100 relative">
                            {item.preview_file_url ? (
                              <img src={item.preview_file_url} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[9px] text-slate-400 font-medium absolute inset-0 flex items-center justify-center">No preview available</span>
                            )}
                          </div>
                        </div>

                        {/* Original Print File download */}
                        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col justify-between items-center text-center">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Print-Ready File</span>
                            <span className="text-[10px] font-bold text-slate-700 line-clamp-2 leading-tight">
                              {item.product_slug}-design-raw.png
                            </span>
                          </div>
                          
                          {item.original_file_url ? (
                            <a
                              href={item.original_file_url}
                              download={`${item.product_slug}-order-${selectedOrder.id}-design`}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-[10px] shadow-sm flex items-center justify-center gap-1 mt-3"
                            >
                              <Download size={12} />
                              Download Design File
                            </a>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-semibold bg-slate-200 px-3 py-1.5 rounded-lg mt-3 w-full block">
                              No upload (custom print)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: State actions panel */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-5 h-fit">
                {/* Price break */}
                <div className="border-b pb-4 text-xs font-semibold text-slate-500 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Order Subtotal:</span>
                    <span className="text-slate-800">₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping charge:</span>
                    <span className="text-slate-800">{selectedOrder.delivery_charge > 0 ? `₹${selectedOrder.delivery_charge.toFixed(2)}` : 'FREE'}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 border-t pt-2 mt-1 text-sm">
                    <span>Paid Amount:</span>
                    <span>₹{selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payments */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-700 block">Transaction Reference</span>
                  <div className="bg-white border rounded-xl p-3 text-[10px] space-y-1">
                    <div>
                      <span className="text-slate-400 font-semibold uppercase pr-1.5">Status:</span>
                      <span className={`font-extrabold ${selectedOrder.payment_status === 'PAID' ? 'text-emerald-600' : 'text-red-500'}`}>{selectedOrder.payment_status}</span>
                    </div>
                    {selectedOrder.payment_id && (
                      <div>
                        <span className="text-slate-400 font-semibold uppercase pr-1.5">Txn ID:</span>
                        <span className="font-mono text-slate-700">{selectedOrder.payment_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Change status control */}
                <div className="space-y-3">
                  <span className="font-bold text-slate-700 text-xs block">Update Printing Status</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                    {[
                      { status: 'PAID', color: 'bg-indigo-600 text-white' },
                      { status: 'CONFIRMED', color: 'bg-blue-600 text-white' },
                      { status: 'PRINTING', color: 'bg-purple-600 text-white' },
                      { status: 'READY', color: 'bg-amber-600 text-white' },
                      { status: 'OUT_FOR_DELIVERY', color: 'bg-cyan-600 text-white' },
                      { status: 'DELIVERED', color: 'bg-emerald-600 text-white' },
                      { status: 'CANCELLED', color: 'bg-red-600 text-white' }
                    ].map(st => (
                      <button
                        key={st.status}
                        disabled={isUpdatingStatus || selectedOrder.order_status === st.status}
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, st.status as OrderStatus)}
                        className={`p-2.5 rounded-xl font-bold uppercase transition-all shadow-sm ${
                          selectedOrder.order_status === st.status
                            ? 'bg-slate-200 text-slate-400 border border-slate-350 cursor-not-allowed'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {st.status.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status updates log note */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 text-xs block">Press Notification Note (Sent to customer)</span>
                  <textarea
                    rows={3}
                    value={statusUpdateNote}
                    onChange={e => setStatusUpdateNote(e.target.value)}
                    placeholder="e.g. Plates loaded, ready for shipping courier..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                  <span className="block text-[9px] text-slate-400 font-semibold leading-normal">
                    This message will be appended to the order timeline history and logged on customer WhatsApp notifications.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
