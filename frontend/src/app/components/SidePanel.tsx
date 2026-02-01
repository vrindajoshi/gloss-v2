import { Slider } from '@/app/components/ui/slider';
import { Switch } from '@/app/components/ui/switch';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Label } from '@/app/components/ui/label';
import { Sparkles, Type, Eye } from 'lucide-react';
import buttonBg from 'figma:asset/1be2ce4533ad7382c1ca76040acdcfdaf10a498e.png';

interface SidePanelProps {
  readingLevel: number;
  onReadingLevelChange: (value: number[]) => void;
  dyslexiaFont: boolean;
  onDyslexiaFontChange: (value: boolean) => void;
  focusMode: boolean;
  onFocusModeChange: (value: boolean) => void;
  onSimplify: () => void;
  isSimplified: boolean;
}

export function SidePanel({
  readingLevel,
  onReadingLevelChange,
  dyslexiaFont,
  onDyslexiaFontChange,
  focusMode,
  onFocusModeChange,
  onSimplify,
  isSimplified,
}: SidePanelProps) {
  const levels = [
    { value: 4, label: 'Grade 4' },
    { value: 6, label: 'Grade 6' },
    { value: 9, label: 'Grade 9' },
    { value: 12, label: 'Grade 12' },
    { value: 16, label: 'College' },
  ];

  const currentLevelLabel = levels.find(l => l.value === readingLevel)?.label || 'Grade 9';

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8 min-h-full flex flex-col">
        {/* Welcome Section */}
        <div className="space-y-2 flex-shrink-0 mt-4">
          <h2 className="text-2xl font-bold text-neutral-900">Welcome to Gloss</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Slow down. Read gently. You're in the right place.
          </p>
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10 bg-neutral-50">
          {/* Reading Level Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-5">
              <Label className="text-base font-bold text-neutral-900">Reading Level</Label>
              <span className="px-4 py-1.5 bg-gradient-to-r from-pink-400 to-orange-400 text-white text-sm font-bold rounded-full shadow-sm">
                {currentLevelLabel}
              </span>
            </div>
            <div className="relative">
              <Slider
                value={[readingLevel]}
                onValueChange={(value) => {
                  // Snap to nearest valid level
                  const nearestLevel = levels.reduce((prev, curr) => 
                    Math.abs(curr.value - value[0]) < Math.abs(prev.value - value[0]) ? curr : prev
                  );
                  onReadingLevelChange([nearestLevel.value]);
                }}
                min={4}
                max={16}
                step={1}
                className="w-full mb-2"
              />
              <div className="relative h-6 mt-2">
                {levels.map((level, index) => {
                  // Calculate position percentage based on slider range (4 to 16)
                  const position = ((level.value - 4) / (16 - 4)) * 100;
                  // Only show first and last labels
                  const isVisible = index === 0 || index === levels.length - 1;
                  
                  if (!isVisible) return null;
                  
                  // For first label (Grade 4), align left edge with slider start
                  // For last label (College), align right edge with slider end
                  const isFirst = index === 0;
                  const isLast = index === levels.length - 1;
                  
                  return (
                    <span 
                      key={level.value}
                      className={`absolute text-xs font-medium text-neutral-600 ${isLast ? '-translate-x-full' : ''}`}
                      style={{ left: `${position}%` }}
                    >
                      {level.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Accessibility Options */}
          <div className="space-y-4">
            <Label className="text-base font-bold text-neutral-900">Accessibility</Label>
            
            {/* Easy-Read Font */}
            <div
              onClick={() => onDyslexiaFontChange(!dyslexiaFont)}
              className={`w-full flex items-center justify-between p-4 rounded-lg bg-white border-2 transition-all cursor-pointer ${
                dyslexiaFont 
                  ? 'border-orange-400 shadow-sm' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Type className={`w-5 h-5 flex-shrink-0 ${dyslexiaFont ? 'text-orange-500' : 'text-neutral-400'}`} />
                <span className="text-sm text-neutral-700">Easy-Read Font</span>
              </div>
              <Switch checked={dyslexiaFont} onCheckedChange={onDyslexiaFontChange} />
            </div>

            {/* Focus Mode */}
            <div
              onClick={() => onFocusModeChange(!focusMode)}
              className={`w-full flex items-center justify-between p-4 rounded-lg bg-white border-2 transition-all cursor-pointer ${
                focusMode 
                  ? 'border-orange-400 shadow-md shadow-orange-100' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Eye className={`w-5 h-5 flex-shrink-0 ${focusMode ? 'text-orange-500' : 'text-neutral-400'}`} />
                <span className="text-sm text-neutral-700">Focus Mode</span>
              </div>
              <Switch checked={focusMode} onCheckedChange={onFocusModeChange} />
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onSimplify}
            disabled={isSimplified}
            className="group relative w-full h-[72px] rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            {/* Background Image */}
            <img 
              src={buttonBg} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Button Text */}
            <span className="relative z-10 text-white text-xl font-bold flex items-center justify-center h-full" style={{ fontFamily: 'Roboto Serif, serif' }}>
              Simplify Page
            </span>
          </button>
        </div>
      </div>
    </ScrollArea>
  );
}