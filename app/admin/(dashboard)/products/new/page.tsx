import ProductForm from '../ProductForm';

export const metadata = { title: 'New Product System | Admin' };

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product System</h1>
        <p className="mt-1 text-sm text-gray-500">Fill in the core details before configuring modules and features.</p>
      </div>
      <ProductForm />
    </div>
  );
}
