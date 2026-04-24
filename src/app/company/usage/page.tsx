'use client';

import { motion } from 'framer-motion';
import { History, Mic, Zap, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@/components/ui';

export default function UsagePage() {
  const stats = [
    { label: 'Total Voice Minutes', value: '12,482', change: '+12%', icon: Mic, color: 'text-[#0ea5e9]', bg: 'bg-[#f0f9ff]' },
    { label: 'Active Agents', value: '4', change: '0', icon: Zap, color: 'text-[#fbbf24]', bg: 'bg-[#fffbeb]' },
    { label: 'Total Requests', value: '48,291', change: '+8%', icon: TrendingUp, color: 'text-[#10b981]', bg: 'bg-[#f0fdf4]' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">Usage Analytics</h1>
        <p className="text-[#64748b]">Real-time performance and credit consumption</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-[#64748b]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0f172a]">{stat.value}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className={stat.change.startsWith('+') ? 'text-[#10b981]' : 'text-[#64748b]'}>
                  {stat.change}
                </span>
                <span className="text-[#94a3b8]">from last month</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daily Call Volume</CardTitle>
              <CardDescription>Number of voice minutes consumed per day</CardDescription>
            </div>
            <Badge className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Last 30 Days
            </Badge>
          </div>
        </CardHeader>
        <div className="h-64 flex items-end justify-between gap-1 pt-8">
          {[40, 25, 30, 45, 60, 55, 70, 85, 60, 40, 30, 45, 50, 65, 80, 95, 70, 50, 40, 35, 45, 55, 60, 75, 90, 85, 70, 60, 50, 40].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              className="flex-1 bg-[#0ea5e9] rounded-t-sm opacity-60 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
