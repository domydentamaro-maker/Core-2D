import React, { useEffect, useState } from 'react';

export const ProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;

      setProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-[60] bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-[#003366] via-cyan-500 to-amber-400 transition-all duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      ></div>
    </div>
  );
};