import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export function LoadingState({ 
  message = "Processing article...", 
  submessage = "This may take a few moments"
}: LoadingStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50 px-8">
      <div className="max-w-md text-center space-y-6">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-orange-300 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-orange-300 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-neutral-900">{message}</h2>
          <p className="text-sm text-neutral-600">{submessage}</p>
        </div>

        {/* Progress Indicator */}
        <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-[shimmer_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
