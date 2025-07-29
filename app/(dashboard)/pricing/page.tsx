// File: app/(dashboard)/pricing/page.tsx

'use client';

// We may not need these server actions immediately, but we'll keep them for future Stripe integration.
// import { checkoutAction } from '@/lib/payments/actions';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// A placeholder for the checkout action until Stripe is fully configured.
const placeholderCheckoutAction = async (formData: FormData) => {
  const priceId = formData.get('priceId');
  alert(`Checkout initiated for price ID: ${priceId}`);
};

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-glitch-pink rounded-full animate-float opacity-40"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '2px #ec4899'}}>
            Find Your <span className="text-glitch-pink" style={{textShadow: '0 0 20px rgba(255,20,147,0.8)'}}>Reformat Plan</span>
          </h1>
          <p className="mt-4 text-lg text-fuchsia-400 font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '0 0 10px rgba(217,70,239,0.6)'}}>
            Heartbreak shouldn't last forever. Neither should your subscription.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Freemium Plan */}
          <PricingCard
            name="Freemium"
            price={0}
            interval="one-time"
            description="A preview of the tools to get you started."
            features={[
              { text: '7-Day Healing Program Preview', included: true },
              { text: 'No Contact Day Counter', included: true },
              { text: 'Limited AI Tool Previews', included: true },
              { text: 'Read-Only Confessional Wall', included: true },
              { text: 'Full AI Tool Access', included: false },
              { text: '30-Day Basic Reset Program', included: false },
              { text: 'Post on Confessional Wall', included: false },
            ]}
            cta="Start for Free"
            isFeatured={false}
          />

          {/* Basic Plan */}
          <PricingCard
            name="Basic"
            price={9}
            interval="month"
            description="Full access to all tools for a monthly reset."
            features={[
              { text: 'Everything in Freemium, plus:', included: true },
              { text: 'Full AI Tool Access', included: true },
              { text: '30-Day Basic Reset Program', included: true },
              { text: 'Post & React on Confessional Wall', included: true },
              { text: 'Unlock All Savage Badges', included: true },
              { text: '90-Day Deep Reset Program', included: false },

            ]}
            priceId="price_basic_monthly" // Replace with your actual Stripe Price ID
            cta="Choose Basic"
            isFeatured={true}
          />

          {/* Deep Reset Plan */}
          <PricingCard
            name="Deep Reset"
            price={19}
            interval="one-time"
            description="A one-time payment for a 90-day deep dive."
            features={[
              { text: '90-Day Deep Reset Program', included: true },
              { text: 'No AI Tools, No Community', included: true },
              { text: 'Focused Self-Paced Healing', included: true },
              { text: 'Ideal for a Digital Detox', included: true },
            ]}
            priceId="price_deep_reset_onetime" // Replace with your actual Stripe Price ID
            cta="Choose Deep Reset"
            isFeatured={false}
          />
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

function PricingCard({
  name,
  price,
  interval,
  description,
  features,
  priceId,
  cta,
  isFeatured,
}: {
  name: string;
  price: number;
  interval: string;
  description: string;
  features: { text: string; included: boolean }[];
  priceId?: string;
  cta: string;
  isFeatured: boolean;
}) {
  return (
    <div className={`flex flex-col p-8 bg-gray-900/60 backdrop-blur-sm rounded-2xl border-2 ${isFeatured ? 'border-glitch-pink shadow-[0_0_40px_rgba(255,20,147,0.3)]' : 'border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]'} hover:scale-105 transition-all duration-300`}>
      {isFeatured && (
        <div className="text-center mb-4 text-sm font-black text-glitch-pink bg-glitch-pink/20 border border-glitch-pink/50 rounded-xl py-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
          🔥 MOST POPULAR
        </div>
      )}
      <h3 className="text-2xl font-black text-center text-white mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
        {name.toUpperCase()}
      </h3>
      <p className="mt-2 text-center text-white/90 h-10 font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
        {description}
      </p>
      <div className="mt-6 text-center text-white">
        <span className="text-4xl font-black" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
          ${price}
        </span>
        <span className="text-base font-bold text-fuchsia-400" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
          / {interval}
        </span>
      </div>
      <ul className="mt-8 space-y-4 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {feature.included ? (
               <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
               <X className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <span className="text-white font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      <form action={placeholderCheckoutAction} className="mt-8">
        <input type="hidden" name="priceId" value={priceId} />
        <Button
          type="submit"
          className={`w-full text-lg font-black py-4 rounded-xl transition-all duration-300 ${
            isFeatured 
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 text-white shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)]' 
              : 'border-2 border-blue-400 text-blue-400 bg-transparent hover:bg-blue-400 hover:text-gray-900 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          }`}
          style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}
        >
          {cta.toUpperCase()}
        </Button>
      </form>
    </div>
  );
}
