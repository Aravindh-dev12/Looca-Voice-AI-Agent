'use client';

import { Users2, Plus, Mail, Shield, MoreVertical } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

export default function TeamPage() {
  const members = [
    { id: 1, name: 'Aravindh', email: 'admin@looca.ai', role: 'Owner', status: 'active' },
    { id: 2, name: 'Ramu', email: 'ramu@company.com', role: 'Agent Manager', status: 'active' },
    { id: 3, name: 'Sita', email: 'sita@company.com', role: 'Support Agent', status: 'invited' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Team Management</h1>
          <p className="text-[#64748b]">Manage your agents and organization members</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Team Member
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7cdbff] to-[#8b5cf6] flex items-center justify-center text-white font-bold">
                      {member.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[#0f172a]">{member.name}</p>
                      <p className="text-sm text-[#64748b]">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#64748b]" />
                    <span className="text-sm text-[#0f172a]">{member.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                    {member.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-[#e2e8f0] rounded-lg text-[#64748b] transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
