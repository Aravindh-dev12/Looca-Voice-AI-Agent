'use client';

import { motion } from 'framer-motion';
import { Link2, Database, Check, Plus, Globe, Shield } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const systems = [
  { name: 'HIS', fullName: 'Apollo HIS', status: 'connected', latency: '89ms avg', logs: true },
  { name: 'EMR', fullName: 'Epic EMR', status: 'connected', records: '847/day', logs: true },
  { name: 'Appointments', fullName: 'SlotMD', status: 'connected', slots: '4,200 synced', logs: true },
  { name: 'Billing', fullName: 'Billing System', status: 'connected', logs: true },
  { name: 'Lab system', fullName: 'Lab Integration', status: 'disconnected', connect: true },
  { name: 'Pharmacy', fullName: 'Pharmacy Connect', status: 'disconnected', connect: true },
];

const govApis = [
  { name: 'ABDM', desc: 'Hospital booking', status: 'connected' },
  { name: 'DigiLocker', desc: 'Identity', status: 'connected' },
  { name: 'UMANG', desc: 'All-govt gateway', status: 'disconnected', connect: true },
];

const recentLogs = [
  { time: '10:24:02', event: 'VAPI call.ended #2841 → episode stored ✓' },
  { time: '10:24:01', event: 'ABDM booking #AH-9847 confirmed ✓' },
  { time: '10:23:58', event: 'Qdrant upsert 3 vectors ✓' },
];

export default function IntegrationsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Integrations</h1>
          <p className="text-[#a7b4c8]">Connected systems and API management</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Integration
        </Button>
      </div>

      {/* Connected Systems */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Connected Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((sys) => (
            <motion.div
              key={sys.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className={`p-5 ${sys.status === 'connected' ? 'border-l-4 border-l-[#34d399]' : 'border-l-4 border-l-[#64748b]'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className={`w-5 h-5 ${sys.status === 'connected' ? 'text-[#34d399]' : 'text-[#64748b]'}`} />
                    <span className="font-semibold text-white">{sys.name}</span>
                  </div>
                  <Badge variant={sys.status === 'connected' ? 'success' : 'default'}>
                    {sys.status === 'connected' ? '● Active' : '○ Not connected'}
                  </Badge>
                </div>
                <p className="text-sm text-[#a7b4c8] mb-2">{sys.fullName}</p>
                {sys.latency && <p className="text-xs text-[#34d399]">API latency: {sys.latency}</p>}
                {sys.records && <p className="text-xs text-[#a7b4c8]">{sys.records}</p>}
                {sys.slots && <p className="text-xs text-[#34d399]">{sys.slots}</p>}
                {sys.status === 'connected' ? (
                  <Button variant="ghost" size="sm" className="mt-3">View logs</Button>
                ) : (
                  <Button size="sm" className="mt-3">Connect →</Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Government APIs */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#fbbf24]" />
          Government APIs
        </h2>
        <div className="flex flex-wrap gap-3">
          {govApis.map((api) => (
            <div 
              key={api.name}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                api.status === 'connected' 
                  ? 'border-[#34d399]/30 bg-[rgba(52,211,153,0.1)]' 
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <span className="font-medium text-white">{api.name}</span>
              <span className="text-sm text-[#64748b]">{api.desc}</span>
              {api.status === 'connected' ? (
                <Check className="w-4 h-4 text-[#34d399]" />
              ) : (
                <Button size="sm">Connect</Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add New Integration */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add New Integration</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Paste API docs URL → Looca auto-configures in 5 mins"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#64748b]"
          />
          <Button>Connect</Button>
        </div>
        <p className="text-sm text-[#64748b] mt-3">
          Or use CLI: <code className="text-[#7cdbff]">looca connect --org apollo --add [system_name]</code>
        </p>
      </Card>

      {/* Webhook Logs */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Webhook Logs (last 100 events)</h2>
        <div className="space-y-2 font-mono text-sm">
          {recentLogs.map((log) => (
            <div key={log.time} className="flex items-center gap-3 text-[#a7b4c8]">
              <span className="text-[#64748b]">{log.time}</span>
              <span>{log.event}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
