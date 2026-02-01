import { ScrollArea } from '@/app/components/ui/scroll-area';

interface SplitViewReaderProps {
  originalText: string;
  simplifiedText: string;
  dyslexiaFont: boolean;
  onWordClick?: (wordIndex: number) => void;
  highlightedWordIndex?: number;
  articleTitle?: string;
}

export function SplitViewReader({
  originalText,
  simplifiedText,
  dyslexiaFont,
  onWordClick,
  highlightedWordIndex,
  articleTitle,
}: SplitViewReaderProps) {
  const fontClass = dyslexiaFont ? 'font-dyslexic' : '';

  // Split text into words with their indices for simplified text
  const getClickableWords = (text: string) => {
    let wordIndex = 0;
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      const words = paragraph.split(/(\s+)/); // Split but keep whitespace
      const wordElements = words.map((word, wIndex) => {
        if (word.trim() === '') {
          return <span key={`${pIndex}-${wIndex}`}>{word}</span>;
        }
        
        const currentIndex = wordIndex;
        wordIndex++;
        
        return (
          <span
            key={`${pIndex}-${wIndex}`}
            onClick={() => onWordClick?.(currentIndex)}
            className="cursor-pointer hover:bg-orange-200 rounded px-0.5 transition-colors"
          >
            {word}
          </span>
        );
      });
      
      return (
        <p key={pIndex} className="text-base mb-4">
          {wordElements}
        </p>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Article Title - if provided */}
      {articleTitle && (
        <div className="px-6 py-4 border-b-2 border-pink-200 bg-gradient-to-r from-pink-50 to-orange-50">
          <h1 className="text-2xl font-bold text-neutral-900">{articleTitle}</h1>
          <p className="text-sm text-neutral-600 mt-1">Article Content</p>
        </div>
      )}

      {/* Split View Layout - Side by Side */}
      <div className="flex-1 flex overflow-hidden">
        {/* Original Text Panel - Left */}
        <div className="flex-1 border-r-2 border-pink-200 flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-r from-orange-100/50 to-orange-50 border-b border-orange-200">
            <h2 className="text-sm font-bold text-neutral-900">Original Text</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className={`px-6 py-6 bg-white ${fontClass}`}>
              <div className="space-y-4 text-neutral-800 leading-relaxed">
                {originalText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Simplified Text Panel - Right */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-r from-pink-100/50 to-orange-100/50 border-b border-pink-200">
            <h2 className="text-sm font-bold text-neutral-900">Simplified Text</h2>
            <p className="text-xs text-neutral-600 mt-0.5">Click any word to jump to that point in audio</p>
          </div>
          <ScrollArea className="flex-1">
            <div className={`px-6 py-6 bg-gradient-to-br from-pink-50/30 to-orange-50/30 ${fontClass}`}>
              <div className="space-y-4 text-neutral-800 leading-relaxed">
                {getClickableWords(simplifiedText)}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}