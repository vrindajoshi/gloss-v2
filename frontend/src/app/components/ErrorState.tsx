import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({ 
  title = "We couldn't process this page",
  message = "This page format isn't supported yet. We're working on adding support for more content types.",
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50 px-8">
      <div className="max-w-md text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-orange-700" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">{message}</p>
        </div>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}

        {/* Help Text */}
        <div className="pt-4 border-t border-orange-200">
          <p className="text-xs text-neutral-500">
            Try a different page, or return to the home screen
          </p>
        </div>
      </div>
    </div>
  );
}