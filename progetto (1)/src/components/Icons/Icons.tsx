import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 22, children, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      {children}
    </svg>
  );
}

export const RadarIcon = (p: IconProps) => <IconBase {...p}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></IconBase>;
export const ScoreIcon = (p: IconProps) => <IconBase {...p}><path d="M4 17h16"/><path d="M7 17V9"/><path d="M12 17V6"/><path d="M17 17v-4"/></IconBase>;
export const DistrettoIcon = (p: IconProps) => <IconBase {...p}><path d="M3 8l9-5 9 5v8l-9 5-9-5z"/></IconBase>;
export const AdvisorIcon = (p: IconProps) => <IconBase {...p}><path d="M4 5h16v10H7l-3 3z"/></IconBase>;
export const LiveIcon = (p: IconProps) => <IconBase {...p}><circle cx="12" cy="12" r="9"/><path d="M10 9l6 3-6 3z"/></IconBase>;
