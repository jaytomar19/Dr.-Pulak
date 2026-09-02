'use client';

import React from 'react';
import { useAssessmentModal } from '@/context/AssessmentModalContext';

interface KneeCheckCTAButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export default function KneeCheckCTAButton({
  children = 'Start Free Knee Check',
  className = 'video-landing__cta',
}: KneeCheckCTAButtonProps) {
  const { openAssessmentModal } = useAssessmentModal();

  return (
    <button
      type="button"
      onClick={openAssessmentModal}
      className={className}
      data-cursor="button"
    >
      {children}
    </button>
  );
}
