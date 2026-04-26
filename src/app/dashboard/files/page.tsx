'use client';

import { motion } from 'framer-motion';
import { FileText, Upload, Search, MessageSquare, Share2, Eye } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const files = [
  {
    id: 1,
    name: 'Apollo_Discharge_Summary_Apr20.pdf',
    date: 'Today',
    type: 'Medical report',
    info: 'Hypertension diagnosis, Amlodipine prescribed',
    autoAdded: true,
  },
  {
    id: 2,
    name: 'Land_Mutation_Form_7_Panchayat.pdf',
    date: 'April 18',
    type: 'Government form',
    info: 'Status: Incomplete — Field 12 (witness signature) missing',
    note: '2 witnesses required. Still pending.',
    autoAdded: false,
  },
  {
    id: 3,
    name: 'PM-KISAN_Letter_March2026.pdf',
    date: 'March 5',
    type: 'Government letter',
    info: 'PM-KISAN installment ₹2000 credited March 1',
    note: 'Next installment: Expected July 1, 2026',
    autoAdded: false,
  },
];

const quickQuestions = [
  'What medicines am I currently taking?',
  'What government forms do I have pending?',
  'Summarize my last hospital visit',
];

export default function FilesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Files</h1>
          <p className="text-[#a7b4c8]">Drop any file here. Looca will read and remember it.</p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" /> Upload File
        </Button>
      </div>

      {/* Upload Zone */}
      <Card className="p-12 text-center border-2 border-dashed border-[rgba(148,163,184,0.3)] hover:border-[#7cdbff]/50 transition-colors cursor-pointer">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgba(124,219,255,0.15)] to-[rgba(139,92,246,0.15)] flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-[#7cdbff]" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Drop files here or click to browse</h3>
        <p className="text-sm text-[#a7b4c8]">PDF · DOC · Image · Audio · Any file</p>
      </Card>

      {/* Recently Analyzed */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recently Analyzed</h2>
        <div className="space-y-4">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(124,219,255,0.15)] to-[rgba(139,92,246,0.15)] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#7cdbff]" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-white">{file.name}</h3>
                      {file.autoAdded && (
                        <Badge variant="success" dot>Auto-added</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#a7b4c8]">
                      <span>Analyzed: {file.date}</span>
                      <span>·</span>
                      <span>{file.type}</span>
                    </div>
                    <p className="text-[#a7b4c8] mt-2">{file.info}</p>
                    {file.note && (
                      <p className="text-sm text-[#fbbf24] mt-1">Looca note: "{file.note}"</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" /> Ask about
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ask About Your Files */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Ask About Your Files</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickQuestions.map((question) => (
            <Card 
              key={question} 
              className="p-4 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#a7b4c8] group-hover:text-white transition-colors">{question}</span>
                <MessageSquare className="w-4 h-4 text-[#7cdbff] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
