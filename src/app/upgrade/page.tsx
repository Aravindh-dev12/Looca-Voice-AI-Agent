'use client';

import { Check, Mic, ShieldCheck, Sparkles, Wand2, Waves } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';

const featureTiers = [
  {
    name: 'Personal',
    price: 'Free',
    description: 'One calm dashboard for voice tasks, memory, and simplification.',
    features: ['Talk dashboard', 'Basic voice tools', 'Action receipts', 'Connected personal apps'],
  },
  {
    name: 'Looca Plus',
    price: 'INR 799 / month',
    description: 'Unlock stronger models and richer daily assistance without leaving your personal dashboard.',
    features: ['Premium voice quality', 'Priority task memory', 'Longer transcripts', 'Advanced simplification', 'More personal app connections'],
    featured: true,
  },
  {
    name: 'Looca Max',
    price: 'INR 1,999 / month',
    description: 'For the most proactive version of Looca with deeper reasoning and automation.',
    features: ['Future goal guardians', 'Advanced action planning', 'High-memory context', 'Deeper daily intelligence feed'],
  },
];

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_40%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <Card className="border-slate-200 bg-white/90">
            <div className="space-y-5">
              <Badge variant="accent" className="gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Personal upgrade
              </Badge>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                  Upgrade Looca without changing dashboards.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-slate-600">
                  No company mode. No extra workspace. Upgrading simply unlocks more power inside your same personal
                  action console.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-950 p-5 text-white">
                  <Mic className="mb-4 h-5 w-5" />
                  <p className="text-sm font-semibold">Better voice quality</p>
                  <p className="mt-2 text-sm text-slate-300">More natural speech, stronger transcription, cleaner responses.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <Wand2 className="mb-4 h-5 w-5 text-slate-950" />
                  <p className="text-sm font-semibold text-slate-950">Smarter simplification</p>
                  <p className="mt-2 text-sm text-slate-500">Explain papers, websites, and forms in a clearer way.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <ShieldCheck className="mb-4 h-5 w-5 text-slate-950" />
                  <p className="text-sm font-semibold text-slate-950">More proactive help</p>
                  <p className="mt-2 text-sm text-slate-500">Memory, reminders, action planning, and contextual guidance.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-slate-950 text-white">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Upgrade principle</p>
              <h2 className="text-3xl font-bold tracking-tight">One personal product, richer intelligence.</h2>
              <p className="text-sm leading-7 text-slate-300">
                Your user dashboard remains the main product. Upgrade should feel like new powers inside the same calm
                personal console, not a redirect into a different app.
              </p>
            </div>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featureTiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                'border-slate-200 bg-white transition-all hover:border-slate-300',
                tier.featured && 'border-slate-950 shadow-[0_30px_70px_rgba(15,23,42,0.12)] ring-1 ring-slate-950'
              )}
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{tier.name}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">{tier.price}</p>
                  </div>
                  {tier.featured && (
                    <Badge variant="accent" className="bg-slate-950 text-white">Most Popular</Badge>
                  )}
                </div>
                <p className="text-sm leading-6 text-slate-500">{tier.description}</p>

                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                        <Check className="h-3.5 w-3.5 text-slate-950" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  variant={tier.name === 'Personal' ? 'outline' : 'primary'}
                  className={cn(
                    'w-full',
                    tier.featured && 'bg-slate-950 text-white hover:bg-black'
                  )}
                >
                  {tier.name === 'Personal' ? 'Current plan' : `Choose ${tier.name}`}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
