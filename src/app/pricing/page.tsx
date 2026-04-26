import { PageLayout } from '@/components/PageLayout';
import { Zap, Shield, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui';

export default function PricingPage() {
  return (
    <PageLayout 
      title="Pricing" 
      subtitle="Simple, transparent plans designed for personal growth and social impact."
      icon={<Zap className="h-20 w-20 text-amber-500" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        {[
          {
            name: 'Basic',
            price: 'Free',
            desc: 'Essential voice intelligence for everyone.',
            features: ['100 Voice Sessions / mo', 'Standard Memory (24h)', 'Hindi & English Support', 'Emergency Alerts'],
            button: 'Get Started',
            popular: false
          },
          {
            name: 'Pro',
            price: '$12/mo',
            desc: 'Infinite memory and deep cross-app actions.',
            features: ['Unlimited Voice Sessions', 'Episodic Memory (Lifetime)', 'All Indian Languages', 'Autonomous Browser Agent', 'WhatsApp Integration'],
            button: 'Go Pro',
            popular: true
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            desc: 'For hospitals and NGOs supporting thousands.',
            features: ['Multi-user Management', 'On-premise Deployment', 'Dedicated GPU Support', 'HIPAA Compliant Memory', 'API Access'],
            button: 'Contact Sales',
            popular: false
          }
        ].map((plan, i) => (
          <div key={i} className={`relative p-10 rounded-[40px] border ${plan.popular ? 'border-black bg-white shadow-2xl scale-105 z-10' : 'border-zinc-100 bg-zinc-50'}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="text-4xl font-black tracking-tighter mb-4">{plan.price}</div>
            <p className="text-sm text-gray-500 mb-8">{plan.desc}</p>
            
            <ul className="space-y-4 mb-10">
              {plan.features.map((f, fi) => (
                <li key={fi} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>
            
            <Button className={`w-full h-14 rounded-2xl font-bold ${plan.popular ? 'bg-black text-white hover:bg-zinc-800' : 'bg-white text-black border border-zinc-200 hover:bg-zinc-100'}`}>
              {plan.button}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mt-32 p-12 rounded-[48px] bg-black text-white text-center">
         <h2 className="text-4xl font-black tracking-tighter mb-6">Built for Social Good</h2>
         <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
           Are you an NGO or a healthcare professional? We offer free Pro licenses for organizations working with the elderly or dementia care.
         </p>
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200 h-14 px-10 rounded-full font-black shadow-xl">
            Apply for Impact License
          </Button>
      </div>
    </PageLayout>
  );
}
