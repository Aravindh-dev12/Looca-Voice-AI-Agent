'use client';

import { motion } from 'framer-motion';
import { CreditCard, Download, IndianRupee, Check, Clock } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const thisMonth = {
  totalCalls: '52,847',
  outcomeRate: '94.2%',
  billedFailed: '₹0.00',
};

const breakdown = [
  { item: 'Appointments booked', count: '24,847', rate: '₹8', total: '₹1,98,776' },
  { item: 'Bills paid via voice', count: '8,423', rate: '₹4', total: '₹33,692' },
  { item: 'Lab results delivered', count: '12,847', rate: '₹2', total: '₹25,694' },
  { item: 'Failed / unresolved', count: '3,100', rate: '₹0', total: '₹0 (no bill)', failed: true },
];

export default function BillingPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing & Usage</h1>
          <p className="text-[#a7b4c8]">Pay per outcome, not per call</p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" /> Download Invoice
        </Button>
      </div>

      {/* This Month Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Calls', value: thisMonth.totalCalls, icon: CreditCard },
          { label: 'Outcome Rate', value: thisMonth.outcomeRate, icon: Check, success: true },
          { label: 'Billed for Failed', value: thisMonth.billedFailed, icon: Clock },
        ].map((stat) => (
          <Card key={stat.label} className="p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-[#a7b4c8]">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Billing Model */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <IndianRupee className="w-5 h-5 text-[#34d399]" />
          <h2 className="text-lg font-semibold text-white">Billing Model — Pay per outcome</h2>
        </div>
        
        <div className="space-y-3">
          {breakdown.map((row, idx) => (
            <div 
              key={row.item}
              className={`flex items-center justify-between p-4 rounded-xl ${
                row.failed ? 'bg-[rgba(251,113,133,0.05)]' : 'bg-white/5'
              }`}
            >
              <div className="flex-1">
                <span className={row.failed ? 'text-[#fb7185]' : 'text-white'}>{row.item}</span>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <span className="text-[#a7b4c8] w-24">{row.count}</span>
                <span className="text-[#64748b] w-16">× {row.rate}</span>
                <span className={`font-medium w-32 text-right ${row.failed ? 'text-[#fb7185]' : 'text-[#34d399]'}`}>
                  {row.total}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-white">Total This Month</span>
            <span className="text-2xl font-bold text-[#34d399]">₹2,58,162</span>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-[rgba(52,211,153,0.15)] to-[rgba(124,219,255,0.15)] border border-[rgba(52,211,153,0.3)]">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-[#64748b]">Value Looca created</div>
                <div className="text-lg font-semibold text-[#34d399]">₹4.2 Cr</div>
              </div>
              <div>
                <div className="text-sm text-[#64748b]">Looca cost</div>
                <div className="text-lg font-semibold text-white">₹2.58 Lakh</div>
              </div>
              <div>
                <div className="text-sm text-[#64748b]">ROI</div>
                <div className="text-lg font-semibold text-[#7cdbff]">16.3x</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Note */}
      <div className="flex items-center gap-2 text-sm text-[#64748b]">
        <Check className="w-4 h-4 text-[#34d399]" />
        We charge nothing for failed calls. You only pay for successful outcomes.
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary">View detailed breakdown</Button>
        <Button variant="ghost">Change plan</Button>
      </div>
    </div>
  );
}
