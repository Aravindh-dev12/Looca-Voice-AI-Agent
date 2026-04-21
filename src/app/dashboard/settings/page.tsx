'use client';

import { useState } from 'react';
import { Shield, Bell, Globe, Mic, Cloud, Moon, Smartphone } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);
  const [wakeWord, setWakeWord] = useState(true);

  const settings = [
    {
      category: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Local storage only', value: true, description: 'Keep all data on this device' },
        { label: 'Encrypt memories', value: true, description: 'End-to-end encryption for sensitive data' },
        { label: 'Cloud sync (opt-in)', value: cloudSync, onChange: setCloudSync, description: 'Sync to cloud for backup' },
      ]
    },
    {
      category: 'Voice & Audio',
      icon: Mic,
      items: [
        { label: 'Wake word detection', value: wakeWord, onChange: setWakeWord, description: 'Say "Hey Looca" to activate' },
        { label: 'Voice feedback', value: true, description: 'Audio responses from Looca' },
        { label: 'Language', value: 'Auto-detect', description: 'Hindi, Tamil, Telugu, Kannada, English' },
      ]
    },
    {
      category: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Proactive insights', value: notifications, onChange: setNotifications, description: 'Daily morning briefings' },
        { label: 'Medicine reminders', value: true, description: 'Alert when medication is due' },
        { label: 'Meeting alerts', value: true, description: 'Notify when meetings detected' },
      ]
    },
    {
      category: 'Appearance',
      icon: Moon,
      items: [
        { label: 'Dark mode', value: darkMode, onChange: setDarkMode, description: 'Always use dark theme' },
        { label: 'Animations', value: true, description: 'Enable motion effects' },
        { label: 'Compact view', value: false, description: 'Reduce spacing in lists' },
      ]
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-[#a7b4c8]">Manage your Looca preferences</p>
      </div>

      {/* Storage Status */}
      <Card className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(52,211,153,0.15)] to-[rgba(124,219,255,0.15)] flex items-center justify-center">
            <Cloud className="w-6 h-6 text-[#34d399]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Storage Status</h3>
            <p className="text-sm text-[#a7b4c8]">847 episodes · 3.2GB used · All local</p>
          </div>
        </div>
        <Badge variant="success">Healthy</Badge>
      </Card>

      {/* Settings Categories */}
      <div className="space-y-6">
        {settings.map((section) => (
          <Card key={section.category} className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-[#7cdbff]" />
              </div>
              <h2 className="text-lg font-semibold text-white">{section.category}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <h3 className="font-medium text-white">{item.label}</h3>
                    <p className="text-sm text-[#64748b]">{item.description}</p>
                  </div>
                  {item.onChange ? (
                    <button
                      onClick={() => item.onChange?.(!item.value)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        item.value ? 'bg-[#34d399]' : 'bg-[#64748b]/30'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        item.value ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  ) : (
                    <span className="text-sm text-[#a7b4c8]">{typeof item.value === 'boolean' ? (item.value ? 'On' : 'Off') : item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Device Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-5 h-5 text-[#7cdbff]" />
          <h2 className="text-lg font-semibold text-white">Device Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#64748b]">Status:</span>
            <span className="ml-2 text-[#34d399]">● Online — Full Intelligence</span>
          </div>
          <div>
            <span className="text-[#64748b]">Local Model:</span>
            <span className="ml-2 text-[#a7b4c8]">Phi-3 Mini 4B (Active)</span>
          </div>
          <div>
            <span className="text-[#64748b]">Wake Word:</span>
            <span className="ml-2 text-[#a7b4c8]">Porcupine (On-device)</span>
          </div>
          <div>
            <span className="text-[#64748b]">Vector Store:</span>
            <span className="ml-2 text-[#a7b4c8]">Qdrant (Embedded)</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="secondary">Export all data</Button>
        <Button variant="danger">Delete all memories</Button>
      </div>
    </div>
  );
}
