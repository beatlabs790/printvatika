import { NextRequest, NextResponse } from 'next/server';
import { DbClient } from '../../../../lib/db';
import { OrderStatus, PaymentStatus } from '../../../../types';
import { sendCustomerStatusNotification } from '../../../../lib/whatsapp';

// Check admin auth helper
function checkAdminAuth(req: NextRequest): boolean {
  const token = req.cookies.get('admin_token')?.value;
  return token === 'printer_wala_vatika_authorized_token';
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const search = searchParams.get('search') || undefined;
    const date = searchParams.get('date') || undefined;

    const orders = await DbClient.getOrders({
      status: status || undefined,
      search,
      date
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Admin Fetch Orders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Update Order status
export async function PUT(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, orderStatus, paymentStatus, notes } = body;

    if (!orderId || !orderStatus) {
      return NextResponse.json({ error: 'Order ID and new Status are required.' }, { status: 400 });
    }

    const updatedOrder = await DbClient.updateOrderStatus(
      orderId,
      orderStatus as OrderStatus,
      paymentStatus as PaymentStatus | undefined,
      notes
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Trigger customer notification on WhatsApp
    try {
      await sendCustomerStatusNotification(updatedOrder, notes);
    } catch (notifyErr) {
      console.error('Failed to send status update WhatsApp to client:', notifyErr);
    }

    return NextResponse.json({ success: true, order: updatedOrder });

  } catch (error) {
    console.error('Admin Update Order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
