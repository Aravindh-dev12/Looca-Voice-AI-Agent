'use client';

import { motion } from 'framer-motion';
import { Bot, Mic, Settings, Plus, Check, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const agents = [
  {
    name: 'Looca for Apollo',
    type: 'Main agent',
    status: 'live',
    number: '+91-1800-APOLLO',
    activeCalls: 23,
    model: 'Claude Haiku 3.5',
    latency: '420ms avg',
    voice: 'Swara (warm Indian female)',
    escalation: '4%',
  },
  {
    name: 'Looca Emergency',
    type: 'Emergency agent',
    status: 'live',
    trigger: 'urgency_score > 0.85',
    triggersToday: 12,
    action: 'Alert ICU + auto-call ambulance',
  },
];

const metrics = [
  { label: 'Intent accuracy', value: '94.2%', target: '>90%', status: 'pass' },
  { label: 'Qdrant hit rate', value: '91.4%', target: '>85%', status: 'pass' },
  { label: 'Avg latency', value: '420ms', target: '<500ms', status: 'pass' },
  { label: 'Escalation rate', value: '4.1%', target: '<8%', status: 'pass' },
  { label: 'User satisfaction', value: '4.7/5', target: '>4.5', status: 'pass' },
];

export default function AgentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Voice Agents</h1>
          <p className="text-[#a7b4c8]">Configure and tune your AI agents</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add New Agent
        </Button>
      </div>

      {/* Agents List */}
      <div className="space-y-4">
        {agents.map((agent) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(124,219,255,0.2)] to-[rgba(139,92,246,0.2)] flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[#7cdbff]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{agent.name}</h3>
                      <p className="text-sm text-[#64748b]">{agent.type}</p>
                    </div>
                    <Badge variant="success" dot>● {agent.status.toUpperCase()}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {agent.number && (
                      <div>
                        <span className="text-[#64748b]">Number:</span>
                        <p className="text-white font-medium">{agent.number}</p>
                      </div>
                    )}
                    {agent.activeCalls && (
                      <div>
                        <span className="text-[#64748b]">Active:</span>
                        <p className="text-white font-medium">{agent.activeCalls} calls</p>
                      </div>
                    )}
                    {agent.model && (
                      <div>
                        <span className="text-[#64748b]">Model:</span>
                        <p className="text-white">{agent.model}</p>
                      </div>
                    )}
                    {agent.latency && (
                      <div>
                        <span className="text-[#64748b]">Latency:</span>
                        <p className="text-[#34d399]">{agent.latency}</p>
                      </div>
                    )}
                    {agent.voice && (
                      <div>
                        <span className="text-[#64748b]">Voice:</span>
                        <p className="text-white">{agent.voice}</p>
                      </div>
                    )}
                    {agent.escalation && (
                      <div>
                        <span className="text-[#64748b]">Escalation:</span>
                        <p className="text-[#a7b4c8]">{agent.escalation}</p>
                      </div>
                    )}
                    {agent.trigger && (
                      <div className="col-span-2">
                        <span className="text-[#64748b]">Trigger:</span>
                        <p className="text-[#fb7185]">{agent.trigger}</p>
                      </div>
                    )}
                    {agent.action && (
                      <div className="col-span-2">
                        <span className="text-[#64748b]">Action:</span>
                        <p className="text-[#34d399]">{agent.action}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <Settings className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mic className="w-4 h-4 mr-2" /> Test
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-[#7cdbff]" />
          <h2 className="text-lg font-semibold text-white">Agent Performance</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs text-[#64748b]">{metric.label}</span>
                <Check className="w-3 h-3 text-[#34d399]" />
              </div>
              <div className="text-xl font-bold text-white">{metric.value}</div>
              <div className="text-xs text-[#64748b]">Target: {metric.target}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Prompt Tuning */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-[#fbbf24]" />
          <h2 className="text-lg font-semibold text-white">Prompt Tuning (Advanced)</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm">View current system prompt</Button>
          <Button variant="secondary" size="sm">A/B test prompts</Button>
          <Button variant="ghost" size="sm">Fine-tune for domain</Button>
          <Button variant="ghost" size="sm">Emotion response config</Button>
        </div>
      </Card>

      {/* Add New Agent Options */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Add New Agent</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'Outbound campaign agent',
            'WhatsApp agent',
            'Internal staff agent',
            'Custom workflow agent',
          ].map((type) => (
            <Card key={type} className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#7cdbff]" />
                <span className="text-sm text-[#a7b4c8]">{type}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
