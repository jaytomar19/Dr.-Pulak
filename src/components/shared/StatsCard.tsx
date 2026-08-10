import React from 'react';

export interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  trend,
  icon,
  className = '',
}) => {
  return (
    <div className={`stats-card ${className}`}>
      <div className="stats-card__header">
        <h3 className="stats-card__label">{label}</h3>
        {icon && <div className="stats-card__icon">{icon}</div>}
      </div>
      <div className="stats-card__content">
        <div className="stats-card__value">{value}</div>
        {trend && (
          <div className={`stats-card__trend stats-card__trend--${trend.direction}`}>
            {trend.direction === 'up' && '↑ '}
            {trend.direction === 'down' && '↓ '}
            {trend.direction === 'neutral' && '− '}
            {trend.value}%
          </div>
        )}
      </div>
    </div>
  );
};
