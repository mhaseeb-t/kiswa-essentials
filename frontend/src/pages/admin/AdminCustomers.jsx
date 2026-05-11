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
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#f8f4ef]">Customers</h1>
          <p className="text-[#6b6b6b] mt-1">View and manage customer accounts</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50 transition-colors"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2e]">
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Phone</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Orders</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-[#2a2a2e]/50 hover:bg-[#0c0c0e]/30 cursor-pointer transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#c9b89a] to-[#a89878] flex items-center justify-center">
                        <span className="text-[#0c0c0e] text-xs font-medium">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-[#f8f4ef]">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#6b6b6b]">{customer.email}</td>
                  <td className="p-4 text-sm text-[#6b6b6b]">{customer.phone}</td>
                  <td className="p-4">
                    <span className="font-display text-[#c9b89a]">{customer.ordersCount}</span>
                  </td>
                  <td className="p-4 text-sm text-[#6b6b6b]">{formatDate(customer.createdAt)}</td>
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