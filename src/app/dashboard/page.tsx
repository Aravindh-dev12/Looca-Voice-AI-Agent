'use client';

import { motion } from 'framer-motion';
import { 
  Mic, Clock, AlertCircle, Calendar, Heart, FileText, 
  ChevronRight, Sparkles, Brain 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@/components/ui';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Good morning, Ramu</h1>
          <p className="text-[#a7b4c8] mt-1">Looca has 3 things for you today</p>
        </div>
        <Badge variant="success" dot>Online — Full Intelligence</Badge>
      </motion.div>

      {/* Proactive Briefing */}
      <motion.div variants={itemVariants}>
        <Card gradient className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[rgba(124,219,255,0.15)]">
              <Sparkles className="w-5 h-5 text-[#7cdbff]" />
            </div>
            <div>
              <CardTitle>Today's Intelligence Briefing</CardTitle>
              <CardDescription>Proactive insights from your conversations</CardDescription>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#fbbf24] mt-2" />
              <div className="flex-1">
                <h4 className="font-medium text-white">Ration card expires in 12 days</h4>
                <p className="text-sm text-[#a7b4c8] mt-1">Your PDS card needs renewal before May 3, 2026</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Renew now <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#7cdbff] mt-2" />
              <div className="flex-1">
                <h4 className="font-medium text-white">Clinic appointment tomorrow, 10am</h4>
                <p className="text-sm text-[#a7b4c8] mt-1">Rajiv Gandhi Hospital, Counter 4B. Bring Aadhaar + prescription.</p>
                <p className="text-sm text-[#a7b4c8] mt-1">Bus 42A from your street departs 8:15am</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 border-l-2 border-l-[#fb7185]">
              <div className="w-2 h-2 rounded-full bg-[#fb7185] mt-2" />
              <div className="flex-1">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#fb7185]" />
                  Knee pain mentioned 3 times in 6 weeks
                </h4>
                <p className="text-sm text-[#a7b4c8] mt-1">Severity trend: 3/10 → 4/10 → 6/10. Pattern suggests progressive joint issue.</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm">Book orthopedic consult</Button>
                  <Button variant="ghost" size="sm">Remind me later</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Voice & Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[rgba(124,219,255,0.2)] to-[rgba(139,92,246,0.2)] flex items-center justify-center mb-4">
            <Mic className="w-8 h-8 text-[#7cdbff]" />
          </div>
          <h3 className="font-semibold text-white">Quick Voice</h3>
          <p className="text-sm text-[#a7b4c8] mt-1">Say "Hey Looca" or click to talk</p>
          <Button className="mt-4 w-full">Start talking</Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-[#7cdbff]" />
            <h3 className="font-semibold text-white">Memory</h3>
          </div>
          <div className="text-3xl font-bold text-white">847</div>
          <p className="text-sm text-[#a7b4c8]">Episodes stored</p>
          <div className="mt-3 text-sm text-[#64748b]">3.2 years of conversations</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-[#34d399]" />
            <h3 className="font-semibold text-white">Today</h3>
          </div>
          <div className="text-3xl font-bold text-white">2</div>
          <p className="text-sm text-[#a7b4c8]">Conversations</p>
          <div className="mt-3 text-sm text-[#64748b]">14 mins total</div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Calendar, label: 'View Meetings', color: 'from-[#7cdbff]/20' },
            { icon: Heart, label: 'Health Timeline', color: 'from-[#fb7185]/20' },
            { icon: FileText, label: 'My Files', color: 'from-[#fbbf24]/20' },
            { icon: Sparkles, label: 'Ask Anything', color: 'from-[#34d399]/20' },
          ].map((action) => (
            <Card key={action.label} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} to-transparent flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-white">{action.label}</span>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
