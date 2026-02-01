import { useState, useRef, useEffect } from 'react';
import { X, GripVertical } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { TextToSpeechPanel } from '@/app/components/TextToSpeechPanel';

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

  // Handle close button click - send postMessage if in iframe
  const handleClose = () => {
    // If we're in an iframe (embedded on a page), send message to parent
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'GLOSS_CLOSE' }, '*');
    }
    // Always call the onClose handler
    onClose();
  };

  if (!isOpen) return null;

  // Check if we're in an iframe
  const isInIframe = typeof window !== 'undefined' && (() => {
    try {
      return window.parent !== window;
    } catch (e) {
      return true;
    }
  })();

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
      className={`${isInIframe ? 'absolute' : 'fixed'} top-0 right-0 bg-neutral-50 shadow-2xl flex border-l-2 border-pink-300 z-[9999] overflow-hidden ${isInIframe ? 'rounded-l-[15px]' : 'rounded-[15px]'}`}
      style={{ 
        width: panelWidth,
        height: isInIframe ? '100vh' : 'calc(100vh - 24px)',
        top: isInIframe ? 0 : '12px',
        bottom: isInIframe ? 0 : '12px'
      }}
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
        {/* Header - Using Figma Maker styling */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-pink-200 bg-gradient-to-r from-pink-50 to-orange-50">
          <div className="flex items-center gap-3">
            {/* Figma Logo Container - Container3 + Text */}
            <div 
              className="relative rounded-[10px] shrink-0 size-[32px] cursor-pointer hover:shadow-md transition-shadow flex items-center justify-center"
              style={{ backgroundImage: "linear-gradient(135deg, rgb(251, 100, 182) 0%, rgb(255, 184, 106) 100%)" }}
              onClick={onLogoClick}
              title="Go to home"
            >
              <p 
                className="text-white font-bold"
                style={{
                  fontFamily: "'Arimo', 'Arimo Bold', sans-serif",
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.32px',
                  fontWeight: 'bold'
                }}
              >
                g
              </p>
            </div>
            {/* Figma Heading - matches Heading component */}
            <div className="flex items-center gap-3">
              <h2 
                className="cursor-pointer hover:text-pink-600 transition-colors"
                onClick={onLogoClick}
                title="Go to home"
                style={{
                  fontFamily: "'Roboto Serif', 'Roboto_Serif Bold', serif",
                  fontSize: '18px',
                  lineHeight: '28px',
                  fontWeight: 'bold',
                  color: '#171717',
                  letterSpacing: '0.32px',
                  fontVariationSettings: "'GRAD' 0, 'wdth' 100"
                }}
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
            onClick={handleClose}
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