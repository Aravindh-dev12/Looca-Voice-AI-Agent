'use client';

import { motion } from 'framer-motion';
import { Users, Smartphone, Globe, BookOpen, Activity, AlertCircle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const callerData = [
  { name: '60+', value: 41, color: '#7cdbff' },
  { name: '40-60', value: 33, color: '#a78bfa' },
  { name: '18-40', value: 26, color: '#34d399' },
];

const genderData = [
  { name: 'Female', value: 54, color: '#f472b6' },
  { name: 'Male', value: 46, color: '#7cdbff' },
];

const deviceData = [
  { name: 'Feature phone', value: 38, color: '#fbbf24' },
  { name: 'Smartphone', value: 62, color: '#34d399' },
];

const needsData = [
  { label: 'Appointment booking', value: 44, color: '#7cdbff' },
  { label: 'Lab result enquiry', value: 22, color: '#a78bfa' },
  { label: 'Bill payment info', value: 18, color: '#34d399' },
  { label: 'Discharge guidance', value: 12, color: '#fbbf24' },
  { label: 'Emergency assistance', value: 4, color: '#fb7185' },
];

export default function UsersPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">User Intelligence</h1>
        <p className="text-[#a7b4c8]">Who is calling, what they need, deep behavioral analytics</p>
      </div>

      {/* Caller Profile Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-[#a7b4c8] mb-4">Age Distribution</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={callerData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value">
                  {callerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d1729', border: '1px solid rgba(148,163,184,0.2)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            <span className="text-[#7cdbff]">● 60+: 41%</span>
            <span className="text-[#a78bfa]">● 40-60: 33%</span>
            <span className="text-[#34d399]">● 18-40: 26%</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-[#a7b4c8] mb-4">Gender</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value">
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d1729', border: '1px solid rgba(148,163,184,0.2)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-2 mt-2 text-xs">
            <span className="text-[#f472b6]">● Female: 54%</span>
            <span className="text-[#7cdbff]">● Male: 46%</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-[#a7b4c8] mb-4">Device Type</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value">
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d1729', border: '1px solid rgba(148,163,184,0.2)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-2 mt-2 text-xs">
            <span className="text-[#fbbf24]">● Feature phone: 38%</span>
            <span className="text-[#34d399]">● Smartphone: 62%</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-[#a7b4c8] mb-4">Internet During Call</h3>
          <div className="flex flex-col justify-center h-32">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#64748b]">None during call</span>
                  <span className="text-white">67%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[67%] bg-[#fbbf24] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#64748b]">Has internet</span>
                  <span className="text-white">33%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[33%] bg-[#34d399] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Needs */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-[#7cdbff]" />
          <h2 className="text-lg font-semibold text-white">Top Needs This Week</h2>
        </div>
        <div className="space-y-4">
          {needsData.map((need) => (
            <div key={need.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#a7b4c8]">{need.label}</span>
                <span className="text-white font-medium">{need.value}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${need.value}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: need.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Language Distribution */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-[#a78bfa]" />
          <h2 className="text-lg font-semibold text-white">Language Distribution</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { lang: 'Tamil', pct: '34%', color: 'bg-[#7cdbff]' },
            { lang: 'Hindi', pct: '28%', color: 'bg-[#a78bfa]' },
            { lang: 'Telugu', pct: '18%', color: 'bg-[#34d399]' },
            { lang: 'Kannada', pct: '12%', color: 'bg-[#fbbf24]' },
            { lang: 'Other', pct: '8%', color: 'bg-white/20' },
          ].map((l) => (
            <div key={l.lang} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
              <span className={`w-2 h-2 rounded-full ${l.color}`} />
              <span className="text-sm text-[#a7b4c8]">{l.lang}</span>
              <span className="text-sm font-medium text-white">{l.pct}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Emotion Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-[#fb7185]" />
            <h3 className="font-semibold text-white">Anxious Calls</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">18%</div>
          <p className="text-sm text-[#34d399]">91% resolved successfully</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-[#fbbf24]" />
            <h3 className="font-semibold text-white">Confused Calls</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">23%</div>
          <p className="text-sm text-[#a7b4c8]">Looca switched to simple mode</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-5 h-5 text-[#fbbf24]" />
            <h3 className="font-semibold text-white">Urgent Calls</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">4%</div>
          <p className="text-sm text-[#fb7185]">12 emergencies today</p>
        </Card>
      </div>
    </div>
  );
}
