'use client';

import { motion } from 'framer-motion';
import { Shield, Check, Clock, Download, AlertCircle } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const regulations = [
  { name: 'ABDM compliance', status: 'compliant', desc: 'All interactions logged' },
  { name: 'DPDP Act', status: 'compliant', desc: 'Consent captured for all data access' },
  { name: 'NABH standard', status: 'compliant', desc: 'Audit trail complete' },
  { name: 'Data residency', status: 'compliant', desc: 'India (Mumbai region only)' },
];

const todaySummary = [
  { label: 'Voice consents captured', value: '2,847' },
  { label: 'DigiLocker access events', value: '847' },
  { label: 'Emergency protocol triggers', value: '12' },
  { label: 'Human escalations', value: '116 (4.1%)' },
];

const auditLogs = [
  { time: '10:24:01', call: '#2847', event: 'Aadhaar accessed', status: '✓ Consent captured' },
  { time: '10:22:34', call: '#2839', event: 'Booking confirmed', status: '✓ ABDM log' },
  { time: '10:18:12', call: '#2821', event: 'Emergency triggered', status: '✓ ICU alerted' },
];

export default function CompliancePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance & Audit Trail</h1>
          <p className="text-[#a7b4c8]">Regulatory status and audit logs</p>
        </div>
        <Badge variant="success">All Systems Compliant</Badge>
      </div>

      {/* Regulatory Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {regulations.map((reg) => (
          <motion.div
            key={reg.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-5 border-l-4 border-l-[#34d399]">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#34d399]" />
                <span className="text-sm text-[#64748b]">{reg.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#34d399]" />
                <span className="font-medium text-white">{reg.desc}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Today's Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#7cdbff]" />
          Today's Compliance Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {todaySummary.map((item) => (
            <div key={item.label} className="p-4 rounded-xl bg-white/5">
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <div className="text-sm text-[#64748b]">{item.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit Log */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Audit Log</h2>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" /> Download CSV
          </Button>
        </div>
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.time} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
              <span className="text-sm text-[#64748b] font-mono">{log.time}</span>
              <span className="text-[#7cdbff] font-mono">{log.call}</span>
              <span className="text-[#a7b4c8]">{log.event}</span>
              <span className="text-[#34d399] ml-auto">{log.status}</span>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4">Load more</Button>
      </Card>

      {/* Data Retention */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-[#fbbf24]" />
          <h2 className="text-lg font-semibold text-white">Data Retention</h2>
        </div>
        <div className="space-y-2 text-sm text-[#a7b4c8]">
          <p>Call transcripts: <span className="text-white">7 years</span> (NABH requirement)</p>
          <p>Voice consent recordings: <span className="text-white">7 years</span></p>
          <p>User memory (episodic): <span className="text-white">Until user deletes</span></p>
        </div>
      </Card>
    </div>
  );
}
