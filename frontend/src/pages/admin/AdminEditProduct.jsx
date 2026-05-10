import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    reset({
      name: 'Embroidered Kurta',
      description: 'Premium hand-embroidered kurta made with finest cotton.',
      price: '89.99',
      stock: '15',
      category: 'kurtas',
      isActive: true,
    });
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Product updated:', data);
    alert('Product updated successfully!');
    navigate('/admin/products');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-medium text-[#f5f0e8] mb-8">Edit Product</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 space-y-6">
          <Input
            label="Product Name"
            placeholder="Enter product name"
            {...register('name', { required: 'Product name is required' })}
            error={errors.name?.message}
          />

          <div>
            <label className="text-sm font-medium text-[#888888] mb-2 block">Description</label>
            <textarea
              {...register('description')}
              placeholder="Enter product description"
              rows={4}
              className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2e2e2e] rounded text-[#f5f0e8] placeholder-[#888888] focus:outline-none focus:border-[#c9b89a] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (£)"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
              error={errors.price?.message}
            />
            <Input
              label="Stock Quantity"
              type="number"
              placeholder="0"
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 0, message: 'Stock must be positive' }
              })}
              error={errors.stock?.message}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#888888] mb-2 block">Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2e2e2e] rounded text-[#f5f0e8] focus:outline-none focus:border-[#c9b89a]"
            >
              <option value="">Select a category</option>
              <option value="kurtas">Kurtas</option>
              <option value="shalwar-kameez">Shalwar Kameez</option>
              <option value="shawls">Shawls</option>
              <option value="perfumes">Perfumes</option>
            </select>
            {errors.category && (
              <p className="text-[#ef4444] text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-[#888888] mb-2 block">Product Images</label>
            <div className="border-2 border-dashed border-[#2e2e2e] rounded-lg p-8 text-center hover:border-[#c9b89a] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[#888888] mx-auto mb-4" />
              <p className="text-[#888888] mb-2">Click to upload or drag and drop</p>
              <p className="text-[#888888] text-sm">PNG, JPG (max 5MB)</p>
              <input type="file" multiple className="hidden" />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-5 h-5 rounded border-[#2e2e2e] bg-[#0f0f0f] text-[#c9b89a] focus:ring-[#c9b89a]"
            />
            <span className="text-[#f5f0e8]">Product is Active</span>
          </label>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Update Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;