import { ScrollArea } from '@/app/components/ui/scroll-area';

interface SimplifiedTextViewProps {
  simplifiedText: string;
  dyslexiaFont: boolean;
  onWordClick?: (wordIndex: number) => void;
  highlightedWordIndex?: number;
  articleTitle?: string;
}

export function SimplifiedTextView({
  simplifiedText,
  dyslexiaFont,
  onWordClick,
  highlightedWordIndex,
  articleTitle,
}: SimplifiedTextViewProps) {
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
        <p key={pIndex} className="text-base mb-6 leading-relaxed">
          {wordElements}
        </p>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-50/30 to-orange-50/30">
      {/* Article Title - if provided */}
      {articleTitle && (
        <div className="px-6 py-4 border-b-2 border-pink-200 bg-gradient-to-r from-pink-50 to-orange-50 flex-shrink-0">
          <h1 className="text-2xl font-bold text-neutral-900">{articleTitle}</h1>
        </div>
      )}

      {/* Scrollable Simplified Text */}
      <ScrollArea className="flex-1">
        <div className={`px-6 py-6 ${fontClass}`}>
          <div className="text-neutral-800 max-w-2xl">
            {getClickableWords(simplifiedText)}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}