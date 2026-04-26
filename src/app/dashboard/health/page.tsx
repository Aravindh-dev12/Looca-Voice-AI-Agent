'use client';

import { motion } from 'framer-motion';
import { Activity, TrendingUp, Pill, Calendar, AlertCircle, Check } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const painData = [
  { date: 'Feb 10', severity: 3 },
  { date: 'Feb 28', severity: 3 },
  { date: 'Mar 14', severity: 5 },
  { date: 'Apr 7', severity: 6 },
];

const conditions = [
  { 
    name: 'Knee pain', 
    trend: 'worsening', 
    mentions: 4, 
    period: '8 weeks', 
    severity: '6/10',
    history: '3 → 4 → 5 → 6',
    last: 'April 7',
    alert: true 
  },
  { 
    name: 'Hypertension', 
    trend: 'new', 
    mentions: 1, 
    period: 'New — diagnosed Apr 20', 
    severity: 'BP 148/92',
    history: 'Stage 1',
    last: 'Prescribed Amlodipine 5mg',
    alert: false 
  },
];

const medicines = [
  { name: 'Amlodipine 5mg', schedule: 'Daily, morning', doses: [{ date: 'Apr 20', taken: true }, { date: 'Apr 21', taken: false }, { date: 'Apr 22', taken: false }, { date: 'Apr 23', taken: false }] },
];

const healthEvents = [
  { date: 'Apr 20', event: 'Diagnosed hypertension, BP 148/92', type: 'diagnosis' },
  { date: 'Apr 7', event: 'Knee pain mentioned (severity 6/10)', type: 'pain' },
  { date: 'Mar 14', event: 'Knee pain mentioned (severity 5/10)', type: 'pain' },
  { date: 'Feb 28', event: 'General checkup (all normal except BP slightly high)', type: 'checkup' },
  { date: 'Feb 10', event: 'Knee pain first mentioned (severity 3/10)', type: 'pain' },
];

export default function HealthPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Health Timeline</h1>
          <p className="text-[#a7b4c8]">Built entirely from what you have mentioned in conversations</p>
        </div>
        <Badge variant="info">AI-Powered Insights</Badge>
      </div>

      {/* Conditions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Conditions Looca Has Heard You Mention</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conditions.map((condition) => (
            <motion.div
              key={condition.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className={`p-6 ${condition.alert ? 'border-l-4 border-l-[#fb7185]' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{condition.name}</h3>
                  {condition.alert && <TrendingUp className="w-5 h-5 text-[#fb7185]" />}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Trend:</span>
                    <span className={condition.alert ? 'text-[#fb7185]' : 'text-[#34d399]'}>
                      {condition.trend === 'worsening' ? '↗ worsening' : 'New diagnosis'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Severity history:</span>
                    <span className="text-white">{condition.history}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Current:</span>
                    <span className="text-white">{condition.severity}</span>
                  </div>
                  <p className="text-[#a7b4c8] text-xs mt-2">
                    Mentioned {condition.mentions} times over {condition.period}
                  </p>
                </div>
                {condition.alert && (
                  <Button size="sm" className="mt-4">Book ortho consult</Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pain Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Knee Pain Severity Trend</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={painData}>
              <CartesianGrid stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d1729', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px' }}
                itemStyle={{ color: '#7cdbff' }}
              />
              <Line 
                type="monotone" 
                dataKey="severity" 
                stroke="#fb7185" 
                strokeWidth={3}
                dot={{ fill: '#fb7185', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-[#fb7185] mt-4">
          <AlertCircle className="w-4 h-4 inline mr-1" />
          Knee pain has worsened from 3/10 to 6/10 over 10 weeks. Recommend booking orthopedic consult this week.
        </p>
      </Card>

      {/* Medicine Tracker */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-[#7cdbff]" />
          Medicine Tracker
        </h2>
        {medicines.map((med) => (
          <Card key={med.name} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">{med.name}</h3>
                <p className="text-sm text-[#a7b4c8]">{med.schedule}</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex gap-4">
              {med.doses.map((dose) => (
                <div key={dose.date} className="text-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1 ${dose.taken ? 'bg-[#34d399] text-[#07111f]' : 'border border-[#a7b4c8]/30'}`}>
                    {dose.taken ? <Check className="w-5 h-5" /> : <span className="text-white/30">○</span>}
                  </div>
                  <span className="text-xs text-[#64748b]">{dose.date}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#a7b4c8] mt-4">
              Say "I took my medicine" or Looca will ask at 9am
            </p>
          </Card>
        ))}
      </div>

      {/* Health Events Timeline */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Health Events Timeline</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {healthEvents.map((event, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  event.type === 'diagnosis' ? 'bg-[#fb7185]' :
                  event.type === 'pain' ? 'bg-[#fbbf24]' :
                  'bg-[#34d399]'
                }`} />
                <div className="flex-1 pb-4 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#64748b] font-mono">{event.date}</span>
                    <span className="text-[#a7b4c8]">— {event.event}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Looca Insight */}
      <Card gradient className="p-6 border-l-4 border-l-[#7cdbff]">
        <div className="flex items-start gap-3">
          <Activity className="w-6 h-6 text-[#7cdbff] mt-1" />
          <div>
            <h3 className="font-semibold text-white mb-2">Looca Insight</h3>
            <p className="text-[#a7b4c8]">
              Based on your conversation patterns, your knee pain correlates with days when you mention long walks. 
              Consider shorter, more frequent walks instead of occasional long ones.
            </p>
            <div className="flex gap-3 mt-4">
              <Button size="sm">Book orthopedic consult</Button>
              <Button variant="ghost" size="sm">View detailed analysis</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
