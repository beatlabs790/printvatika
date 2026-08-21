import { NextRequest, NextResponse } from 'next/server';
import { DbClient } from '../../../lib/db';
import { Order, OrderItem } from '../../../types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Basic validation
    const {
      customerName,
      customerEmail,
      customerPhone,
      fulfillmentType,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryPincode,
      deliveryCharge,
      subtotal,
      totalAmount,
      notes,
      items
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing mandatory checkout fields.' }, { status: 400 });
    }

    // 2. Determine unique serial Order ID e.g. #PV-1001
    const allOrders = await DbClient.getOrders();
    const count = allOrders.length;
    const orderSerial = 1001 + count;
    const orderId = `#PV-${orderSerial}`;

    // 3. Construct Order input schema
    const orderInput = {
      id: orderId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      fulfillment_type: fulfillmentType,
      delivery_address: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
      delivery_city: fulfillmentType === 'delivery' ? deliveryCity : undefined,
      delivery_state: fulfillmentType === 'delivery' ? deliveryState : undefined,
      delivery_pincode: fulfillmentType === 'delivery' ? deliveryPincode : undefined,
      delivery_charge: Number(deliveryCharge) || 0,
      subtotal: Number(subtotal),
      total_amount: Number(totalAmount),
      payment_status: 'PENDING' as const,
      order_status: 'PAYMENT_PENDING' as const,
      notes: notes || undefined
    };

    // 4. Construct items list
    const itemsInput = items.map((item: any) => ({
      product_slug: item.product_slug,
      product_name: item.product_name,
      quantity: Number(item.quantity) || 1,
      selected_options: item.selected_options || {},
      unit_price: Number(item.unit_price),
      total_price: Number(item.total_price),
      original_file_url: item.original_file?.base64 || undefined, // Store base64 content locally in JSON fallback DB
      preview_file_url: item.preview_base64 || undefined,
      design_config: item.design_config || undefined
    }));

    // 5. Save to database
    const createdOrder = await DbClient.createOrder(orderInput, itemsInput);

    // 6. Razorpay Integration hook
    // If Razorpay keys are configured, initialize Razorpay order object here
    let razorpay_order_id = null;
    if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        // Dynamic load razorpay in backend to avoid bundle issues
        const Razorpay = require('razorpay');
        const rzp = new Razorpay({
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const rzpOrder = await rzp.orders.create({
          amount: Math.round(Number(totalAmount) * 100), // paise
          currency: 'INR',
          receipt: orderId,
          payment_capture: 1
        });
        
        razorpay_order_id = rzpOrder.id;
      } catch (rzpErr) {
        console.error('Failed to trigger Razorpay client SDK Order creation:', rzpErr);
      }
    }

    return NextResponse.json({
      ...createdOrder,
      razorpay_order_id
    }, { status: 201 });

  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
