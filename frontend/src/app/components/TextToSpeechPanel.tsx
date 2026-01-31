import { useState } from 'react';
import { Play, Pause, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface TextToSpeechPanelProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  selectedVoice: string;
  playbackSpeed: number;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onVoiceChange: (voice: string) => void;
}

const VOICES = [
  'Vrinda',
  'Rohan',
  'Taylor',
  'Lennox',
];

export function TextToSpeechPanel({
  isPlaying,
  currentTime,
  duration,
  selectedVoice,
  playbackSpeed,
  onPlayPause,
  onSpeedChange,
  onVoiceChange,
}: TextToSpeechPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onSpeedChange(value);
  };

  return (
    <div className="relative">
      {/* Tab Label */}
      <div 
        className="absolute -top-8 left-6 bg-gradient-to-r from-pink-400 to-orange-400 px-4 py-2 rounded-t-lg shadow-md flex items-center gap-2 cursor-pointer hover:from-pink-500 hover:to-orange-500 transition-all"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <span className="text-white text-sm font-bold">Listening Mode</span>
        {/* ElevenLabs Logo - Two Vertical Lines */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="7" y="4" width="3" height="16" rx="1.5" fill="white"/>
          <rect x="14" y="4" width="3" height="16" rx="1.5" fill="white"/>
        </svg>
        {/* Minimize/Expand Icon */}
        {isMinimized ? (
          <ChevronUp className="w-4 h-4 text-white" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white" />
        )}
      </div>
      
      {/* TTS Panel - Only show when not minimized */}
      {!isMinimized && (
        <div className="border-t-2 border-pink-200 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Voice Selector - Compact */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <label className="text-sm font-medium text-neutral-700">Voice</label>
              <select
                value={selectedVoice}
                onChange={(e) => onVoiceChange(e.target.value)}
                className="px-3 py-1.5 bg-white border-2 border-orange-200 rounded-lg text-sm text-neutral-900 font-medium focus:outline-none focus:border-orange-400 transition-colors"
              >
                {VOICES.map((voice) => (
                  <option key={voice} value={voice}>
                    {voice}
                  </option>
                ))}
              </select>
            </div>

            {/* Speed Control - Compact Slider */}
            <div className="flex items-center gap-2 flex-shrink-0 min-w-[140px]">
              <label className="text-sm font-medium text-neutral-700">Speed</label>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="range"
                  min="0.25"
                  max="2.0"
                  step="0.25"
                  value={playbackSpeed}
                  onChange={handleSliderChange}
                  className="flex-1 h-1.5 bg-orange-200 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3.5
                    [&::-webkit-slider-thumb]:h-3.5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-gradient-to-br
                    [&::-webkit-slider-thumb]:from-orange-400
                    [&::-webkit-slider-thumb]:to-orange-500
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-white
                    [&::-webkit-slider-thumb]:hover:shadow-lg
                    [&::-moz-range-thumb]:w-3.5
                    [&::-moz-range-thumb]:h-3.5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-gradient-to-br
                    [&::-moz-range-thumb]:from-orange-400
                    [&::-moz-range-thumb]:to-orange-500
                    [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:border-2
                    [&::-moz-range-thumb]:border-white
                    [&::-moz-range-thumb]:shadow-md"
                />
                <span className="text-xs font-semibold text-neutral-700 min-w-[32px] text-center">
                  {playbackSpeed.toFixed(2)}x
                </span>
              </div>
            </div>

            {/* Playback Controls - Compact */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Play/Pause Button */}
              <Button
                onClick={onPlayPause}
                className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" fill="white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                )}
              </Button>
            </div>

            {/* Progress Bar and Time - Flexible */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <span className="text-xs font-medium text-neutral-700 flex-shrink-0">{formatTime(currentTime)}</span>
              
              <div className="flex-1 relative h-2 bg-orange-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}