'use client';

import { motion } from 'framer-motion';
import { Phone, Clock, Users, Mic, Filter, Download, BarChart3 } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const hourlyData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i + 8}am`,
  calls: Math.floor(Math.random() * 300) + 100,
}));

const calls = [
  { 
    id: '#2849', 
    type: 'EMERGENCY', 
    topic: 'chest pain reported',
    location: 'Tamil Nadu', 
    duration: '8:42', 
    lang: 'Tamil',
    emotion: 'HIGH URGENCY (0.94)',
    action: 'ICU at Apollo Chennai alerted ✓',
    ambulance: 'Ambulance protocol: activated ✓',
    urgent: true 
  },
  { 
    id: '#2847', 
    type: 'BOOKING', 
    topic: 'cardiology appointment',
    location: 'Karnataka', 
    duration: '2:14', 
    lang: 'Kannada + English',
    user: 'female, estimated 60+',
    intent: 'Book cardiologist, next 3 days',
    emotion: 'Slightly anxious (0.51)',
    status: 'Confirming slot choice',
    urgent: false 
  },
  { 
    id: '#2850', 
    type: 'ENQUIRY', 
    topic: 'general enquiry',
    location: 'Andhra Pradesh', 
    duration: '0:45', 
    lang: 'Telugu',
    intent: 'Hospital timings (low complexity)',
    model: 'Claude Haiku · Latency: 310ms',
    urgent: false 
  },
];

export default function CallsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h1 className="text-2xl font-bold text-white">Live Calls</h1>
          <Badge variant="danger">23 active</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="ghost" size="sm">Refresh: live</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Booking', 'Emergency', 'Unresolved', 'Escalated'].map((f, i) => (
          <button 
            key={f}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              i === 0 
                ? 'bg-[rgba(124,219,255,0.15)] text-white border border-[rgba(124,219,255,0.3)]' 
                : 'bg-white/5 text-[#a7b4c8] border border-white/10 hover:border-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Call List */}
      <div className="space-y-4">
        {calls.map((call) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`p-6 ${call.urgent ? 'border-l-4 border-l-red-500' : ''}`}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`font-mono font-bold ${call.urgent ? 'text-red-400' : 'text-[#7cdbff]'}`}>{call.id}</span>
                    <Badge variant={call.urgent ? 'danger' : call.type === 'BOOKING' ? 'success' : 'default'}>
                      {call.type}
                    </Badge>
                    {call.urgent && <span className="text-red-400 animate-pulse">● LIVE</span>}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{call.topic}</h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#a7b4c8]">
                    <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {call.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {call.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {call.lang}</span>
                  </div>

                  <div className="mt-4 space-y-1 text-sm">
                    <p className="text-[#64748b]">Emotion: <span className="text-[#a7b4c8]">{call.emotion}</span></p>
                    {call.action && <p className="text-[#34d399]">{call.action}</p>}
                    {call.ambulance && <p className="text-[#34d399]">{call.ambulance}</p>}
                    {call.user && <p className="text-[#64748b]">User: <span className="text-[#a7b4c8]">{call.user}</span></p>}
                    {call.intent && <p className="text-[#64748b]">Intent: <span className="text-[#a7b4c8]">{call.intent}</span></p>}
                    {call.model && <p className="text-[#64748b]">{call.model}</p>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Listen live</Button>
                  {call.urgent && <Button variant="danger" size="sm">Join call</Button>}
                  <Button variant="ghost" size="sm">Transcript</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Hourly Chart */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-[#7cdbff]" />
          <h3 className="font-semibold text-white">Hourly Call Volume</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d1729', border: '1px solid rgba(148,163,184,0.2)' }}
              />
              <Bar dataKey="calls" fill="#7cdbff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-[#64748b] mt-4">
          Peak: 9am-11am (1,247 calls) · Off-peak: 12am-5am
        </p>
      </Card>
    </div>
  );
}
