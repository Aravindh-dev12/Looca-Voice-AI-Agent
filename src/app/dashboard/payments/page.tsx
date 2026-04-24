'use client';

import { Wallet, ArrowUpRight, ArrowDownLeft, Calendar, MoreHorizontal } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

export default function PaymentsPage() {
  const transactions = [
    { id: 1, title: 'Electricity Bill', amount: '₹1,240', date: 'Yesterday', type: 'debit', status: 'completed' },
    { id: 2, title: 'Looca Enterprise Plan', amount: '₹4,999', date: 'Apr 20', type: 'debit', status: 'completed' },
    { id: 3, title: 'Refund - Gas Booking', amount: '₹850', date: 'Apr 15', type: 'credit', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Payments</h1>
          <p className="text-[#64748b]">View history and manage voice-based payment actions</p>
        </div>
        <Button className="flex items-center gap-2">
          Add Balance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#0f172a] to-[#334155] text-white border-none">
          <p className="text-sm opacity-80 mb-1">Total Balance</p>
          <p className="text-3xl font-bold mb-6">₹8,450.00</p>
          <div className="flex gap-3">
            <Button className="flex-1 bg-white text-[#0f172a] hover:bg-white/90">Send Money</Button>
            <Button className="flex-1 bg-white/10 hover:bg-white/20 border-none">Request</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0f172a]">Upcoming Bills</h3>
            <span className="text-xs text-[#0ea5e9] font-medium">View All</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#fff1f2] flex items-center justify-center text-[#e11d48]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">Internet Bill</p>
                  <p className="text-xs text-[#64748b]">Due in 3 days</p>
                </div>
              </div>
              <p className="text-sm font-bold text-[#0f172a]">₹999</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="font-bold text-[#0f172a] mb-4">Recent Transactions</h3>
        <Card className="overflow-hidden">
          <div className="divide-y divide-[#e2e8f0]">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 hover:bg-[#f8fafc] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    t.type === 'credit' ? 'bg-[#f0fdf4] text-[#16a34a]' : 'bg-[#f1f5f9] text-[#64748b]'
                  }`}>
                    {t.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-[#0f172a]">{t.title}</p>
                    <p className="text-xs text-[#64748b]">{t.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${t.type === 'credit' ? 'text-[#16a34a]' : 'text-[#0f172a]'}`}>
                    {t.type === 'credit' ? '+' : '-'}{t.amount}
                  </p>
                  <Badge variant={t.status === 'completed' ? 'success' : 'warning'}>{t.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
