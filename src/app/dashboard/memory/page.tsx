'use client';

import { motion } from 'framer-motion';
import { Search, Play, Trash2, Calendar, MessageSquare } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';

const episodes = [
  { id: 1, date: 'Apr 7, 2026', time: '2:34pm', duration: '8 min', category: 'Health', emotion: 'Concerned', lang: 'Tamil', summary: 'Asked about knee pain remedies. Looca suggested physiotherapy and clinic visit.', actions: 'Searched health knowledge (3 results)', unresolved: 'Appointment not confirmed' },
  { id: 2, date: 'Apr 5, 2026', time: '11:20am', duration: '5 min', category: 'Government', emotion: 'Neutral', lang: 'Hindi', summary: 'Enquired about ration card renewal process. Looca provided step-by-step guide.', actions: 'Retrieved government docs', unresolved: null },
  { id: 3, date: 'Mar 28, 2026', time: '4:15pm', duration: '12 min', category: 'Health', emotion: 'Anxious', lang: 'Tamil', summary: 'Discussed blood pressure readings and medication schedule. Looca set reminders.', actions: 'Created medicine reminders', unresolved: null },
];

const categoryColors: Record<string, string> = {
  'Health': 'bg-[rgba(124,219,255,0.15)] text-[#7cdbff] border-[rgba(124,219,255,0.3)]',
  'Government': 'bg-[rgba(52,211,153,0.15)] text-[#34d399] border-[rgba(52,211,153,0.3)]',
  'Finance': 'bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border-[rgba(251,191,36,0.3)]',
  'Education': 'bg-[rgba(139,92,246,0.15)] text-[#a78bfa] border-[rgba(139,92,246,0.3)]',
};

export default function MemoryPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Memory</h1>
          <p className="text-[#a7b4c8]">Every conversation, stored privately on this device</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search memory..."
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#7cdbff]/50 w-64"
            />
          </div>
          <Badge variant="info">847 episodes · 3.2GB</Badge>
        </div>
      </div>

      {/* Timeline View */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-[#a7b4c8]">Jan 2026</span>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-[#a7b4c8]">Feb</span>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-[#a7b4c8]">Mar</span>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-[#a7b4c8]">Apr</span>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-[#a7b4c8]">Now</span>
        </div>

        <div className="flex gap-1 mb-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i % 3 === 0 ? 'bg-[#7cdbff]' : 
                i % 4 === 0 ? 'bg-[#34d399]' : 
                i % 5 === 0 ? 'bg-[#fbbf24]' : 
                'bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4 text-xs text-[#a7b4c8]">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#7cdbff]" /> Health</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#34d399]" /> Government</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#fbbf24]" /> Finance</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white/40" /> Other</div>
        </div>
      </Card>

      {/* Episodes List */}
      <div className="space-y-4">
        {episodes.map((episode) => (
          <motion.div
            key={episode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[episode.category] || 'bg-white/10 text-white border-white/20'}`}>
                      {episode.category}
                    </div>
                    <span className="text-sm text-[#a7b4c8]">Emotion: {episode.emotion}</span>
                    <span className="text-sm text-[#a7b4c8]">Lang: {episode.lang}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {episode.date} — {episode.time} · {episode.duration}
                  </h3>
                  
                  <p className="text-[#a7b4c8] mb-4">{episode.summary}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#64748b]">
                      <MessageSquare className="w-4 h-4" />
                      Actions: <span className="text-[#a7b4c8]">{episode.actions}</span>
                    </div>
                    {episode.unresolved && (
                      <div className="flex items-center gap-2 text-[#fb7185]">
                        <Calendar className="w-4 h-4" />
                        Unresolved: {episode.unresolved}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4 mr-2" /> Play
                  </Button>
                  <Button variant="ghost" size="sm">
                    Full transcript
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#fb7185] hover:text-[#fb7185]">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap gap-4">
        <Button variant="secondary">Export my memory</Button>
        <Button variant="danger">Delete all</Button>
        <Button variant="secondary">Sync to cloud (opt-in)</Button>
      </div>
    </div>
  );
}
