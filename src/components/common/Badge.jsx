import React from 'react';

export default function Badge({ children, variant = 'neutral', className = '', size = 'sm' }) {
  const variantStyles = {
    sage: 'badge-sage',
    terracotta: 'badge-terracotta',
    ochre: 'badge-ochre',
    brick: 'badge-brick',
    neutral: 'badge-neutral',
    active: 'badge-sage',
    pending: 'badge-ochre',
    approved: 'badge-sage',
    rejected: 'badge-brick',
    draft: 'badge-neutral',
    published: 'badge-sage'
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };

  const selectedClass = variantStyles[variant.toLowerCase()] || variantStyles.neutral;
  const selectedSize = sizeStyles[size] || sizeStyles.sm;

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded capitalize tracking-wide ${selectedClass} ${selectedSize} ${className}`}>
      {children}
    </span>
  );
}
