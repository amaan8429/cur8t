'use client';

import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export default function UsernamePage() {
  const router = useRouter();

  const handleComplete = () => {
    // Username has been set successfully, redirect to dashboard
    router.push('/dashboard?item=Overview');
  };

  return <OnboardingFlow onComplete={handleComplete} />;
}
