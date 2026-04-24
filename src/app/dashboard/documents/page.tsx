'use client';

import { FileText, Plus, FileCode, FileType, Search } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';

export default function DocumentsPage() {
  const docs = [
    { name: 'Income Certificate Application', type: 'Draft', date: '2026-04-21', status: 'ready' },
    { name: 'Hospital Discharge Summary', type: 'Medical', date: '2026-04-18', status: 'archived' },
    { name: 'RTI Request - Water Supply', type: 'Legal', date: '2026-04-15', status: 'sent' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Documents</h1>
          <p className="text-[#64748b]">Generate and manage formal documents from your voice input</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Document
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
        <input 
          placeholder="Search documents..." 
          className="w-full bg-white border border-[#e2e8f0] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
        />
      </div>

      <div className="grid gap-4">
        {docs.map((doc) => (
          <Card key={doc.name} className="p-4 hover:border-[#0ea5e9]/30 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-[#64748b] group-hover:bg-[#f0f9ff] group-hover:text-[#0ea5e9] transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-[#0f172a]">{doc.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#94a3b8]">{doc.type}</span>
                    <span className="text-xs text-[#e2e8f0]">•</span>
                    <span className="text-xs text-[#94a3b8]">{doc.date}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
