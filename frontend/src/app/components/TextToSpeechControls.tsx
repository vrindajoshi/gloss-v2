import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface TextToSpeechControlsProps {
  isActive: boolean;
}

export function TextToSpeechControls({ isActive }: TextToSpeechControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('calm-female');

  if (!isActive) return null;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the Web Speech API
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl shadow-2xl border border-orange-200 p-6 min-w-[400px]">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-neutral-900 mb-1">Text-to-Speech</h3>
          <p className="text-xs text-neutral-600">Listen to the simplified text</p>
        </div>

        {/* Voice Selector */}
        <div className="mb-6">
          <label className="text-xs font-medium text-neutral-700 mb-2 block">Voice</label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="w-full bg-white border-orange-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calm-female">Calm Female Voice</SelectItem>
              <SelectItem value="warm-male">Warm Male Voice</SelectItem>
              <SelectItem value="gentle-neutral">Gentle Neutral Voice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full border-orange-200 hover:bg-orange-100"
            onClick={() => console.log('Previous paragraph')}
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-300 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" fill="currentColor" />
            ) : (
              <Play className="w-6 h-6" fill="currentColor" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full border-orange-200 hover:bg-orange-100"
            onClick={() => console.log('Next paragraph')}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-300 transition-all duration-300"
              style={{ width: isPlaying ? '45%' : '0%' }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-600 mt-2">
            <span>0:12</span>
            <span>2:34</span>
          </div>
        </div>
      </div>
    </div>
  );
}