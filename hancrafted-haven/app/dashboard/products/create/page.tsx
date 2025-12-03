// app/dashboard/products/create/page.tsx
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import CreateProductForm from '@/app/ui/products/create-form';

export const metadata: Metadata = {
  title: 'Create Product',
};

export default function CreateProductPage() {
  // Define breadcrumbs for navigation
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Products', href: '/dashboard/products' },
    { label: 'Create Product', href: '/dashboard/products/create', active: true },
  ];

  return (
    <div className="w-full">
      {/* Breadcrumb navigation */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Page title */}
      <h1 className="mb-6 text-2xl md:text-3xl font-semibold">Create Product</h1>

      {/* Form */}
      <CreateProductForm />
    </div>
  );
}
