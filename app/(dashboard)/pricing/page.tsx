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
    <div className="text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-100 sm:text-5xl">Find Your Reformat Plan</h1>
        <p className="mt-4 text-lg text-gray-400">Heartbreak shouldn't last forever. Neither should your subscription.</p>
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
    <div className={`flex flex-col p-6 bg-gray-800 rounded-lg border ${isFeatured ? 'border-pink-500' : 'border-gray-700'}`}>
      {isFeatured && <div className="text-center mb-4 text-sm font-bold text-pink-400">Most Popular</div>}
      <h3 className="text-2xl font-bold text-center text-white">{name}</h3>
      <p className="mt-2 text-center text-gray-400 h-10">{description}</p>
      <div className="mt-6 text-center text-gray-100">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-base font-medium text-gray-400">/ {interval}</span>
      </div>
      <ul className="mt-8 space-y-4 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {feature.included ? (
               <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
               <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <span className="text-gray-300">{feature.text}</span>
          </li>
        ))}
      </ul>
      <form action={placeholderCheckoutAction} className="mt-8">
        <input type="hidden" name="priceId" value={priceId} />
        <Button
          type="submit"
          className={`w-full text-lg ${isFeatured ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
        >
          {cta}
        </Button>
      </form>
    </div>
  );
}
