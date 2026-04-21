'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Link, Database, Mic, Rocket, ChevronRight, 
  ChevronLeft, Globe, FileText, Languages, Sparkles 
} from 'lucide-react';
import { Card, Button, Badge, Input } from '@/components/ui';

const steps = [
  { id: 1, title: 'Connect Systems', icon: Link },
  { id: 2, title: 'Knowledge Base', icon: Database },
  { id: 3, title: 'Voice Agent', icon: Mic },
  { id: 4, title: 'Go Live', icon: Rocket },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Go live
      setLoading(true);
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            window.location.href = '/company/dashboard';
          }, 500);
        }
      }, 100);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Connect your systems</h2>
              <p className="text-[#a7b4c8]">Looca will read them and auto-configure everything.</p>
            </div>

            {/* Option A */}
            <Card className="p-6 border-l-4 border-l-[#7cdbff]">
              <Badge variant="accent" className="mb-3">Option A — Fastest</Badge>
              <h3 className="font-medium text-white mb-2">Paste your API docs URL</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="https://internal.apollo.com/api/docs"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-[#64748b]"
                />
                <Button>Connect</Button>
              </div>
              <p className="text-xs text-[#64748b] mt-2">Looca will crawl and understand your API in 2 minutes</p>
            </Card>

            {/* Option B */}
            <Card className="p-6">
              <Badge variant="info" className="mb-3">Option B — For Developers</Badge>
              <h3 className="font-medium text-white mb-2">One-line CLI</h3>
              <div className="bg-[#0d1729] rounded-xl p-4 font-mono text-sm text-[#a7b4c8]">
                <div className="text-[#34d399]">$ pip install looca-cli</div>
                <div>$ looca integrate --org apollo --connect [his,emr,appt]</div>
              </div>
            </Card>

            {/* Option C */}
            <Card className="p-6">
              <h3 className="font-medium text-white mb-3">Quick Connect (pre-built)</h3>
              <div className="flex flex-wrap gap-2">
                {['HIS / Hospital', 'EMR', 'Appointments', 'Billing', 'Lab Results', 'Pharmacy', 'Insurance', 'Govt Portal'].map((item) => (
                  <button key={item} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#a7b4c8] hover:border-[#7cdbff]/30 transition-colors">
                    {item}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Build your knowledge base</h2>
              <p className="text-[#a7b4c8]">Add content Looca should know about your organization.</p>
            </div>

            {/* Auto Discovery */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[rgba(124,219,255,0.15)] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#7cdbff]" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Auto-Discovery</h3>
                  <p className="text-xs text-[#64748b]">AI reading your website now</p>
                </div>
              </div>
              <div className="bg-[#0d1729] rounded-xl p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#34d399]">
                  <Check className="w-4 h-4" /> ✓ Scanning services pages...
                </div>
                <div className="flex items-center gap-2 text-[#34d399]">
                  <Check className="w-4 h-4" /> ✓ Found 47 service descriptions
                </div>
                <div className="flex items-center gap-2 text-[#34d399]">
                  <Check className="w-4 h-4" /> ✓ Found 23 FAQ items
                </div>
                <div className="flex items-center gap-2 text-[#fbbf24]">
                  <Sparkles className="w-4 h-4 animate-spin" /> ⟳ Processing department info...
                </div>
              </div>
            </Card>

            {/* Add Documents */}
            <Card className="p-6 border-2 border-dashed border-white/20">
              <div className="text-center">
                <FileText className="w-12 h-12 text-[#7cdbff] mx-auto mb-4" />
                <h3 className="font-medium text-white mb-2">Add Documents</h3>
                <p className="text-sm text-[#a7b4c8] mb-4">Drop PDFs, Word docs, CSVs here</p>
                <Button variant="secondary">Browse files</Button>
              </div>
            </Card>

            {/* Languages */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Languages className="w-5 h-5 text-[#a78bfa]" />
                <h3 className="font-medium text-white">Languages to Support</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam', 'English', '+17 more'].map((lang) => (
                  <button 
                    key={lang}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      ['Tamil', 'Hindi', 'Telugu', 'Kannada', 'English'].includes(lang)
                        ? 'border-[#34d399] bg-[rgba(52,211,153,0.15)] text-[#a7f3d0]'
                        : 'border-white/20 text-[#a7b4c8] hover:border-white/30'
                    }`}
                  >
                    {['Tamil', 'Hindi', 'Telugu', 'Kannada', 'English'].includes(lang) && <Check className="w-3 h-3 inline mr-1" />}
                    {lang}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Configure your voice agent</h2>
              <p className="text-[#a7b4c8]">Customize how Looca sounds and behaves for your users.</p>
            </div>

            {/* Phone Number */}
            <Card className="p-6">
              <h3 className="font-medium text-white mb-4">Your Voice Number</h3>
              <div className="flex items-center justify-between p-4 bg-[rgba(52,211,153,0.1)] rounded-xl border border-[rgba(52,211,153,0.2)]">
                <div>
                  <div className="text-2xl font-bold text-[#34d399]">+91-1800-APOLLO</div>
                  <p className="text-xs text-[#64748b]">Ready to activate</p>
                </div>
                <Badge variant="success">Available</Badge>
              </div>
            </Card>

            {/* Agent Persona */}
            <Card className="p-6">
              <h3 className="font-medium text-white mb-4">Agent Persona</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#64748b]">Name</label>
                  <input 
                    type="text" 
                    value="Looca for Apollo"
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                  />
                  <p className="text-xs text-[#64748b] mt-1">Users hear "Hi, I'm Looca from Apollo Hospitals"</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#64748b]">Voice</label>
                    <select className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white">
                      <option>Warm Indian female</option>
                      <option>Professional Indian male</option>
                      <option>Friendly neutral</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-[#64748b]">Tone</label>
                    <div className="flex gap-2 mt-1">
                      {['Formal', 'Warm', 'Clinical'].map((t) => (
                        <button 
                          key={t}
                          className={`flex-1 py-2 rounded-lg text-sm border ${
                            t === 'Warm' 
                              ? 'border-[#7cdbff] bg-[rgba(124,219,255,0.15)] text-white' 
                              : 'border-white/10 text-[#a7b4c8]'
                          }`}
                        >
                          {t === 'Warm' && <span className="mr-1">●</span>}{t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Capabilities */}
            <Card className="p-6">
              <h3 className="font-medium text-white mb-4">What can Looca do?</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Book appointments', 'Check lab results', 'Answer health FAQs',
                  'Emergency routing', 'Bill enquiries', 'Find nearest branch'
                ].map((cap) => (
                  <label key={cap} className="flex items-center gap-2 p-3 rounded-lg bg-white/5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#7cdbff]" />
                    <span className="text-sm text-[#a7b4c8]">{cap}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            {!loading ? (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#34d399] to-[#7cdbff] flex items-center justify-center mx-auto">
                  <Rocket className="w-10 h-10 text-[#07111f]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">Your Looca Agent is Going Live</h2>
                  <p className="text-[#a7b4c8]">Review everything before launch</p>
                </div>

                <Card className="p-6 text-left">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-[#34d399]">
                      <Check className="w-4 h-4" /> ✓ Systems connected (HIS, EMR, Appointments)
                    </div>
                    <div className="flex items-center gap-2 text-[#34d399]">
                      <Check className="w-4 h-4" /> ✓ Knowledge base built (1,247 vectors in Qdrant)
                    </div>
                    <div className="flex items-center gap-2 text-[#34d399]">
                      <Check className="w-4 h-4" /> ✓ Languages configured (Tamil, Hindi, Telugu +4)
                    </div>
                    <div className="flex items-center gap-2 text-[#34d399]">
                      <Check className="w-4 h-4" /> ✓ Voice agent deployed
                    </div>
                    <div className="flex items-center gap-2 text-[#34d399]">
                      <Check className="w-4 h-4" /> ✓ Voice number active (+91-1800-APOLLO)
                    </div>
                    <div className="flex items-center gap-2 text-[#34d399]">
                      <Check className="w-4 h-4" /> ✓ Dashboard ready
                    </div>
                  </div>
                </Card>

                <div className="bg-gradient-to-r from-[rgba(52,211,153,0.15)] to-[rgba(124,219,255,0.15)] rounded-xl p-6 border border-[rgba(52,211,153,0.3)]">
                  <p className="text-3xl font-bold text-[#34d399] mb-1">+91-1800-APOLLO</p>
                  <p className="text-sm text-[#a7b4c8]">Your patients can call this number — in any Indian language, 24/7, no internet required</p>
                </div>
              </>
            ) : (
              <div className="py-12">
                <div className="w-24 h-24 rounded-full border-4 border-[#7cdbff]/20 border-t-[#7cdbff] animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-white mb-2">Launching Looca...</h2>
                <div className="w-full max-w-xs mx-auto h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#34d399] to-[#7cdbff] transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[#a7b4c8] mt-4">{progress}% complete</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.id <= currentStep 
                  ? 'border-[#7cdbff] bg-[rgba(124,219,255,0.15)] text-[#7cdbff]' 
                  : 'border-white/20 text-[#64748b]'
              }`}>
                {step.id < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  step.id < currentStep ? 'bg-[#7cdbff]' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>

        <Card gradient className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={handleNext} disabled={loading}>
              {currentStep === 4 ? (
                loading ? 'Launching...' : 'Go Live!'
              ) : (
                <>Next <ChevronRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
