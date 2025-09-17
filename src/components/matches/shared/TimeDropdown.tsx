'use client';
import React, { useRef, useEffect } from 'react';

interface TimeDropdownProps {
  value: string;
  options: string[];
  onSelect: (val: string) => void;
  onClose: () => void;
}

export const TimeDropdown: React.FC<TimeDropdownProps> = ({ value, options, onSelect, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);
  
  // Scroll to selected
  useEffect(() => {
    if (!value) return;
    const idx = options.findIndex(t => t === value);
    if (idx >= 0) {
      const el = document.getElementById('time-opt-' + idx);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [value, options]);
  
  return (
    <div ref={ref} className="absolute z-50 left-0 right-0 mt-2 bg-white border border-green-500 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fadeIn flex flex-col">
      <div className="max-h-60 overflow-y-auto rounded-xl">
        {options.map((time, idx) => (
          <button
            key={time}
            id={'time-opt-' + idx}
            type="button"
            className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm ${value === time ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
            onClick={() => onSelect(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};