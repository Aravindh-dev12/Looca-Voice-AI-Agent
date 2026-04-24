'use client';

import { motion } from 'framer-motion';
import { Key, Copy, RotateCw, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, Button, Badge } from '@/components/ui';

export default function ApiKeysPage() {
  const keys = [
    { id: 1, name: 'Main API Key', key: 'looca_live_sk_7y2...9a2', created: '2026-04-20', status: 'active' },
    { id: 2, name: 'Testing Key', key: 'looca_test_sk_1w5...3b7', created: '2026-04-21', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">API Keys</h1>
          <p className="text-[#64748b]">Manage your keys to access Looca Voice APIs</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Key
        </Button>
      </div>

      <div className="grid gap-4">
        {keys.map((key) => (
          <Card key={key.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f0f9ff] flex items-center justify-center">
                  <Key className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0f172a]">{key.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-[#f1f5f9] px-2 py-0.5 rounded text-xs font-mono text-[#0f172a]">
                      {key.key}
                    </code>
                    <button className="p-1 hover:bg-[#f1f5f9] rounded transition-colors text-[#64748b]">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success">Active</Badge>
                <div className="h-8 w-px bg-[#e2e8f0]" />
                <button className="p-2 hover:bg-[#f1f5f9] rounded-lg text-[#64748b] transition-colors" title="Rotate Key">
                  <RotateCw className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Revoke Key">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
