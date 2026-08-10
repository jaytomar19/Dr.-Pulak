import React from 'react';

export interface StatusBadgeProps {
  status: string;
  variant: 'lead' | 'booking' | 'payment' | 'delivery' | 'band';
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  size = 'md',
  className = '',
}) => {
  const formattedStatus = status.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const classNames = [
    'status-badge',
    `status-badge--${variant}-${formattedStatus}`,
    size === 'sm' ? 'status-badge--sm' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames}>
      {status}
    </span>
  );
};
