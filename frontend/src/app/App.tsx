import { useState, useEffect, useRef } from 'react';
import { MinimizedButton } from '@/app/components/MinimizedButton';
import { ResizablePanel } from '@/app/components/ResizablePanel';
import { SidePanel } from '@/app/components/SidePanel';
import { SimplifiedTextView } from '@/app/components/SimplifiedTextView';
import { FocusMode } from '@/app/components/FocusMode';
import { LoadingState } from '@/app/components/LoadingState';
import { ErrorState } from '@/app/components/ErrorState';

// Types for backend integration
interface ArticleData {
  title: string;
  content: string;
  url: string;
  scrapedAt: string;
}

interface SimplificationResponse {
  simplifiedText: string;
  readingLevel: number;
}

// Processing states
type ProcessingState = 'idle' | 'scraping' | 'simplifying' | 'ready' | 'error';

export default function App() {
  // Open panel by default if we're in an iframe (embedded on a page)
  const [isPanelOpen, setIsPanelOpen] = useState(() => {
    // Check if we're in an iframe
    try {
      return window.parent !== window;
    } catch (e) {
      // Cross-origin iframe, assume we're embedded
      return true;
    }
  });
  const [panelWidth, setPanelWidth] = useState(480);
  const [readingLevel, setReadingLevel] = useState(9);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  // Article data from backend
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Check if we're in an iframe
  const isInIframe = typeof window !== 'undefined' && (() => {
    try {
      return window.parent !== window;
    } catch (e) {
      // Cross-origin iframe
      return true;
    }
  })();

  // Push website content when panel opens (only in popup mode, not iframe)
  useEffect(() => {
    if (!isInIframe && isPanelOpen) {
      document.body.style.marginRight = `${panelWidth}px`;
      document.body.style.transition = 'margin-right 0.3s ease';
    } else {
      document.body.style.marginRight = '0px';
    }

    return () => {
      if (!isInIframe) {
      document.body.style.marginRight = '0px';
      }
    };
  }, [isPanelOpen, panelWidth, isInIframe]);

  const handlePanelWidthChange = (width: number) => {
    setPanelWidth(width);
  };

  // Backend integration - Scrape article from current page
  const scrapeArticle = async (): Promise<ArticleData> => {
    const params = new URLSearchParams(window.location.search);
const currentUrl = params.get('src') || '';

if (!currentUrl) {
  throw new Error('Missing article URL. (No "src" param found in panel URL)');
}
    const BACKEND_URL = 'http://localhost:3000';
    
    try {
    const response = await fetch(`${BACKEND_URL}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: currentUrl }),
    });

      // Handle network errors
    if (!response.ok) {
        let errorMessage = 'Failed to scrape article';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || `Server returned ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to scrape article');
      }

      // Validate that we have actual content
      if (!data.article && !data.formatted) {
        throw new Error('No article content was returned from the server');
      }

      if (!data.title) {
        throw new Error('No article title was returned from the server');
      }

      return {
        title: data.title,
        content: data.article || data.formatted || '',
        url: currentUrl,
        scrapedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Scraping error:', error);
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure the backend server is running on http://localhost:3000');
      }
      
      throw error instanceof Error ? error : new Error('Failed to scrape article');
    }
  };

  // Backend integration - Simplify article text using translation endpoint
  const simplifyArticle = async (content: string, level: number): Promise<SimplificationResponse> => {
    const BACKEND_URL = 'http://localhost:3000';
    
    // Validate input
    if (!content || content.trim().length === 0) {
      throw new Error('No content provided to simplify');
    }
    
    // Map reading level number to grade string
    const levelMap: Record<number, string> = {
      4: 'Grade 4',
      6: 'Grade 6',
      9: 'Grade 9',
      12: 'Grade 12',
      16: 'College',
    };
    
    const levelString = levelMap[level] || 'Grade 9';
    
    try {
      // Encode text and level for URL
      const encodedText = encodeURIComponent(content);
      const encodedLevel = encodeURIComponent(levelString);
      
      // Add timeout to fetch (5 minutes)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      
      const response = await fetch(
        `${BACKEND_URL}/translate?text=${encodedText}&level=${encodedLevel}`,
        {
          method: 'GET',
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);

      // Handle network errors
      if (!response.ok) {
        let errorMessage = 'Translation failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          const is503 = response.status === 503 || errorMessage.includes('overloaded');
          if (is503) {
            errorMessage += ' Try again in a moment.';
          }
        } catch {
          errorMessage = response.statusText || `Server returned ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.result || data.result.trim().length === 0) {
        throw new Error('Translation failed - no result returned from the server');
      }
      
      return {
        simplifiedText: data.result,
        readingLevel: level,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Translation timed out. Make sure the server is running on http://localhost:3000');
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure the backend server is running on http://localhost:3000');
      }
      
      console.error('Translation error:', error);
      throw error instanceof Error ? error : new Error('Failed to simplify article');
    }
  };

  // Handle simplify button click
  const handleSimplify = async () => {
    setProcessingState('scraping');
    
    try {
      // Step 1: Scrape the article
      const article = await scrapeArticle();
      setArticleData(article);
      
      // Step 2: Simplify the content
      setProcessingState('simplifying');
      const simplified = await simplifyArticle(article.content, readingLevel);
      setSimplifiedText(simplified.simplifiedText);
      
      // Done!
      setProcessingState('ready');
    } catch (error) {
      console.error('Error processing article:', error);
      setProcessingState('error');
      
      // Clear any placeholder data
      setArticleData(null);
      setSimplifiedText('');
      
      // Set clear error message
      const errorMsg = error instanceof Error 
          ? error.message 
        : "Failed to process article. Please check that the backend server is running.";
      
      setErrorMessage(errorMsg);
    }
  };

  // Handle retry after error
  const handleRetry = () => {
    setProcessingState('idle');
    setErrorMessage('');
    setArticleData(null);
    setSimplifiedText('');
  };

  // Handle logo click to return home
  const handleLogoClick = () => {
    setProcessingState('idle');
    setSimplifiedText('');
    setArticleData(null);
    setErrorMessage('');
  };

  // Handle reading level change - re-simplify with new level
  const handleReadingLevelChange = async (newLevel: number[]) => {
    const level = newLevel[0];
    setReadingLevel(level);
    
    // If we already have article data and are in ready state, re-simplify
    if (articleData && processingState === 'ready') {
      setProcessingState('simplifying');
      try {
        const simplified = await simplifyArticle(articleData.content, level);
        setSimplifiedText(simplified.simplifiedText);
        setProcessingState('ready');
      } catch (error) {
        console.error('Error re-simplifying article:', error);
        setProcessingState('error');
        setErrorMessage("Couldn't adjust the reading level. Please try again.");
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Determine what content to show
  const renderPanelContent = () => {
    if (processingState === 'scraping') {
      return <LoadingState message="Fetching content..." submessage="Reading the web page" />;
    }
    
    if (processingState === 'simplifying') {
      return <LoadingState message="Simplifying text..." submessage="Making it easier to read" />;
    }
    
    if (processingState === 'error') {
      return <ErrorState message={errorMessage} onRetry={handleRetry} />;
    }
    
    if (processingState === 'ready' && articleData && simplifiedText) {
      return (
        <SimplifiedTextView
          simplifiedText={simplifiedText}
          dyslexiaFont={dyslexiaFont}
          articleTitle={articleData.title}
        />
      );
    }
    
    // Default: Show control panel
    return (
      <SidePanel
        readingLevel={readingLevel}
        onReadingLevelChange={handleReadingLevelChange}
        dyslexiaFont={dyslexiaFont}
        onDyslexiaFontChange={setDyslexiaFont}
        focusMode={focusMode}
        onFocusModeChange={setFocusMode}
        onSimplify={handleSimplify}
        isSimplified={processingState === 'ready'}
      />
    );
  };

  return (
    <div 
      id="gloss-extension-root"
      style={{
        width: '100%',
        height: isInIframe ? '100vh' : 'auto',
        position: isInIframe ? 'relative' : 'static',
        overflow: isInIframe ? 'hidden' : 'visible'
      }}
    >
      {/* Minimized Button - only show in popup mode */}
      {!isInIframe && !isPanelOpen && (
        <MinimizedButton onClick={() => setIsPanelOpen(true)} />
      )}

      {/* Resizable Panel */}
      <ResizablePanel 
        isOpen={isPanelOpen}
        initialWidth={panelWidth}
        onClose={() => {
          setIsPanelOpen(false);
          handleLogoClick();
        }}
        onWidthChange={handlePanelWidthChange}
        onLogoClick={handleLogoClick}
        readingLevel={readingLevel}
        showReadingLevel={processingState === 'ready'}
      >
        {renderPanelContent()}
      </ResizablePanel>

      {/* Focus Mode Effects */}
      {isPanelOpen && <FocusMode isActive={focusMode && processingState === 'ready'} />}
    </div>
  );
}