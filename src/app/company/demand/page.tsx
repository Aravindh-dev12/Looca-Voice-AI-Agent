'use client';

import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Download, MapPin, Calendar } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const unmetDemands = [
  { 
    service: 'Dialysis centers', 
    queries: '1,247/week',
    gap: 'Nearest Apollo: 89km',
    willingness: 'High',
    revenue: '₹2.1 Cr/month',
    priority: 'high'
  },
  { 
    service: 'Home nursing service', 
    queries: '892/week',
    gap: 'No offering exists',
    mostAsked: 'post-op care',
    revenue: '₹1.4 Cr/month',
    priority: 'high'
  },
  { 
    service: 'Night OPD (8pm-11pm)', 
    queries: '423/week',
    gap: 'Coimbatore only',
    demand: 'Working population',
    revenue: '₹0.8 Cr/month',
    priority: 'medium'
  },
  { 
    service: 'Mental health consult', 
    queries: '612/week',
    gap: 'Only 2 psychiatrists',
    issue: 'Wait: avg 3 weeks',
    action: '+3 psychiatrists needed',
    priority: 'medium'
  },
];

export default function DemandPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Demand Intelligence</h1>
          <p className="text-[#a7b4c8]">What your patients asked for that you don't offer — yet</p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" /> Download Report
        </Button>
      </div>

      {/* Total Addressable Demand */}
      <Card gradient className="p-8 text-center">
        <h2 className="text-sm font-medium text-[#a7b4c8] mb-2">TOTAL ADDRESSABLE UNMET DEMAND</h2>
        <div className="text-5xl font-bold text-white mb-2">₹8.4 Cr <span className="text-2xl text-[#a7b4c8]">/ month</span></div>
        <p className="text-[#64748b]">Revenue opportunity from queries you couldn't fulfill</p>
      </Card>

      {/* Unmet Demand Radar */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#fb7185]" />
          Unmet Demand Radar
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {unmetDemands.map((demand) => (
            <motion.div
              key={demand.service}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={`p-6 ${demand.priority === 'high' ? 'border-l-4 border-l-[#fb7185]' : 'border-l-4 border-l-[#fbbf24]'}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white">{demand.service}</h3>
                  <Badge variant={demand.priority === 'high' ? 'danger' : 'warning'}>
                    {demand.queries}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-[#fb7185]">{demand.gap}</p>
                  {demand.willingness && <p className="text-[#a7b4c8]">Willingness: <span className="text-[#34d399]">{demand.willingness}</span></p>}
                  {demand.mostAsked && <p className="text-[#a7b4c8]">Most asked: {demand.mostAsked}</p>}
                  {demand.demand && <p className="text-[#a7b4c8]">Demand: {demand.demand}</p>}
                  {demand.issue && <p className="text-[#fb7185]">{demand.issue}</p>}
                  {demand.action && <p className="text-[#fbbf24]">Action: {demand.action}</p>}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Est. revenue if added:</span>
                    <span className="text-lg font-bold text-[#34d399]">{demand.revenue}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm">Create alert</Button>
                  <Button variant="ghost" size="sm">Market analysis</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Geographic Heat Map */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-[#7cdbff]" />
          <h2 className="text-lg font-semibold text-white">Geographic Heat Map</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[rgba(251,113,133,0.15)] border border-[rgba(251,113,133,0.3)]">
            <div className="text-sm text-[#fda4af] mb-1">Hot Zone</div>
            <div className="font-semibold text-white">Chennai</div>
          </div>
          <div className="p-4 rounded-xl bg-[rgba(251,113,133,0.15)] border border-[rgba(251,113,133,0.3)]">
            <div className="text-sm text-[#fda4af] mb-1">Hot Zone</div>
            <div className="font-semibold text-white">Coimbatore</div>
          </div>
          <div className="p-4 rounded-xl bg-[rgba(251,113,133,0.15)] border border-[rgba(251,113,133,0.3)]">
            <div className="text-sm text-[#fda4af] mb-1">Hot Zone</div>
            <div className="font-semibold text-white">Bengaluru</div>
          </div>
          <div className="p-4 rounded-xl bg-[rgba(251,113,133,0.15)] border border-[rgba(251,113,133,0.3)]">
            <div className="text-sm text-[#fda4af] mb-1">Hot Zone</div>
            <div className="font-semibold text-white">Hyderabad</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-[#64748b]">
          Emerging markets: <span className="text-[#a7b4c8]">Madurai, Mysuru, Vijayawada</span>
        </div>
      </Card>

      {/* 7-Day Forecast */}
      <Card className="p-6 border-l-4 border-l-[#7cdbff]">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-[#7cdbff]" />
          <h2 className="text-lg font-semibold text-white">7-Day Demand Forecast</h2>
          <Badge variant="info">AI-Generated</Badge>
        </div>
        <p className="text-[#a7b4c8]">
          "Expect +40% respiratory queries in Coimbatore next week. Likely cause: monsoon onset (historical correlation: 0.87)"
        </p>
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
          <Button variant="ghost" size="sm">Set staffing alert</Button>
        </div>
      </Card>
    </div>
  );
}
