import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });

  useEffect(() => {
    setProducts([
      { id: '1', name: 'Embroidered Kurta', category: 'Kurtas', price: 89.99, stock: 15, isActive: true },
      { id: '2', name: 'Classic Shalwar Kameez', category: 'Shalwar Kameez', price: 129.99, stock: 8, isActive: true },
      { id: '3', name: 'Silk Embroidered Shawl', category: 'Shawls', price: 59.99, stock: 0, isActive: true },
      { id: '4', name: 'Oud Premium Perfume', category: 'Perfumes', price: 149.99, stock: 5, isActive: true },
    ]);
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    setProducts(products.filter(p => p.id !== deleteModal.productId));
    setDeleteModal({ isOpen: false, productId: null });
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl text-[#f8f4ef]">Products</h1>
            <p className="text-[#6b6b6b] mt-1">Manage your product inventory</p>
          </div>
          <Link to="/admin/products/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50 transition-colors"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2e]">
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Image</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Price</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Stock</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-[#2a2a2e]/50 hover:bg-[#0c0c0e]/30 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-[#0c0c0e] rounded-lg overflow-hidden">
                      <img src={`https://picsum.photos/48/48?random=${product.id}`} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#f8f4ef]">{product.name}</td>
                  <td className="p-4 text-sm text-[#6b6b6b]">{product.category}</td>
                  <td className="p-4">
                    <span className="font-display text-[#c9b89a]">{formatPrice(product.price)}</span>
                  </td>
                  <td className="p-4 text-sm text-[#6b6b6b]">{product.stock}</td>
                  <td className="p-4">
                    <Badge variant={product.isActive ? 'success' : 'error'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="p-2 text-[#c9b89a] hover:bg-[#2a2a2e] rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, productId: product.id })}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, productId: null })}
          title="Delete Product"
        >
          <p className="text-[#6b6b6b] mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, productId: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminProducts;