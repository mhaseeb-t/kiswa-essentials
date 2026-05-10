import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCustomers([
      { id: '1', name: 'Ahmed Khan', email: 'ahmed@example.com', phone: '+44 20 1234 5678', ordersCount: 5, createdAt: '2023-06-15' },
      { id: '2', name: 'Fatima Ahmed', email: 'fatima@example.com', phone: '+44 20 2345 6789', ordersCount: 3, createdAt: '2023-08-20' },
      { id: '3', name: 'Omar Ali', email: 'omar@example.com', phone: '+44 20 3456 7890', ordersCount: 2, createdAt: '2023-09-10' },
      { id: '4', name: 'Sara Khan', email: 'sara@example.com', phone: '+44 20 4567 8901', ordersCount: 8, createdAt: '2023-05-01' },
      { id: '5', name: 'Usman Ali', email: 'usman@example.com', phone: '+44 20 5678 9012', ordersCount: 1, createdAt: '2024-01-05' },
    ]);
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-medium text-[#f5f0e8] mb-8">Customers</h1>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2e2e2e] rounded text-[#f5f0e8] placeholder-[#888888] focus:outline-none focus:border-[#c9b89a]"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2e2e2e]">
                <th className="text-left p-4 text-[#888888] text-sm font-medium">Name</th>
                <th className="text-left p-4 text-[#888888] text-sm font-medium">Email</th>
                <th className="text-left p-4 text-[#888888] text-sm font-medium">Phone</th>
                <th className="text-left p-4 text-[#888888] text-sm font-medium">Orders</th>
                <th className="text-left p-4 text-[#888888] text-sm font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-[#2e2e2e] hover:bg-[#0f0f0f] cursor-pointer">
                  <td className="p-4 text-[#f5f0e8]">{customer.name}</td>
                  <td className="p-4 text-[#888888]">{customer.email}</td>
                  <td className="p-4 text-[#888888]">{customer.phone}</td>
                  <td className="p-4 text-[#c9b89a]">{customer.ordersCount}</td>
                  <td className="p-4 text-[#888888]">{formatDate(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;