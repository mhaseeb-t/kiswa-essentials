export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const WHATSAPP_NUMBER = '447123456789';

export const ORDER_STATUSES = {
  PENDING: { label: 'Pending', color: 'bg-yellow-500' },
  PAID: { label: 'Paid', color: 'bg-blue-500' },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-500' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-500' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500' },
};

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
};

export const FREE_SHIPPING_THRESHOLD = 75;

export const CATEGORIES = [
  { id: 'kurtas', name: 'Kurtas', icon: 'Shirt' },
  { id: 'shalwar-kameez', name: 'Shalwar Kameez', icon: 'Shirt' },
  { id: 'shawls', name: 'Shawls', icon: 'Wind' },
  { id: 'perfumes', name: 'Perfumes', icon: 'Flame' },
];

export const MOCK_PRODUCTS = [
  { id: '1', name: 'Embroidered Kurta', price: 89.99, category: 'Kurtas', stock: 15, image: 'https://picsum.photos/400/400?random=1' },
  { id: '2', name: 'Classic Shalwar Kameez', price: 129.99, category: 'Shalwar Kameez', stock: 8, image: 'https://picsum.photos/400/400?random=2' },
  { id: '3', name: 'Silk Embroidered Shawl', price: 59.99, category: 'Shawls', stock: 20, image: 'https://picsum.photos/400/400?random=3' },
  { id: '4', name: 'Oud Premium Perfume', price: 149.99, category: 'Perfumes', stock: 5, image: 'https://picsum.photos/400/400?random=4' },
  { id: '5', name: 'Cotton Summer Kurta', price: 69.99, category: 'Kurtas', stock: 25, image: 'https://picsum.photos/400/400?random=5' },
  { id: '6', name: 'Wedding Sherwani', price: 299.99, category: 'Shalwar Kameez', stock: 3, image: 'https://picsum.photos/400/400?random=6' },
  { id: '7', name: 'Pashmina Shawl', price: 119.99, category: 'Shawls', stock: 12, image: 'https://picsum.photos/400/400?random=7' },
  { id: '8', name: 'Musk Attar', price: 79.99, category: 'Perfumes', stock: 18, image: 'https://picsum.photos/400/400?random=8' },
];