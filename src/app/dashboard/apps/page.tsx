'use client';

import { motion } from 'framer-motion';
import { 
  Video, Calendar, Globe, Mail, MessageSquare, 
  Activity, FileText, Monitor, Bell, Check, Plus 
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const integrations = [
  { category: 'Meetings & Calls', items: [
    { name: 'Zoom', connected: true, desc: 'Auto-transcribe all calls' },
    { name: 'Google Meet', connected: true, desc: 'Auto-transcribe all calls' },
    { name: 'Microsoft Teams', connected: false, desc: 'Connect to enable' },
  ]},
  { category: 'Productivity', items: [
    { name: 'Google Calendar', connected: true, desc: 'Looca reads your schedule' },
    { name: 'Browser Extension', connected: true, desc: 'Read pages for you' },
  ]},
  { category: 'Communication', items: [
    { name: 'Gmail', connected: false, desc: 'Connect to enable' },
    { name: 'WhatsApp', connected: false, desc: 'Connect to enable' },
  ]},
  { category: 'Health', items: [
    { name: 'Health Connect', connected: false, desc: 'Sync health data' },
  ]},
];

const loocaFeatures = [
  { icon: Monitor, name: 'Screen Reader', desc: 'Read any text on screen aloud', enabled: true },
  { icon: FileText, name: 'Clipboard Watcher', desc: 'Explain copied text', enabled: true },
  { icon: Globe, name: 'Screenshot to Text', desc: 'Take screenshot, Looca reads it', enabled: true },
  { icon: Bell, name: 'Notification Reader', desc: 'Read notifications aloud', enabled: false },
];

export default function AppsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Connected Apps</h1>
          <p className="text-[#a7b4c8]">Integrations and Looca Desktop Intelligence</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Integration
        </Button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((section) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 h-full">
              <h2 className="text-lg font-semibold text-white mb-4">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div 
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.connected 
                          ? 'bg-[rgba(52,211,153,0.15)]' 
                          : 'bg-white/5'
                      }`}>
                        {item.connected ? (
                          <Check className="w-5 h-5 text-[#34d399]" />
                        ) : (
                          <Plus className="w-5 h-5 text-[#64748b]" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{item.name}</h3>
                        <p className="text-xs text-[#64748b]">{item.desc}</p>
                      </div>
                    </div>
                    <Badge variant={item.connected ? 'success' : 'default'}>
                      {item.connected ? 'Connected' : 'Connect'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Looca Intelligence Features */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Looca Desktop Intelligence</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loocaFeatures.map((feature) => (
            <Card key={feature.name} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  feature.enabled 
                    ? 'bg-[rgba(124,219,255,0.15)]' 
                    : 'bg-white/5'
                }`}>
                  <feature.icon className={`w-5 h-5 ${feature.enabled ? 'text-[#7cdbff]' : 'text-[#64748b]'}`} />
                </div>
                <div className={`w-8 h-4 rounded-full ${feature.enabled ? 'bg-[#34d399]' : 'bg-[#64748b]/30'} relative`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                    feature.enabled ? 'left-4' : 'left-0.5'
                  }`} />
                </div>
              </div>
              <h3 className="font-medium text-white text-sm">{feature.name}</h3>
              <p className="text-xs text-[#64748b] mt-1">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
