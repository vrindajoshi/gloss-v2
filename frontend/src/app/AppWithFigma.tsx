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

export default function AppWithFigma() {
  // Check if we're in an iframe (embedded on a page)
  const isInIframe = typeof window !== 'undefined' && (() => {
    try {
      return window.parent !== window;
    } catch (e) {
      return true;
    }
  })();

  // In iframe mode, always show the panel (since we only load the iframe when button is clicked)
  // In popup mode, start closed
  const [isPanelOpen, setIsPanelOpen] = useState(isInIframe);
  const [panelWidth, setPanelWidth] = useState(480);
  const [readingLevel, setReadingLevel] = useState(9);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Article data from backend
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Text-to-speech state
  const [ttsCurrentTime, setTtsCurrentTime] = useState(0);
  const [ttsDuration, setTtsDuration] = useState(0);
  const [ttsSelectedVoice, setTtsSelectedVoice] = useState('Vrinda');
  const [ttsPlaybackSpeed, setTtsPlaybackSpeed] = useState(1.0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const intervalRef = useRef<number | null>(null);

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
    const currentUrl = window.location.href;
    
    // Replace with your actual backend endpoint
    const BACKEND_URL = 'YOUR_BACKEND_URL';
    
    // If backend is not configured, use mock data
    if (BACKEND_URL === 'YOUR_BACKEND_URL') {
      console.log('Using mock article data - configure BACKEND_URL in App.tsx to use real backend');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock article data
      return {
        title: 'Climate Change: Scientists Warn of Urgent Need for Action',
        content: `Climate scientists from around the world have issued their most urgent warning yet about the accelerating pace of global warming. The comprehensive report, released by an international panel of experts, highlights the critical need for immediate action to reduce greenhouse gas emissions.`,
        url: currentUrl,
        scrapedAt: new Date().toISOString(),
      };
    }
    
    const response = await fetch(`${BACKEND_URL}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: currentUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to scrape article');
    }

    return await response.json();
  };

  // Backend integration - Simplify article text
  const simplifyArticle = async (content: string, level: number): Promise<SimplificationResponse> => {
    // Replace with your actual backend endpoint
    const BACKEND_URL = 'YOUR_BACKEND_URL';
    
    // If backend is not configured, use mock simplification
    if (BACKEND_URL === 'YOUR_BACKEND_URL') {
      console.log('Using mock simplification - configure BACKEND_URL in App.tsx to use real backend');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock simplified text based on reading level
      const simplifiedVersions: Record<number, string> = {
        4: `Scientists say Earth is getting too hot. They studied the weather all over the world. The Earth is 1.1 degrees hotter than it used to be.`,
        6: `Climate scientists from around the world have released an important report about global warming. They say Earth's temperature is rising faster than ever before.`,
        9: `An international team of climate scientists has issued an urgent warning about the accelerating pace of global warming. Their comprehensive report synthesizes research from over 200 experts across 65 nations.`,
        12: `Climate scientists worldwide have released their most urgent assessment yet regarding accelerating global warming. The comprehensive analysis presents compelling evidence that Earth's climate system is experiencing unprecedented transformation.`,
        16: `An international consortium of climate scientists has issued their most urgent assessment to date regarding the acceleration of anthropogenic global warming. This comprehensive synthesis incorporates research from over 200 scientific experts.`,
      };
      
      return {
        simplifiedText: simplifiedVersions[level] || simplifiedVersions[9],
        readingLevel: level,
      };
    }
    
    const response = await fetch(`${BACKEND_URL}/api/simplify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: content,
        readingLevel: level,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to simplify article');
    }

    return await response.json();
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
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : "This page format isn't supported yet. We're working on adding support for more article types."
      );
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
    
    // Stop any ongoing speech
    stopAllSpeech();
  };

  // Stop all speech playback
  const stopAllSpeech = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsSpeaking(false);
      setTtsCurrentTime(0);
      setCurrentWordIndex(-1);
    }
  };

  // Stop speech when panel closes
  useEffect(() => {
    if (!isPanelOpen) {
      stopAllSpeech();
    }
  }, [isPanelOpen]);

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

  // Handle close button - send postMessage if in iframe
  const handleClose = () => {
    setIsPanelOpen(false);
    handleLogoClick();
    if (isInIframe && window.parent !== window) {
      window.parent.postMessage({ type: 'GLOSS_CLOSE' }, '*');
    }
  };

  // Handle open button
  const handleOpen = () => {
    setIsPanelOpen(true);
    if (isInIframe && window.parent !== window) {
      window.parent.postMessage({ type: 'GLOSS_OPEN' }, '*');
    }
  };

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
          onWordClick={() => {}}
          highlightedWordIndex={currentWordIndex}
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

  // Show minimized button if panel is closed (popup mode only)
  if (!isInIframe && !isPanelOpen) {
    return (
      <div 
        id="gloss-extension-root"
        style={{
          width: '100%',
          height: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '16px',
          pointerEvents: 'none'
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <MinimizedButton onClick={handleOpen} />
        </div>
      </div>
    );
  }

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
      {/* Resizable Panel */}
      <ResizablePanel 
        isOpen={isPanelOpen}
        initialWidth={panelWidth}
        onClose={handleClose}
        onWidthChange={handlePanelWidthChange}
        onLogoClick={handleLogoClick}
        readingLevel={readingLevel}
        showReadingLevel={processingState === 'ready'}
        showTTS={processingState === 'ready'}
        ttsIsPlaying={isSpeaking}
        ttsCurrentTime={ttsCurrentTime}
        ttsDuration={ttsDuration}
        ttsSelectedVoice={ttsSelectedVoice}
        ttsPlaybackSpeed={ttsPlaybackSpeed}
        onTTSPlayPause={() => {}}
        onTTSSpeedChange={() => {}}
        onTTSVoiceChange={() => {}}
      >
        {renderPanelContent()}
      </ResizablePanel>

      {/* Focus Mode Effects */}
      {isPanelOpen && <FocusMode isActive={focusMode && processingState === 'ready'} />}
    </div>
  );
}
