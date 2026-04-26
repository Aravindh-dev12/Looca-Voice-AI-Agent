'use client';

import { motion } from 'framer-motion';
import { Mic, Calendar, Clock, Users, FileText, Share2, Download, Play } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const meetings = [
  {
    id: 1,
    title: 'Doctor Consultation — Dr. Nair',
    date: 'April 20, 2026',
    time: '11:30am',
    duration: '12 mins',
    lang: 'Tamil',
    speakers: 2,
    isLive: false,
    summary: 'Diagnosed mild hypertension. Prescribed Amlodipine 5mg daily. Follow-up in 6 weeks. Low-sodium diet recommended.',
    actionItems: [
      { text: 'Buy Amlodipine 5mg — nearest pharmacy: 0.8km', done: true },
      { text: 'Book follow-up: May 30 (pre-filled, confirm?)', done: false },
      { text: 'Daily walk log — Looca will ask at 7am', done: false },
    ],
    quotes: [
      'Your BP is 148/92. Not dangerous yet but we must start medication and lifestyle changes.'
    ]
  },
  {
    id: 2,
    title: 'Panchayat meeting — Land mutation',
    date: 'April 18, 2026',
    time: '3:00pm',
    duration: '22 mins',
    lang: 'Hindi',
    speakers: 4,
    isLive: false,
    summary: 'Clerk explained Form 7 requirements. Need 2 witnesses for land mutation. Revenue officer will visit site next week.',
    actionItems: [
      { text: 'Find 2 witnesses (unresolved)', done: false },
      { text: 'Prepare land documents', done: false },
    ],
    quotes: []
  }
];

export default function MeetingsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Meetings</h1>
          <p className="text-[#a7b4c8]">Live transcription + all past meeting summaries</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Mic className="w-4 h-4 mr-2" /> Record new
          </Button>
          <Button variant="ghost">Upload audio</Button>
        </div>
      </div>

      {/* Live Meeting */}
      <Card className="p-6 border-l-4 border-l-red-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-medium">LIVE NOW</span>
          </div>
          <span className="text-[#a7b4c8]">Team standup (Google Meet)</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#a7b4c8]">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Started: 10:02am</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Duration: 8 mins</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Speakers: 4</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Language: English</span>
        </div>
        <div className="flex gap-3 mt-4">
          <Button size="sm">View live transcript</Button>
          <Button variant="danger" size="sm">Stop recording</Button>
        </div>
      </Card>

      {/* Past Meetings */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Yesterday</h2>
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-[#a7b4c8]">
                      <span>{meeting.date}</span>
                      <span>·</span>
                      <span>{meeting.time}</span>
                      <span>·</span>
                      <span>{meeting.duration}</span>
                      <span>·</span>
                      <span>{meeting.lang}</span>
                    </div>
                  </div>
                  <Badge variant="success">Completed</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-[#7cdbff] mb-2">Summary</h4>
                    <p className="text-[#a7b4c8] text-sm">{meeting.summary}</p>

                    {meeting.quotes.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-[#7cdbff] mb-2">Key Quotes</h4>
                        <blockquote className="border-l-2 border-[#7cdbff] pl-4 text-sm text-[#a7b4c8] italic">
                          "{meeting.quotes[0]}"
                        </blockquote>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-[#7cdbff] mb-2">Action Items</h4>
                    <div className="space-y-2">
                      {meeting.actionItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm">
                          <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 ${item.done ? 'bg-[#34d399] text-[#07111f]' : 'border border-[#a7b4c8]/30'}`}>
                            {item.done && <span className="text-xs">✓</span>}
                          </div>
                          <span className={item.done ? 'text-[#64748b] line-through' : 'text-[#a7b4c8]'}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4 mr-2" /> Full transcript
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-2" /> Save PDF
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4 mr-2" /> Play audio
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
