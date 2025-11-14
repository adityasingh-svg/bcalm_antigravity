import PricingSection from '../PricingSection';

export default function PricingSectionExample() {
  return (
    <PricingSection 
      onEnroll={() => console.log('Enroll clicked')} 
      onJoinWaitlist={() => console.log('Pricing waitlist clicked')} 
    />
  );
}
