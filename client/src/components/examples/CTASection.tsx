import CTASection from '../CTASection';

export default function CTASectionExample() {
  return (
    <CTASection 
      onEnroll={() => console.log('CTA Enroll clicked')} 
      onScheduleCall={() => console.log('CTA Schedule call clicked')} 
    />
  );
}
