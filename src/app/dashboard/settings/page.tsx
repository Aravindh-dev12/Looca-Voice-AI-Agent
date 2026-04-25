'use client';

import { useState } from 'react';
import { CheckCircle, Eye, FastForward, LogOut, ShieldCheck, Sliders, Type } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { useAuth } from '@/components/AuthProvider';

export default function AccessibilitySettingsPage() {
  const { user, logout } = useAuth();
  const [speed, setSpeed] = useState(50);
  const [size, setSize] = useState(60);
  const [contrast, setContrast] = useState(100);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <Sliders className="h-3.5 w-3.5" />
          Cognitive settings
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Settings</h1>
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Tune how Looca speaks, displays information, and adapts to your accessibility preferences.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-slate-200 bg-white p-8">
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <FastForward className="h-5 w-5 text-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">Talking speed</h3>
                    <p className="text-sm text-slate-500">How fast Looca should speak.</p>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full px-4 py-1">
                  {speed < 40 ? 'Slow' : speed > 70 ? 'Fast' : 'Normal'}
                </Badge>
              </div>
              <input
                type="range"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-black"
              />
            </div>

            <div className="space-y-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <Type className="h-5 w-5 text-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">Text size</h3>
                    <p className="text-sm text-slate-500">Scale interface text for comfort.</p>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full px-4 py-1">
                  {size < 40 ? 'Small' : size > 70 ? 'Large' : 'Normal'}
                </Badge>
              </div>
              <input
                type="range"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-black"
              />
            </div>

            <div className="space-y-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <Eye className="h-5 w-5 text-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">Screen contrast</h3>
                    <p className="text-sm text-slate-500">Make key UI surfaces easier to read.</p>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full px-4 py-1">
                  {contrast > 80 ? 'High' : 'Standard'}
                </Badge>
              </div>
              <input
                type="range"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-black"
              />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 text-2xl font-bold uppercase text-slate-950 shadow-sm">
                {user?.image ? (
                  <img src={user.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span>{user?.name?.[0] || 'U'}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-2xl font-semibold text-slate-950">{user?.name || 'User'}</h4>
                <p className="truncate text-sm text-slate-500">{user?.email}</p>
                <div className="mt-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">Protected by Looca</span>
                </div>
              </div>
            </div>
            <Button variant="danger" className="mt-6 h-12 rounded-full px-6" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </Card>

          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-8 text-white">
            <CheckCircle className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5" />
            <h3 className="mb-4 text-2xl font-semibold tracking-tight">Your comfort stays in control.</h3>
            <p className="max-w-sm text-sm leading-7 text-white/70">
              Looca adapts to how you speak over time, but these settings always let you decide the pace, readability,
              and visual clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
