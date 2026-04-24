'use client';

import { Lock, Shield, Eye, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, Button, Badge } from '@/components/ui';

export default function SecurityPage() {
  const settings = [
    { title: 'Multi-Factor Authentication', description: 'Require MFA for all organization members', status: 'enabled', icon: ShieldCheck },
    { title: 'SSO Integration', description: 'Connect your enterprise identity provider', status: 'disabled', icon: Lock },
    { title: 'API Usage Alerts', description: 'Notify when usage exceeds 80% of limit', status: 'enabled', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">Security & Permissions</h1>
        <p className="text-[#64748b]">Configure access control and safety settings</p>
      </div>

      <div className="grid gap-6">
        {settings.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f8fafc] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#0f172a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f172a]">{item.title}</h3>
                    <p className="text-sm text-[#64748b]">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={item.status === 'enabled' ? 'success' : 'default'}>
                    {item.status === 'enabled' ? 'Active' : 'Disabled'}
                  </Badge>
                  <Button variant="ghost" size="sm">Configure</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 border-l-4 border-l-[#0ea5e9]">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-[#f0f9ff]">
            <Shield className="w-5 h-5 text-[#0ea5e9]" />
          </div>
          <div>
            <h3 className="font-bold text-[#0f172a]">Security Log</h3>
            <p className="text-sm text-[#64748b] mt-1">Review critical access and change events across your organization.</p>
            <Button variant="ghost" size="sm" className="mt-4 px-0 hover:bg-transparent text-[#0ea5e9]">
              View full audit log →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
