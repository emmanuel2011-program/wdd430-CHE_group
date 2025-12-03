'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Review } from '@/app/lib/definitions';

interface ProductDetailsTableProps {
  product: {
    id: string;
    name: string;
    image_url: string;
    price: number;
    description?: string;
    category?: string;
    inventory?: number;
    reviews: Review[]; // Reviews are now part of the product object
  };
}

export default function ProductDetailsTable({ product }: ProductDetailsTableProps) {
  // Reviews are already attached to the product
  const productReviews = product.reviews || [];

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Product Name */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Product Name</h2>
          <p className="mt-2 text-sm text-gray-700">{product.name}</p>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-sm text-gray-700">{product.description}</p>
          </div>
        )}

        {/* Category */}
        {product.category && (
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Category</h2>
            <p className="mt-2 text-sm text-gray-700">{product.category}</p>
          </div>
        )}

        {/* Inventory */}
        {typeof product.inventory === "number" && (
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Inventory</h2>
            <p className="mt-2 text-sm text-gray-700">{product.inventory}</p>
          </div>
        )}

        {/* Image */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Product Image</h2>
          <div className="mt-2 w-48 h-48 relative rounded-md overflow-hidden border border-gray-200">
            <Image
              src={product.image_url || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Price</h2>
          <p className="mt-2 text-sm text-gray-700">${product.price.toFixed(2)}</p>
        </div>

        {/* Reviews */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Reviews {productReviews.length > 0 && `(${productReviews.length})`}
          </h2>
          {productReviews.length > 0 ? (
            <div className="mt-2 space-y-4">
              {productReviews.map((review) => (
                <div key={review.id} className="rounded-md border border-gray-200 bg-white p-4">
                  <p className="font-medium text-gray-900">
                    {(review as any).user_name || `User ${review.user_id}`}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500 italic">No reviews yet.</p>
          )}
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Back to Products
        </Link>
        <Link
          href={`/dashboard/products/${product.id}/edit`}
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Edit Product
        </Link>
      </div>
    </div>
  );
}