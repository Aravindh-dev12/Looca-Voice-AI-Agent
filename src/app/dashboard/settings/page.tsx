'use client';

import { useState } from 'react';
import { Sliders, Type, FastForward, Eye, MessageCircle, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import { useAuth } from '@/components/AuthProvider';

export default function AccessibilitySettingsPage() {
  const { user, logout } = useAuth();
  const [speed, setSpeed] = useState(50);
  const [size, setSize] = useState(60);
  const [contrast, setContrast] = useState(100);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header - Simple & Calming */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-black text-black uppercase tracking-widest">
          <Sliders className="w-3 h-3" />
          Tuning
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight">
          Settings
        </h1>
        <p className="text-zinc-500 text-lg font-medium">
          Change how VIOS talks and looks to fit your needs.
        </p>
      </div>

      {/* Main Settings Sliders */}
      <div className="space-y-6">
        <Card className="p-10 border-2 border-zinc-100 bg-white">
          <div className="space-y-12">
            
            {/* AI Speed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center">
                    <FastForward className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-black">Talking Speed</h3>
                    <p className="text-zinc-500 text-sm font-medium">How fast should VIOS speak?</p>
                  </div>
                </div>
                <Badge variant="secondary" className="px-4 py-1 rounded-full font-black text-black">{speed < 40 ? 'Slow' : speed > 70 ? 'Fast' : 'Normal'}</Badge>
              </div>
              <input
                type="range"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-3 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-black"
              />
            </div>

            {/* Text Size */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center">
                    <Type className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-black">Text Size</h3>
                    <p className="text-zinc-500 text-sm font-medium">How big should the words be?</p>
                  </div>
                </div>
                <Badge variant="secondary" className="px-4 py-1 rounded-full font-black text-black">{size < 40 ? 'Small' : size > 70 ? 'Big' : 'Normal'}</Badge>
              </div>
              <input
                type="range"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-3 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-black"
              />
            </div>

            {/* Visual Contrast */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-black">Screen Contrast</h3>
                    <p className="text-zinc-500 text-sm font-medium">Make the screen easier to see.</p>
                  </div>
                </div>
                <Badge variant="secondary" className="px-4 py-1 rounded-full font-black text-black">{contrast > 80 ? 'High' : 'Standard'}</Badge>
              </div>
              <input
                type="range"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full h-3 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-black"
              />
            </div>

          </div>
        </Card>

        {/* User Profile Card */}
        <Card className="p-8 border-2 border-zinc-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-zinc-100 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-black text-black overflow-hidden uppercase">
              {user?.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.[0] || 'U'}</span>
              )}
            </div>
            <div>
              <h4 className="text-2xl font-black text-black">{user?.name || 'User'}</h4>
              <p className="text-zinc-400 font-medium">{user?.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Protected by VIOS</span>
              </div>
            </div>
          </div>
          <Button variant="danger" className="rounded-full px-8 h-12" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </Card>
      </div>

      {/* Assurance Card */}
      <div className="bg-black p-10 rounded-[2.5rem] relative overflow-hidden">
        <CheckCircle className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5" />
        <h3 className="text-white text-2xl font-black mb-4">"Your comfort is our priority."</h3>
        <p className="text-white/60 font-medium max-w-sm">
          VIOS automatically adjusts to you the more you talk, but you can always change these sliders anytime.
        </p>
      </div>
    </div>
  );
}
