'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Building2, Check, Sparkles, Zap, Shield, Users, 
  Globe, CreditCard, ArrowRight, Loader2, Key, BarChart3 
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useAuth } from '@/components/AuthProvider';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For small teams getting started',
    price: 4999,
    priceYearly: 49990,
    popular: false,
    features: [
      '5,000 voice calls/month',
      '3 team members',
      '2 languages',
      'Basic analytics',
      'Email support',
      '1 API key',
    ],
    limits: { calls: 5000, members: 3, languages: 2 },
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'For growing organizations',
    price: 14999,
    priceYearly: 149990,
    popular: true,
    features: [
      '25,000 voice calls/month',
      '10 team members',
      '10+ Indian languages',
      'Advanced analytics',
      'Priority support',
      '5 API keys',
      'Custom voice agent',
      'Integration support',
    ],
    limits: { calls: 25000, members: 10, languages: 10 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large-scale deployment',
    price: null,
    priceYearly: null,
    popular: false,
    features: [
      'Unlimited voice calls',
      'Unlimited team members',
      'All 22+ Indian languages',
      'Real-time intelligence',
      'Dedicated support',
      'Unlimited API keys',
      'Custom AI training',
      'On-premise option',
      'SLA guarantee',
    ],
    limits: { calls: 'unlimited', members: 'unlimited', languages: 22 },
  },
];

const steps = [
  { id: 'plan', title: 'Select Plan', description: 'Choose your enterprise tier' },
  { id: 'org', title: 'Organization', description: 'Set up your company' },
  { id: 'payment', title: 'Payment', description: 'Complete purchase' },
  { id: 'deploy', title: 'Deploy', description: 'Go live instantly' },
];

export default function UpgradePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orgData, setOrgData] = useState({
    name: '',
    industry: '',
    email: '',
    phone: '',
  });

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setCurrentStep(1);
  };

  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const { refreshUser } = useAuth();

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('looca_token');
      
      // 1. In a real app, you'd handle payment here (Razorpay/Stripe)
      // For this implementation, we proceed to create the Org
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/orgs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: orgData.name,
          // You could add logo_url if uploaded
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to create organization');
      }

      await refreshUser();
      
      setIsProcessing(false);
      setCurrentStep(3);
      
      // Auto-redirect after deployment
      setTimeout(() => {
        router.push('/company/dashboard');
      }, 2500);
    } catch (error: any) {
      alert(error.message || 'Something went wrong');
      setIsProcessing(false);
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="accent" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" /> Upgrade to Enterprise
          </Badge>
          <h1 className="text-4xl font-bold text-[#0f172a] mb-4">
            Unlock the full power of Looca
          </h1>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            Upgrade to Enterprise and deploy AI voice agents for your entire organization.
            Automatic setup in under 4 minutes.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
                  ${index < currentStep ? 'bg-zinc-100 text-black border border-zinc-200' : ''}
                  ${index === currentStep ? 'bg-black text-white' : ''}
                  ${index > currentStep ? 'bg-white text-zinc-400 border border-zinc-100' : ''}
                `}>
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <div className="ml-3 hidden sm:block text-left">
                  <p className={`text-sm font-bold ${index <= currentStep ? 'text-black' : 'text-zinc-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-zinc-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${index < currentStep ? 'bg-black' : 'bg-zinc-100'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Select Plan */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`p-6 relative flex flex-col ${plan.popular ? 'border-black border-2' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="info">Most Popular</Badge>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#0f172a]">{plan.name}</h3>
                    <p className="text-sm text-[#64748b]">{plan.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    {plan.price ? (
                      <>
                        <span className="text-4xl font-bold text-[#0f172a]">₹{plan.price.toLocaleString()}</span>
                        <span className="text-[#64748b]">/month</span>
                        <p className="text-sm text-[#64748b] mt-1">
                          ₹{plan.priceYearly?.toLocaleString()}/year (17% off)
                        </p>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-[#0f172a]">Custom Pricing</div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-zinc-500">
                        <Check className="w-4 h-4 text-black" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Button
                      className="w-full border-2 border-transparent"
                      variant={plan.popular ? 'primary' : 'secondary'}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {plan.id === 'enterprise' ? 'Contact Sales' : 'Select Plan'}
                    </Button>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Step 2: Organization Setup */}
          {currentStep === 1 && selectedPlanData && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto"
            >
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0f172a]">Create Organization</h2>
                    <p className="text-sm text-[#64748b]">{selectedPlanData.name} Plan</p>
                  </div>
                </div>

                <form onSubmit={handleOrgSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#64748b] mb-2 text-left">Company Name</label>
                    <input
                      type="text"
                      required
                      value={orgData.name}
                      onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-[#0f172a] focus:outline-none focus:border-[#0ea5e9]/50"
                      placeholder="Apollo Hospitals"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#a7b4c8] mb-2">Industry</label>
                    <select
                      required
                      value={orgData.industry}
                      onChange={(e) => setOrgData({ ...orgData, industry: e.target.value })}
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                    >
                      <option value="">Select industry</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="government">Government</option>
                      <option value="finance">Finance</option>
                      <option value="retail">Retail</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#64748b] mb-2 text-left">Company Email</label>
                    <input
                      type="email"
                      required
                      value={orgData.email}
                      onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-[#0f172a] focus:outline-none focus:border-[#0ea5e9]/50"
                      placeholder="admin@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#a7b4c8] mb-2">Phone</label>
                    <input
                      type="tel"
                      value={orgData.phone}
                      onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                      placeholder="+91-98XXX-XXXXX"
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" size="lg">
                      Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="w-full mt-3 text-sm text-[#64748b] hover:text-white transition-colors"
                    >
                      ← Back to plans
                    </button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto"
            >
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black">Complete Purchase</h2>
                    <p className="text-sm text-zinc-500">Secure payment powered by Razorpay</p>
                  </div>
                </div>

                <div className="bg-[#f8fafc] rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#64748b]">Plan</span>
                    <span className="text-[#0f172a] font-medium">{selectedPlanData?.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#64748b]">Organization</span>
                    <span className="text-[#0f172a] font-medium">{orgData.name}</span>
                  </div>
                  <div className="border-t border-[#e2e8f0] pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#0f172a] font-medium">Total (monthly)</span>
                      <span className="text-2xl font-bold text-[#0f172a]">₹{selectedPlanData?.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay ₹{selectedPlanData?.price?.toLocaleString()} <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full text-sm text-[#64748b] hover:text-white transition-colors"
                  >
                    ← Back to organization setup
                  </button>
                </div>

                <p className="text-xs text-[#64748b] text-center mt-4">
                  By purchasing, you agree to our Terms of Service and Privacy Policy.
                  Enterprise plan auto-renews monthly. Cancel anytime.
                </p>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Deployment Success */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <Card className="p-8">
                <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-black mb-2">
                  Your Organization is Live!
                </h2>
                <p className="text-zinc-500 mb-6">
                  Looca Enterprise has been automatically deployed for {orgData.name}
                </p>

                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-zinc-100">
                    <Key className="w-5 h-5 text-black" />
                    <div>
                      <p className="text-sm font-medium text-black">API Key Generated</p>
                      <p className="text-xs text-zinc-400">looca_live_••••••••••••••</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-zinc-100">
                    <Users className="w-5 h-5 text-black" />
                    <div>
                      <p className="text-sm font-medium text-black">Team Dashboard</p>
                      <p className="text-xs text-zinc-400">Ready for {selectedPlanData?.limits.members} members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-black" />
                    <div>
                      <p className="text-sm font-medium text-black">Analytics</p>
                      <p className="text-xs text-zinc-400">Real-time call monitoring enabled</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#64748b] mb-4">
                  Redirecting to your company dashboard...
                </p>

                <Button className="w-full" onClick={() => router.push('/company/dashboard')}>
                  Open Company Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Indicators */}
        {currentStep < 3 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-zinc-100 flex items-center justify-center mb-3 shadow-sm">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <p className="text-sm font-medium text-[#0f172a]">Enterprise Security</p>
              <p className="text-xs text-zinc-500">SOC 2 Compliant</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-zinc-100 flex items-center justify-center mb-3 shadow-sm">
                <Globe className="w-6 h-6 text-black" />
              </div>
              <p className="text-sm font-medium text-black">22+ Languages</p>
              <p className="text-xs text-zinc-500">Including all Indian languages</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-zinc-100 flex items-center justify-center mb-3 shadow-sm">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <p className="text-sm font-medium text-black">4-Minute Setup</p>
              <p className="text-xs text-zinc-500">Fully automated deployment</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-zinc-100 flex items-center justify-center mb-3 shadow-sm">
                <Users className="w-6 h-6 text-black" />
              </div>
              <p className="text-sm font-medium text-black">24/7 Support</p>
              <p className="text-xs text-zinc-500">Dedicated enterprise team</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
