import React from 'react';
import { notFound } from 'next/navigation';
import { DbClient } from '../../../lib/db';
import { ProductCustomizer } from '../../../components/ProductCustomizer';

export const revalidate = 0; // Fresh DB specifications on each hit

interface CustomizePageProps {
  params: {
    slug: string;
  };
}

export default async function CustomizePage({ params }: CustomizePageProps) {
  const { slug } = params;

  // Retrieve details in parallel
  const [product, options, pricingRules] = await Promise.all([
    DbClient.getProductBySlug(slug),
    DbClient.getProductOptions(slug),
    DbClient.getPricingRules(slug)
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <ProductCustomizer
        product={product}
        options={options}
        pricingRules={pricingRules}
      />
    </div>
  );
}
