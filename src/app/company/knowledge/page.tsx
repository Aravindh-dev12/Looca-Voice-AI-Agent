'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Upload, Globe, Plus, FileText, Check } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';

const collections = [
  { name: 'services', count: 1247, hitRate: '91%', color: 'bg-[#7cdbff]' },
  { name: 'episodes', count: 847, hitRate: 'N/A', color: 'bg-[#a78bfa]' },
  { name: 'unmet_queries', count: 312, hitRate: 'needs content', color: 'bg-[#fb7185]' },
];

const gaps = [
  { query: 'dialysis center', attempts: 847, priority: 'high' },
  { query: 'mental health', attempts: 612, priority: 'high' },
  { query: 'parking at hospital', attempts: 234, priority: 'medium' },
];

const topRetrieved = [
  { content: 'Appointment booking process', retrieved: 847 },
  { content: 'OPD timings and departments', retrieved: 623 },
  { content: 'Lab result collection guide', retrieved: 412 },
];

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
          <p className="text-[#a7b4c8]">Manage your Looca knowledge and semantic search</p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#34d399]" />
          <Badge variant="success">Qdrant Live · 1,247 vectors</Badge>
        </div>
      </div>

      {/* Collection Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map((col) => (
          <Card key={col.name} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${col.color}/20 flex items-center justify-center`}>
                <Database className={`w-5 h-5 ${col.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="font-semibold text-white capitalize">{col.name.replace('_', ' ')}</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{col.count.toLocaleString()}</div>
            <p className="text-sm text-[#64748b]">documents</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className={`text-sm ${col.hitRate.includes('%') ? 'text-[#34d399]' : 'text-[#fb7185]'}`}>
                Hit rate: {col.hitRate}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Search Test */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-[#7cdbff]" />
          <h2 className="text-lg font-semibold text-white">Semantic Search Test</h2>
        </div>
        <p className="text-sm text-[#64748b] mb-4">Test what Looca knows by typing a patient question:</p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type a patient question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-[#7cdbff]/50"
          />
          <Button>Test Search</Button>
        </div>
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.2)]"
          >
            <div className="flex items-center gap-2 text-[#34d399]">
              <Check className="w-4 h-4" />
              <span className="text-sm">Score: 0.87 ✓ (3 results found)</span>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Top Retrieved */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Top Retrieved Content</h2>
        <p className="text-sm text-[#64748b] mb-4">What users ask about most:</p>
        <div className="space-y-3">
          {topRetrieved.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <span className="text-[#64748b] font-mono">{idx + 1}.</span>
                <span className="text-[#a7b4c8]">{item.content}</span>
              </div>
              <Badge variant="info">Retrieved {item.retrieved}x this week</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Gaps to Fill */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#fb7185]" />
          Gaps to Fill
        </h2>
        <p className="text-sm text-[#64748b] mb-4">Unmet queries needing content:</p>
        <div className="space-y-3">
          {gaps.map((gap) => (
            <motion.div
              key={gap.query}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className={`p-4 ${gap.priority === 'high' ? 'border-l-4 border-l-[#fb7185]' : 'border-l-4 border-l-[#fbbf24]'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={gap.priority === 'high' ? 'danger' : 'warning'}>
                      {gap.priority === 'high' ? '🔴' : '🟡'}
                    </Badge>
                    <span className="text-white">"{gap.query}"</span>
                    <span className="text-[#64748b]">{gap.attempts} attempts</span>
                  </div>
                  <Button size="sm">Add content</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Auto Ingestion */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-[#34d399]" />
          <h2 className="text-lg font-semibold text-white">Auto-Ingestion</h2>
          <Badge variant="success">Running every 6 hours</Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-[#34d399]">
            <Check className="w-4 h-4" /> ✓ 4 mins ago: Apollo website crawl — 3 new pages added
          </div>
          <div className="flex items-center gap-2 text-[#34d399]">
            <Check className="w-4 h-4" /> ✓ 1 hr ago: Fee schedule PDF — chunked + embedded
          </div>
          <div className="flex items-center gap-2 text-[#fbbf24]">
            <span className="animate-pulse">⟳</span> Now: Processing new discharge policy circular
          </div>
        </div>
      </Card>

      {/* Add Content Actions */}
      <div className="flex flex-wrap gap-3">
        <Button><Plus className="w-4 h-4 mr-2" /> Add document</Button>
        <Button variant="secondary"><Globe className="w-4 h-4 mr-2" /> Crawl URL</Button>
        <Button variant="secondary"><Upload className="w-4 h-4 mr-2" /> Bulk upload</Button>
        <Button variant="ghost"><FileText className="w-4 h-4 mr-2" /> API ingest</Button>
      </div>
    </div>
  );
}
