import { NextRequest, NextResponse } from 'next/server';
import { DbClient } from '../../../../lib/db';

function checkAdminAuth(req: NextRequest): boolean {
  const token = req.cookies.get('admin_token')?.value;
  return token === 'printer_wala_vatika_authorized_token';
}

export async function PUT(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, options, rules } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Product slug is required.' }, { status: 400 });
    }

    if (options) {
      await DbClient.updateProductOptions(slug, options);
    }

    if (rules) {
      await DbClient.updatePricingRules(slug, rules);
    }

    return NextResponse.json({ success: true, message: 'Pricing modifications saved.' });

  } catch (error) {
    console.error('Admin Pricing API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
