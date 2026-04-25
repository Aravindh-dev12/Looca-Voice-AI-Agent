'use client';

import { ArrowDownLeft, ArrowUpRight, Calendar } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';

export default function PaymentsPage() {
  const transactions = [
    { id: 1, title: 'Electricity Bill', amount: '₹1,240', date: 'Yesterday', type: 'debit', status: 'completed' },
    { id: 2, title: 'Looca Plus', amount: '₹499', date: 'Apr 20', type: 'debit', status: 'completed' },
    { id: 3, title: 'Refund - Gas Booking', amount: '₹850', date: 'Apr 15', type: 'credit', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Payments</h1>
          <p className="text-[#64748b]">View history and manage voice-based payment actions</p>
        </div>
        <Button className="flex items-center gap-2">Add Balance</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-none bg-gradient-to-br from-[#0f172a] to-[#334155] p-6 text-white">
          <p className="mb-1 text-sm opacity-80">Total Balance</p>
          <p className="mb-6 text-3xl font-bold">₹8,450.00</p>
          <div className="flex gap-3">
            <Button className="flex-1 bg-white text-[#0f172a] hover:bg-white/90">Send Money</Button>
            <Button className="flex-1 border-none bg-white/10 hover:bg-white/20">Request</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-[#0f172a]">Upcoming Bills</h3>
            <span className="text-xs font-medium text-[#0ea5e9]">View All</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff1f2] text-[#e11d48]">
                  <Calendar className="h-4 w-4" />
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
        <h3 className="mb-4 font-bold text-[#0f172a]">Recent Transactions</h3>
        <Card className="overflow-hidden">
          <div className="divide-y divide-[#e2e8f0]">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 transition-colors hover:bg-[#f8fafc]">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      transaction.type === 'credit' ? 'bg-[#f0fdf4] text-[#16a34a]' : 'bg-[#f1f5f9] text-[#64748b]'
                    }`}
                  >
                    {transaction.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-[#0f172a]">{transaction.title}</p>
                    <p className="text-xs text-[#64748b]">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.type === 'credit' ? 'text-[#16a34a]' : 'text-[#0f172a]'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {transaction.amount}
                  </p>
                  <Badge variant={transaction.status === 'completed' ? 'success' : 'warning'}>{transaction.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
