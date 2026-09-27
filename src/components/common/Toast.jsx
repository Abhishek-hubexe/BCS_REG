import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#5D7A68] flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#B84A39] flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-[#C25E42] flex-shrink-0" />
  };

  const bgStyles = {
    success: 'bg-[#EEF3F0] border-[#C8D9CE] text-[#2C4233]',
    error: 'bg-[#FDF1EF] border-[#F0C9C2] text-[#6B241A]',
    info: 'bg-[#FAF0ED] border-[#EAD8D2] text-[#5C2314]'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md motion-toast">
      <div className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border shadow-card text-sm font-medium overflow-hidden ${bgStyles[type] || bgStyles.info}`}>
        {icons[type] || icons.info}
        <span className="flex-1 leading-snug">{message}</span>
        <button
          onClick={onClose}
          className="text-[#78716C] hover:text-[#1C1917] transition-colors p-0.5 rounded"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
        {/* === MOTION LAYER: Progress bar === */}
        <div
          className={`motion-toast-progress type-${type || 'info'}`}
          style={{ animationDuration: `${duration}ms` }}
        />
        {/* === END MOTION LAYER === */}
      </div>
    </div>
  );
}
