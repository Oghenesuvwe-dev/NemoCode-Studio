import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  shortcut?: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  children,
  position = 'top',
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800'
  };

  const tooltipId = `tooltip-${content.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div 
      ref={targetRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}
      
      {isVisible && (
        <div 
          id={tooltipId}
          role="tooltip"
          aria-hidden={!isVisible}
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <div className="bg-gray-800 text-white text-xs px-2 py-1.5 rounded shadow-lg border border-gray-700">
            <div className="flex items-center gap-2">
              <span>{content}</span>
              {shortcut && (
                <kbd className="px-1.5 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs font-mono">
                  {shortcut}
                </kbd>
              )}
            </div>
          </div>
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
