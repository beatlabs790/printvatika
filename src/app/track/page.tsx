'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  Printer,
  CheckCircle,
  Clock,
  Truck,
  Building,
  Calendar,
  AlertCircle,
  FileDown,
  Loader2,
  Phone,
  Tag
} from 'lucide-react';

// Wrapper component to provide search params context correctly in Next.js App Router
export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    }>
      <TrackerContent />
    </Suspense>
  );
}

function TrackerContent() {
  const searchParams = useSearchParams();
  
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  // Handle direct query links e.g. /track?id=PV-1001&phone=9876543210
  useEffect(() => {
    const urlId = searchParams.get('id');
    const urlPhone = searchParams.get('phone');
    
    if (urlId && urlPhone) {
      setOrderId(urlId);
      setPhone(urlPhone);
      fetchOrderStatus(urlId, urlPhone);
    }
  }, [searchParams]);

  const fetchOrderStatus = async (queryId: string, queryPhone: string) => {
    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      // Clean order ID: remove # if client entered it
      const cleanId = queryId.replace('#', '').trim();
      const res = await fetch(`/api/orders/track?id=${cleanId}&phone=${queryPhone}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Order not found or mobile number mismatch.');
        } else {
          throw new Error('Server error fetching order.');
        }
      }

      const data = await res.json();
      setOrder(data);
    } catch (e: any) {
      setError(e.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter your Order number.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter your 10-digit mobile number.');
      return;
    }
    fetchOrderStatus(orderId, phone);
  };

  // Timeline list setup
  const getTimelineSteps = (currentStatus: OrderStatus, fulfillment: string) => {
    const isDelivery = fulfillment === 'delivery';

    const steps = [
      { status: 'PAYMENT_PENDING', label: 'Order Placed', desc: 'Order submitted, payment pending verification.' },
      { status: 'PAID', label: 'Payment Verified', desc: 'Transaction approved and secured.' },
      { status: 'CONFIRMED', label: 'Job Confirmed', desc: 'Design approved by print operators.' },
      { status: 'PRINTING', label: 'Printing Press', desc: 'Your design is being printed on plates.' },
      { status: 'READY', label: isDelivery ? 'Ready for Dispatch' : 'Ready for Pickup', desc: isDelivery ? 'Order packed and ready for courier.' : 'Awaiting collection at Vatika press.' },
      { status: isDelivery ? 'OUT_FOR_DELIVERY' : 'READY', label: isDelivery ? 'Out for Delivery' : 'Collect', desc: isDelivery ? 'Package out with courier driver.' : 'Pickup completed.' },
      { status: 'DELIVERED', label: isDelivery ? 'Delivered' : 'Collected', desc: isDelivery ? 'Package handed over to customer.' : 'Order collected by customer.' }
    ];

    // Filter status keys to avoid duplication based on fulfillment choice
    return steps.filter((s, idx) => {
      if (!isDelivery && s.status === 'OUT_FOR_DELIVERY') return false;
      return true;
    });
  };

  // Determine if step is finished
  const getStepState = (stepStatus: string, currentStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = [
      'PAYMENT_PENDING',
      'PAID',
      'CONFIRMED',
      'PRINTING',
      'READY',
      'OUT_FOR_DELIVERY',
      'DELIVERED'
    ];

    const currentIdx = statusOrder.indexOf(currentStatus);
    const stepIdx = statusOrder.indexOf(stepStatus as OrderStatus);

    if (currentStatus === 'CANCELLED') {
      return 'cancelled';
    }

    if (stepIdx === -1) return 'pending';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Track Your Print Order
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
          Enter your unique order reference and registered mobile number to check real-time printing progress.
        </p>
      </div>

      {/* Tracker Lookup form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Order Number</label>
              <input
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="e.g. PV-1002"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="10-digit phone"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {error && (
            <div className="flex gap-2 items-center text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl font-semibold">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Querying Press Database...
              </>
            ) : (
              <>
                <Search size={16} />
                Lookup Order Status
              </>
            )}
          </button>
        </form>
      </div>

      {/* Tracker Details Results */}
      {order && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          {/* Left: Progress Timeline */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Reference</span>
                <span className="text-xl font-extrabold text-slate-900">{order.id}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-semibold">Current State</span>
                <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  order.order_status === 'DELIVERED' || order.order_status === 'READY'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : order.order_status === 'CANCELLED'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-indigo-100 text-indigo-800 border border-indigo-200 animate-pulse'
                }`}>
                  {order.order_status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Timeline graphics */}
            <div className="relative pl-8 space-y-6">
              {/* Vertical connector line */}
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

              {getTimelineSteps(order.order_status, order.fulfillment_type).map((step, idx) => {
                const state = getStepState(step.status, order.order_status);
                
                return (
                  <div key={idx} className="relative flex gap-4">
                    {/* Circle icon indicator */}
                    <div className={`absolute -left-7 w-7.5 h-7.5 rounded-full border-2 flex items-center justify-center z-10 font-bold text-xs ${
                      state === 'completed'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : state === 'active'
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      {state === 'completed' ? '✓' : idx + 1}
                    </div>

                    <div className="pt-0.5">
                      <h4 className={`text-sm font-bold ${state === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs text-slate-500 leading-normal mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Job details specs summary */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-900 text-sm">Specification Card</h3>
            
            {/* Items */}
            <div className="space-y-4 border-b border-slate-100 pb-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex gap-3 text-left">
                  {/* Thumbnail mockup */}
                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border shrink-0">
                    <img src={item.preview_file_url || item.original_file_url} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.product_name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Qty: {item.quantity} units</p>
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {Object.entries(item.selected_options).map(([k, v]) => (
                        <span key={k} className="bg-slate-100 text-slate-500 text-[8px] px-1 py-0.5 rounded font-bold">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery address / Pickup info */}
            <div className="space-y-3 text-xs border-b border-slate-100 pb-4">
              <div className="flex gap-2 items-start">
                {order.fulfillment_type === 'delivery' ? (
                  <>
                    <Truck className="text-primary-600 shrink-0 mt-0.5" size={16} />
                    <div>
                      <span className="font-bold text-slate-800 block">Home Delivery Address</span>
                      <p className="text-slate-500 leading-normal mt-0.5">
                        {order.delivery_address}, {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Building className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                    <div>
                      <span className="font-bold text-slate-800 block">Collect at Vatika Press</span>
                      <p className="text-slate-500 leading-normal mt-0.5">
                        Main Bazar Road, Near Gandhi Chowk, Vatika, Jaipur (Rajasthan)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Cost Details */}
            <div className="space-y-1.5 text-xs font-medium text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping fee:</span>
                <span>{order.delivery_charge > 0 ? `₹${order.delivery_charge.toFixed(2)}` : 'FREE'}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t pt-2 mt-1">
                <span>Paid Amount:</span>
                <span>₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Customer Notice */}
            <div className="flex gap-2 items-start text-[10px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-normal font-semibold">
              <Clock size={16} className="text-indigo-500 shrink-0" />
              <span>
                Need to change specifications or cancel the order? Please call Jaipur customer press team directly at +91 99999 88888. Reference Order ID {order.id}.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
