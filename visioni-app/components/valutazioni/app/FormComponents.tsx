import React from 'react';
import { cn } from '@/components/valutazioni/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, required, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-xs font-source font-600 text-[#5C5346] uppercase tracking-wider">
        {label}{required && <span className="text-[#C8A96E] ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] font-source text-[#5C5346]/60 italic">{hint}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  unit?: string;
}

export function Input({ unit, className, ...props }: InputProps) {
  if (unit) {
    return (
      <div className="relative">
        <input
          className={cn(
            'w-full px-0 py-2 bg-[#FDFAF4] border-0 border-b-2 border-[#D4C9B0] text-sm font-source text-[#1A1A1A] placeholder-[#5C5346]/40 focus:outline-none focus:border-[#C8A96E] transition-colors pr-10',
            className
          )}
          {...props}
        />
        <span className="absolute right-0 top-2 text-xs text-[#5C5346]/60 font-source">{unit}</span>
      </div>
    );
  }
  return (
    <input
      className={cn(
        'w-full px-0 py-2 bg-[#FDFAF4] border-0 border-b-2 border-[#D4C9B0] text-sm font-source text-[#1A1A1A] placeholder-[#5C5346]/40 focus:outline-none focus:border-[#C8A96E] transition-colors',
        className
      )}
      {...props}
    />
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function SelectField({ className, children, ...props }: SelectFieldProps) {
  return (
    <select
      className={cn(
        'w-full px-0 py-2 bg-[#FDFAF4] border-0 border-b-2 border-[#D4C9B0] text-sm font-source text-[#1A1A1A] focus:outline-none focus:border-[#C8A96E] transition-colors appearance-none',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextareaField({ className, ...props }: TextareaFieldProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2.5 bg-[#FDFAF4] border border-[#D4C9B0] text-sm font-source text-[#1A1A1A] placeholder-[#5C5346]/40 focus:outline-none focus:border-[#C8A96E] transition-colors rounded resize-none',
        className
      )}
      {...props}
    />
  );
}

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}

export function ToggleField({ label, value, onChange, description }: ToggleFieldProps) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#D4C9B0]/50 last:border-0">
      <div>
        <p className="text-sm font-source text-[#1A1A1A]">{label}</p>
        {description && <p className="text-xs font-source text-[#5C5346]/60 italic mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={cn(
          'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ml-4',
          value ? 'bg-[#C8A96E] border-[#C8A96E]' : 'bg-[#D4C9B0] border-[#D4C9B0]'
        )}
      >
        <span
          className={cn(
            'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out m-0.5',
            value ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export function SectionCard({ title, subtitle, children, collapsible = false, defaultOpen = true, className }: SectionCardProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className={cn('bg-[#FDFAF4] border border-[#D4C9B0] rounded shadow-sm', className)}>
      <div
        className={cn('px-6 py-4 border-b border-[#D4C9B0]', collapsible && 'cursor-pointer select-none')}
        onClick={collapsible ? () => setOpen(!open) : undefined}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-playfair text-lg font-bold text-[#1A1A1A]">{title}</h3>
            {subtitle && <p className="text-xs text-[#5C5346] font-source mt-0.5">{subtitle}</p>}
          </div>
          {collapsible && (
            <svg
              className={cn('w-4 h-4 text-[#C8A96E] transition-transform', open ? 'rotate-180' : '')}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>
      {(!collapsible || open) && (
        <div className="p-6">{children}</div>
      )}
    </div>
  );
}

export function SectionHeader({ numero, title }: { numero: number; title: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xs font-source text-[#C8A96E] uppercase tracking-wider">
          Sezione {numero}
        </span>
        <div className="flex-1 h-px bg-[#D4C9B0]" />
      </div>
      <h2 className="font-playfair text-2xl font-bold text-[#1A1A1A]">{title}</h2>
    </div>
  );
}

export function FormGrid({ cols = 2, children, className }: { cols?: 2 | 3 | 4; children: React.ReactNode; className?: string }) {
  const colClass = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }[cols];
  return (
    <div className={cn('grid grid-cols-1 gap-5', colClass, className)}>
      {children}
    </div>
  );
}
