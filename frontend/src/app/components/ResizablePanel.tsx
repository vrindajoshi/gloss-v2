import { useState, useRef, useEffect } from 'react';
import { X, GripVertical } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { TextToSpeechPanel } from '@/app/components/TextToSpeechPanel';
import glossLogo from 'figma:asset/6a4e64c69d84356d6cb8df76ab71188bc98ed82e.png';

interface ResizablePanelProps {
  isOpen: boolean;
  initialWidth: number;
  onClose: () => void;
  children: React.ReactNode;
  onWidthChange?: (width: number) => void;
  onLogoClick?: () => void;
  readingLevel?: number;
  showReadingLevel?: boolean;
  // Text-to-speech props
  showTTS?: boolean;
  ttsIsPlaying?: boolean;
  ttsCurrentTime?: number;
  ttsDuration?: number;
  ttsSelectedVoice?: string;
  ttsPlaybackSpeed?: number;
  onTTSPlayPause?: () => void;
  onTTSSpeedChange?: (speed: number) => void;
  onTTSVoiceChange?: (voice: string) => void;
}

export function ResizablePanel({ 
  isOpen, 
  initialWidth, 
  onClose, 
  children, 
  onWidthChange, 
  onLogoClick,
  readingLevel,
  showReadingLevel = true,
  showTTS = false,
  ttsIsPlaying = false,
  ttsCurrentTime = 0,
  ttsDuration = 0,
  ttsSelectedVoice = 'Vrinda',
  ttsPlaybackSpeed = 1.0,
  onTTSPlayPause,
  onTTSSpeedChange,
  onTTSVoiceChange,
}: ResizablePanelProps) {
  const [panelWidth, setPanelWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Update panel width when initialWidth changes (when reopening)
  useEffect(() => {
    setPanelWidth(initialWidth);
  }, [initialWidth]);

  // Handle mouse move and up with useEffect for proper cleanup
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      e.preventDefault(); // Prevent text selection during drag
      
      const newWidth = window.innerWidth - e.clientX;
      // Min width: 320px, Max width: 80% of screen
      const minWidth = 320;
      const maxWidth = window.innerWidth * 0.8;
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      
      setPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        // Save the final width when user releases mouse
        if (onWidthChange) {
          onWidthChange(panelWidth);
        }
      }
    };

    if (isResizing) {
      // Prevent text selection during resize
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      // Restore normal cursor and selection
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onWidthChange, panelWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  if (!isOpen) return null;

  // Map reading level to label
  const levels = [
    { value: 4, label: 'Grade 4' },
    { value: 6, label: 'Grade 6' },
    { value: 9, label: 'Grade 9' },
    { value: 12, label: 'Grade 12' },
    { value: 16, label: 'College' },
  ];
  const currentLevelLabel = levels.find(l => l.value === readingLevel)?.label || 'Grade 9';

  return (
    <div
      ref={panelRef}
      className="fixed top-3 bottom-3 right-0 bg-neutral-50 shadow-2xl flex border-l-2 border-pink-300 z-[9999] overflow-hidden rounded-[15px]"
      style={{ width: panelWidth }}
    >
      {/* Resize Handle */}
      <div
        className={`w-2 bg-gradient-to-b from-pink-200 to-orange-200 hover:from-pink-400 hover:to-orange-400 transition-colors cursor-col-resize flex items-center justify-center group absolute left-0 top-0 bottom-0 z-10 rounded-l-[15px] ${
          isResizing ? 'from-pink-500 to-orange-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="w-4 h-4 text-pink-400 group-hover:text-white transition-colors" />
      </div>

      {/* Panel Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-pink-200 bg-gradient-to-r from-pink-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
              onClick={onLogoClick}
              title="Go to home"
            >
              <img src={glossLogo} alt="Gloss Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <h2 
                className="text-2xl font-bold text-neutral-900 cursor-pointer hover:text-pink-600 transition-colors"
                onClick={onLogoClick}
                title="Go to home"
              >
                Gloss
              </h2>
              {readingLevel && showReadingLevel && (
                <span className="px-3 py-1 bg-gradient-to-r from-pink-400 to-orange-400 text-white text-sm font-bold rounded-full shadow-sm">
                  {currentLevelLabel}
                </span>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-pink-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-neutral-50">
          {children}
        </div>

        {/* Text-to-Speech Panel at Bottom */}
        {showTTS && onTTSPlayPause && onTTSSpeedChange && onTTSVoiceChange && (
          <TextToSpeechPanel
            isPlaying={ttsIsPlaying}
            currentTime={ttsCurrentTime}
            duration={ttsDuration}
            selectedVoice={ttsSelectedVoice}
            playbackSpeed={ttsPlaybackSpeed}
            onPlayPause={onTTSPlayPause}
            onSpeedChange={onTTSSpeedChange}
            onVoiceChange={onTTSVoiceChange}
          />
        )}
      </div>
    </div>
  );
}