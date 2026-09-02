'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AssessmentModalContextType {
  isAssessmentOpen: boolean;
  openAssessmentModal: () => void;
  closeAssessmentModal: () => void;
}

const AssessmentModalContext = createContext<AssessmentModalContextType | undefined>(undefined);

export function AssessmentModalProvider({ children }: { children: ReactNode }) {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  useEffect(() => {
    // Trigger assessment modal popup shortly after page mount on every load or refresh
    const timer = setTimeout(() => {
      setIsAssessmentOpen(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const openAssessmentModal = () => setIsAssessmentOpen(true);
  const closeAssessmentModal = () => setIsAssessmentOpen(false);

  return (
    <AssessmentModalContext.Provider
      value={{
        isAssessmentOpen,
        openAssessmentModal,
        closeAssessmentModal,
      }}
    >
      {children}
    </AssessmentModalContext.Provider>
  );
}

export function useAssessmentModal() {
  const context = useContext(AssessmentModalContext);
  if (!context) {
    throw new Error('useAssessmentModal must be used within an AssessmentModalProvider');
  }
  return context;
}
