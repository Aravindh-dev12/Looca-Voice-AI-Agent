'use client';

import { motion } from 'framer-motion';
import { 
  Phone, TrendingUp, IndianRupee, Users, Mic, Clock, 
  Sparkles, Plus, Download, Bell 
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const stats = [
  { label: 'calls today', value: '2,847', change: '+12%', icon: Phone },
  { label: 'outcome rate', value: '94.2%', change: '+2.1%', icon: TrendingUp },
  { label: 'value today', value: '₹4.2 Cr', change: '+8%', icon: IndianRupee },
  { label: 'active now', value: '23', change: '', icon: Users, live: true },
];

const callData = Array.from({ length: 12 }, (_, i) => ({
  time: `${i + 8}am`,
  calls: Math.floor(Math.random() * 500) + 200,
  value: Math.floor(Math.random() * 50) + 20,
}));

const liveCalls = [
  { id: '#2849', location: 'Tamil Nadu', topic: 'EMERGENCY', detail: 'chest pain reported', emotion: 'HIGH URGENCY', status: 'ICU alerted', urgent: true },
  { id: '#2847', location: 'Karnataka', topic: 'Cardiology appt', detail: 'BOOKING...', emotion: 'Slightly anxious', status: 'Confirming', urgent: false },
  { id: '#2848', location: 'Andhra Pradesh', topic: 'Lab result query', detail: 'ANSWERING...', emotion: 'Neutral', status: 'Processing', urgent: false },
];

export default function CompanyDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Apollo Hospitals · Looca Dashboard</h1>
          <p className="text-[#a7b4c8]">Monday, April 21, 2026 · 10:24am</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <Badge variant="success">● LIVE</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-5 h-5 ${stat.live ? 'text-green-400' : 'text-[#7cdbff]'}`} />
                {stat.change && (
                  <span className="text-xs text-[#34d399]">{stat.change}</span>
                )}
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-[#a7b4c8] mt-1">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Live Calls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Calls Right Now
          </h3>
          <span className="text-sm text-[#a7b4c8]">23 active · 0 waiting · avg response 0.42s</span>
        </div>
        <div className="space-y-3">
          {liveCalls.map((call) => (
            <div 
              key={call.id}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                call.urgent 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-sm font-mono ${call.urgent ? 'text-red-400' : 'text-[#7cdbff]'}`}>{call.id}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#a7b4c8]">{call.location}</span>
                    <span className="text-white">·</span>
                    <span className={`text-sm font-medium ${call.urgent ? 'text-red-400' : 'text-white'}`}>{call.topic}</span>
                  </div>
                  <div className="text-xs text-[#64748b] mt-1">
                    {call.emotion} • {call.status}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Listen</Button>
                {call.urgent && <Button variant="danger" size="sm">Join</Button>}
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4">View all 23 calls</Button>
      </Card>

      {/* Intelligence Brief & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intelligence Brief */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[rgba(124,219,255,0.15)]">
              <Sparkles className="w-5 h-5 text-[#7cdbff]" />
            </div>
            <h3 className="font-semibold text-white">Today's Intelligence Brief</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)]">
              <p className="text-sm text-[#fcd34d]">
                "Coimbatore respiratory queries up 38% this morning. Pattern matches early monsoon onset (historical data). Recommend staffing up pulmonology by Thursday."
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[rgba(124,219,255,0.1)] border border-[rgba(124,219,255,0.2)]">
              <p className="text-sm text-[#7cdbff]">
                "847 patients asked for dialysis centers this week. No Apollo facility currently offers this service. Estimated unaddressed revenue: ₹2.1 Cr/month."
              </p>
            </div>
          </div>
        </Card>

        {/* Call Volume Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-4">Hourly Call Volume</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callData}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7cdbff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7cdbff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1729', border: '1px solid rgba(148,163,184,0.2)' }}
                />
                <Area type="monotone" dataKey="calls" stroke="#7cdbff" fillOpacity={1} fill="url(#colorCalls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-[#64748b] mt-2">
            Peak: 9am-11am (1,247 calls) · Off-peak: 12am-5am
          </p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button><Plus className="w-4 h-4 mr-2" /> Add knowledge</Button>
        <Button variant="secondary"><Mic className="w-4 h-4 mr-2" /> Configure agent</Button>
        <Button variant="secondary"><Download className="w-4 h-4 mr-2" /> Download report</Button>
        <Button variant="ghost"><Bell className="w-4 h-4 mr-2" /> Alerts</Button>
      </div>
    </div>
  );
}
