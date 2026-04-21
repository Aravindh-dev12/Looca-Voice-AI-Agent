'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, Users, CheckCircle } from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui';

export default function CompanySignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    email: '',
    phone: '',
    role: '',
    users: '1000-50000',
  });

  const industries = ['Healthcare', 'Education', 'Government', 'Finance', 'Retail', 'Other'];
  const roles = ['CEO / Founder', 'CTO / IT Head', 'Operations Head', 'Product Manager', 'Other'];

  const handleSubmit = () => {
    // Navigate to onboarding
    window.location.href = '/company/onboard';
  };

  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Badge variant="accent" className="mb-4">Looca for Companies</Badge>
          <h1 className="text-3xl font-bold text-white mb-2">
            Your entire organization, voice-intelligent
          </h1>
          <p className="text-[#a7b4c8]">In under 4 minutes. No code required.</p>
        </div>

        <Card gradient className="p-8">
          <div className="space-y-4">
            <Input
              label="Company name"
              placeholder="Apollo Hospitals"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-[#a7b4c8] mb-2">Industry</label>
              <select 
                className="w-full bg-[rgba(3,7,18,0.5)] border border-[rgba(148,163,184,0.2)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7cdbff]/50"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option value="">Select industry</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <Input
              label="Company email"
              type="email"
              placeholder="admin@apollohospitals.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Phone"
              placeholder="+91-98XXX-XXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-[#a7b4c8] mb-2">Your role</label>
              <select 
                className="w-full bg-[rgba(3,7,18,0.5)] border border-[rgba(148,163,184,0.2)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7cdbff]/50"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="">Select role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a7b4c8] mb-3">How many users will Looca serve?</label>
              <div className="flex gap-3">
                {['Under 1,000', '1,000–50,000', '50,000+'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, users: option })}
                    className={`flex-1 py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                      formData.users === option
                        ? 'border-[#7cdbff] bg-[rgba(124,219,255,0.15)] text-white'
                        : 'border-white/10 text-[#a7b4c8] hover:border-white/20'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button className="w-full mt-6" size="lg" onClick={handleSubmit}>
            Create account & start onboarding <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        {/* Trust badges */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#64748b] mb-3">Already used by:</p>
          <div className="flex items-center justify-center gap-6 text-[#a7b4c8]">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> Apollo</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> State Health Dept</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Jana Finance</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
