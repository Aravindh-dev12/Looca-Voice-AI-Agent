import { PageLayout } from '@/components/PageLayout';
import { Brain, Heart, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <PageLayout 
      title="About Looca" 
      subtitle="We are building the first persistent intelligence layer that understands the human condition through voice."
      icon={<Brain className="h-20 w-20" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
        <div className="space-y-6">
          <h3 className="text-3xl font-bold tracking-tighter">Our Mission</h3>
          <p className="text-gray-600 leading-relaxed">
            Looca was born from a simple observation: the digital divide is getting wider. While the world moves to complex screens and apps, millions of people—the elderly, the children, and the low-literacy populations—are being left behind.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe the most natural interface is the one we've used for thousands of years: **The Voice.**
          </p>
        </div>
        <div className="bg-zinc-50 rounded-[40px] p-10 border border-zinc-100">
           <Heart className="h-10 w-10 text-red-500 mb-6" />
           <h4 className="text-xl font-bold mb-4">Empathetic Intelligence</h4>
           <p className="text-sm text-gray-500 leading-relaxed">
             Looca doesn't just process commands. It detects emotional prosody, urgency, and grief, allowing it to act as a silent guardian for those who need it most.
           </p>
        </div>
      </div>

      <div className="mt-32 space-y-12">
        <h2 className="text-5xl font-black tracking-tighter">The Technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: 'Episodic Memory', desc: 'A long-term timeline of your life built from every syllable spoken.', icon: Brain },
             { title: 'Global Reach', desc: 'Supporting 10+ Indian languages and 50+ dialects instantly.', icon: Globe },
             { title: 'Local Safety', desc: 'Scam detection and emergency protocols built directly into the voice engine.', icon: Heart }
           ].map((item, i) => (
             <div key={i} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <item.icon className="h-8 w-8 text-black mb-4" />
               <h5 className="font-bold mb-2">{item.title}</h5>
               <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </PageLayout>
  );
}
