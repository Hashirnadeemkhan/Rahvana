'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const ToggleSwitch = ({
  checked,
  onChange,
  className,
}: ToggleSwitchProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-200',
        checked ? 'bg-teal-600' : 'bg-slate-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
        className
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-1'
        )}
      />
    </button>
  );
};
