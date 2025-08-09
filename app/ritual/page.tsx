// Landing page for /ritual redirects to primary daily guidance or shows selection
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RitualIndexPage(){
  const router = useRouter();
  useEffect(()=>{
    // For now redirect to dashboard anchor or guidance explanation
    router.replace('/dashboard?focus=guidance');
  },[router]);
  return <div className="p-8 text-center text-white">Redirecting to your daily guidance...</div>;
}
