import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = ({ children, className = '', padding = 'md' }: CardProps) => {
  const baseClasses = 'card bg-white shadow-md rounded-lg border border-gray-200';
  
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const classes = `${baseClasses} ${paddingClasses[padding]} ${className}`;

  return <div className={classes}>{children}</div>;
};

export default Card; 