import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const AdminCategories = () => {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Kurtas', image: 'https://picsum.photos/100/100?random=1' },
    { id: '2', name: 'Shalwar Kameez', image: 'https://picsum.photos/100/100?random=2' },
    { id: '3', name: 'Shawls', image: 'https://picsum.photos/100/100?random=3' },
    { id: '4', name: 'Perfumes', image: 'https://picsum.photos/100/100?random=4' },
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [editModal, setEditModal] = useState({ isOpen: false, category: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null });

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, {
        id: Date.now().toString(),
        name: newCategory,
        image: 'https://picsum.photos/100/100?random=' + Date.now()
      }]);
      setNewCategory('');
    }
  };

  const handleUpdateCategory = () => {
    if (editModal.category?.name.trim()) {
      setCategories(categories.map(c =>
        c.id === editModal.category.id ? { ...c, name: editModal.category.name } : c
      ));
      setEditModal({ isOpen: false, category: null });
    }
  };

  const handleDeleteCategory = () => {
    setCategories(categories.filter(c => c.id !== deleteModal.categoryId));
    setDeleteModal({ isOpen: false, categoryId: null });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-medium text-[#f5f0e8] mb-8">Categories</h1>

        {/* Add Category */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Add New Category</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2e2e2e]">
                <th className="text-left p-4 text-[#888888] text-sm font-medium">Image</th>
                <th className="text-left p-4 text-[#888888] text-sm font-medium">Name</th>
                <th className="text-left p-4 text-[#888888] text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-[#2e2e2e]">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-[#2e2e2e] rounded overflow-hidden">
                      <img src={category.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 text-[#f5f0e8]">{category.name}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditModal({ isOpen: true, category })}
                        className="p-2 text-[#c9b89a] hover:bg-[#2e2e2e] rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, categoryId: category.id })}
                        className="p-2 text-[#ef4444] hover:bg-[#ef4444]/10 rounded transition-colors"
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

        {/* Edit Modal */}
        <Modal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, category: null })}
          title="Edit Category"
        >
          <Input
            label="Category Name"
            value={editModal.category?.name || ''}
            onChange={(e) => setEditModal({ ...editModal, category: { ...editModal.category, name: e.target.value } })}
          />
          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={() => setEditModal({ isOpen: false, category: null })}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>
              Save
            </Button>
          </div>
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
          title="Delete Category"
        >
          <p className="text-[#888888] mb-6">Are you sure you want to delete this category?</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, categoryId: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCategories;