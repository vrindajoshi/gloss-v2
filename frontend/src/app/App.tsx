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
        4: `Scientists say Earth is getting too hot. They studied the weather all over the world. The Earth is 1.1 degrees hotter than it used to be.

"The Earth is changing very fast," said Dr. Sarah Chen. She is a scientist who helped write the report. "We need to act quickly to help our planet."

The report talks about bad things that are happening. The oceans are getting higher. Some places are getting too much rain. Other places don't have enough water. Animals and plants are having trouble living in their homes.

But scientists say we can still help! "Every little bit helps," Dr. Chen said. "What we do now will make the world better for kids in the future."

We need to use clean energy like wind and solar power. We need to take care of forests and oceans. We have to stop using dirty fuels that make the air bad.

"We know what to do," the report says. "Now we just need everyone to work together to fix this problem."`,
        
        6: `Climate scientists from around the world have released an important report about global warming. They say Earth's temperature is rising faster than ever before. More than 200 scientists from 65 countries worked together on this study.

The Earth has gotten 1.1 degrees Celsius warmer since the 1800s. The biggest temperature increases are happening at the North and South Poles.

"Our planet's climate is changing in ways we can clearly see," said Dr. Sarah Chen, the main author of the report. "We still have time to prevent the worst problems, but we need to act quickly."

The report describes several worrying problems. Ocean levels are rising, causing flooding in coastal cities. Extreme weather like hurricanes and heat waves are becoming more common. Droughts are making it harder for farmers to grow food.

However, the scientists believe we can still make things better. "Every bit of warming we can prevent makes a difference," Dr. Chen explained. "The decisions we make now will affect future generations."

The scientists recommend switching from fossil fuels to clean energy, protecting forests and oceans, and investing in solar and wind power. While the challenge is big, new technology and increased awareness give us hope.

"We already have the tools we need to solve this problem," the report says. "Now we need leaders and citizens to take action."`,
        
        9: `An international team of climate scientists has issued an urgent warning about the accelerating pace of global warming. Their comprehensive report synthesizes research from over 200 experts across 65 nations and presents strong evidence that Earth's climate is changing at an unprecedented rate.

Global temperatures have increased by 1.1 degrees Celsius since pre-industrial times, with the most dramatic changes occurring in polar regions. These changes are affecting weather patterns, sea levels, and ecosystems worldwide.

"The evidence is unequivocal—our climate system is undergoing changes that are, in many cases, irreversible," stated Dr. Sarah Chen, the report's lead author. "While the situation is serious, we still have a narrow window of opportunity to prevent the most severe consequences if we act decisively."

The report documents multiple concerning trends: rising sea levels threatening coastal populations, increased frequency of extreme weather events, and significant disruptions to natural ecosystems. Agricultural regions are experiencing unprecedented droughts and heat waves, while flooding has become more common in many areas.

Despite these challenges, the scientists emphasize that our future is not predetermined. "Every fraction of a degree matters," Dr. Chen noted. "The choices we make this decade will fundamentally shape the world inherited by future generations."

The report advocates for rapid transition to renewable energy, ecosystem protection and restoration, and substantial investment in clean technology. While acknowledging the magnitude of the challenge, the scientists cite recent technological progress and growing public engagement as encouraging signs.

"We possess both the knowledge and technology necessary to address this crisis," the report concludes. "What's required now is the political will and coordinated action to implement solutions at the necessary scale."`,
        
        12: `Climate scientists worldwide have released their most urgent assessment yet regarding accelerating global warming. The comprehensive analysis, compiled by an international panel of more than 200 researchers from 65 countries, presents compelling evidence that Earth's climate system is experiencing unprecedented transformation.

Average global temperatures have risen 1.1 degrees Celsius above pre-industrial baselines, with particularly pronounced increases in polar regions. These changes are manifesting in altered weather patterns, rising sea levels, and widespread ecological disruptions.

"The data demonstrates unequivocal changes to our climate system, many of which are effectively irreversible on human timescales," explained Dr. Sarah Chen, the report's principal author. "However, a critical window remains for preventing the most catastrophic outcomes, provided we implement immediate and decisive action."

The assessment documents several alarming trends: accelerating sea-level rise threatening coastal infrastructure, intensifying extreme weather phenomena, and cascading effects throughout natural ecosystems. Agricultural systems face unprecedented stress from droughts and heat extremes, while flooding events have increased in frequency and severity across multiple regions.

Nevertheless, the scientific community maintains that future trajectories remain malleable. "Temperature increases are not binary—every increment of warming prevented translates to reduced impacts," Dr. Chen emphasized. "Contemporary decisions will fundamentally determine environmental conditions for subsequent generations."

The report advocates comprehensive decarbonization of energy systems, protection and restoration of natural carbon sinks, and accelerated deployment of renewable technologies. While acknowledging formidable challenges, researchers identify recent technological advances and heightened public awareness as sources of cautious optimism.

"The requisite knowledge and technological capacity exist to address this challenge," the report states. "What remains essential is mobilizing political commitment and coordinated implementation at appropriate scales."`,
        
        16: `An international consortium of climate scientists has issued their most urgent assessment to date regarding the acceleration of anthropogenic global warming. This comprehensive synthesis, incorporating research from over 200 scientific experts across 65 nations, presents robust empirical evidence demonstrating that Earth's climate system is undergoing transformation at rates unprecedented in the geological record.

Global mean surface temperatures have increased 1.1°C relative to pre-industrial baselines, with amplified warming trends particularly evident in high-latitude regions. These thermal anomalies are driving cascading effects across multiple Earth systems, including atmospheric circulation patterns, cryospheric dynamics, and biogeochemical cycles.

"The observational data provides unequivocal evidence of systematic climate perturbation, with many transitions exhibiting characteristics of irreversibility within human-relevant timescales," stated Dr. Sarah Chen, principal investigator for the assessment. "Nonetheless, a critical temporal window persists for averting the most severe projected outcomes, contingent upon immediate implementation of comprehensive mitigation strategies."

The assessment documents multiple concerning trajectories: accelerating eustatic sea-level rise threatening low-elevation coastal infrastructure, intensification of hydrometeorological extremes, and widespread ecosystem state transitions. Agricultural systems are experiencing unprecedented thermal and hydrological stress, while pluvial and fluvial flooding events demonstrate increased frequency and magnitude across diverse geographical contexts.

However, the scientific community emphasizes the non-deterministic nature of future climate trajectories. "Climate sensitivity functions continuously—each fractional degree of avoided warming corresponds to proportional reduction in adverse impacts," Dr. Chen noted. "Contemporary policy decisions will fundamentally constrain boundary conditions for future generations."

The report advocates rapid decarbonization of global energy infrastructure, conservation and enhancement of terrestrial and marine carbon sequestration capacity, and accelerated deployment of renewable energy technologies. While acknowledging substantial socioeconomic and technical challenges, researchers cite recent innovations in clean energy systems and evolving societal prioritization as grounds for measured optimism.

"The scientific understanding and technological capabilities necessary to address this existential challenge are well-established," the assessment concludes. "Critical requirements now center on mobilizing sufficient political will and implementing coordinated interventions at scales commensurate with the magnitude of the threat."`,
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

  // Text-to-Speech functions
  const handleTTSPlayPause = async () => {
    if (isSpeaking) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    } else {
      // Play
      const textToSpeak = simplifiedText || '';
      if (!textToSpeak) return;
      
      setIsSpeaking(true);
      
      try {
        const ELEVENLABS_API_KEY = 'YOUR_ELEVENLABS_API_KEY';
        
        if (ELEVENLABS_API_KEY === 'YOUR_ELEVENLABS_API_KEY') {
          throw new Error('ElevenLabs API key not configured');
        }
        
        const VOICE_ID = getVoiceIdForSelection(ttsSelectedVoice);
        
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text: textToSpeak,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5
            }
          })
        });

        if (!response.ok) {
          throw new Error('ElevenLabs API request failed');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onloadedmetadata = () => {
          setTtsDuration(audio.duration);
          // Apply playback speed
          audio.playbackRate = ttsPlaybackSpeed;
        };
        
        intervalRef.current = window.setInterval(() => {
          if (audioRef.current) {
            setTtsCurrentTime(audioRef.current.currentTime);
            const wordsPerSecond = textToSpeak.split(/\s+/).length / audio.duration;
            const estimatedWordIndex = Math.floor(audioRef.current.currentTime * wordsPerSecond);
            setCurrentWordIndex(estimatedWordIndex);
          }
        }, 100);
        
        audio.onended = () => {
          setIsSpeaking(false);
          setTtsCurrentTime(0);
          setCurrentWordIndex(-1);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
        
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
        
        if (ttsCurrentTime > 0) {
          audio.currentTime = ttsCurrentTime;
        }
        
        await audio.play();
        
      } catch (error) {
        console.log('Falling back to browser speech synthesis');
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.rate = 0.9 * ttsPlaybackSpeed; // Base rate 0.9 multiplied by speed
          utterance.pitch = 1.0;
          
          const wordCount = textToSpeak.split(/\s+/).length;
          const estimatedDuration = (wordCount / 150) * 60 / ttsPlaybackSpeed; // Adjust for speed
          setTtsDuration(estimatedDuration);
          
          let startTime = Date.now();
          intervalRef.current = window.setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            setTtsCurrentTime(Math.min(elapsed, estimatedDuration));
            const wordsPerSecond = wordCount / estimatedDuration;
            const estimatedWordIndex = Math.floor(elapsed * wordsPerSecond);
            setCurrentWordIndex(estimatedWordIndex);
          }, 100);
          
          utterance.onend = () => {
            setIsSpeaking(false);
            setTtsCurrentTime(0);
            setCurrentWordIndex(-1);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          };
          
          utterance.onerror = () => {
            setIsSpeaking(false);
            setTtsCurrentTime(0);
            setCurrentWordIndex(-1);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          };
          
          window.speechSynthesis.speak(utterance);
        } else {
          setIsSpeaking(false);
          alert('Text-to-speech is not supported in your browser.');
        }
      }
    }
  };

  const handleTTSSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
      setTtsCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleTTSSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 15);
      setTtsCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleTTSVoiceChange = (voice: string) => {
    setTtsSelectedVoice(voice);
    if (isSpeaking && audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
      setTtsCurrentTime(0);
    }
  };

  const handleTTSSpeedChange = (speed: number) => {
    setTtsPlaybackSpeed(speed);
    
    // Apply speed to current playback if audio is playing
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    
    // For speech synthesis, need to restart with new rate
    if (isSpeaking && !audioRef.current) {
      // Stop and restart with new speed
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      const textToSpeak = simplifiedText || '';
      if (textToSpeak) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.9 * speed; // Base rate 0.9 multiplied by speed
        utterance.pitch = 1.0;
        
        const wordCount = textToSpeak.split(/\s+/).length;
        const estimatedDuration = (wordCount / 150) * 60 / speed; // Adjust for speed
        setTtsDuration(estimatedDuration);
        
        let startTime = Date.now();
        intervalRef.current = window.setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000;
          setTtsCurrentTime(Math.min(elapsed, estimatedDuration));
          const wordsPerSecond = wordCount / estimatedDuration;
          const estimatedWordIndex = Math.floor(elapsed * wordsPerSecond);
          setCurrentWordIndex(estimatedWordIndex);
        }, 100);
        
        utterance.onend = () => {
          setIsSpeaking(false);
          setTtsCurrentTime(0);
          setCurrentWordIndex(-1);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
          setTtsCurrentTime(0);
          setCurrentWordIndex(-1);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
        
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleWordClick = (wordIndex: number) => {
    setCurrentWordIndex(wordIndex);
    
    // Stop current playback
    if (isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsSpeaking(false);
    }
    
    // Calculate the text to speak from this word onwards
    const words = simplifiedText.split(/\s+/);
    const textFromWord = words.slice(wordIndex).join(' ');
    
    if (!textFromWord) return;
    
    setIsSpeaking(true);
    
    // Try ElevenLabs first
    const ELEVENLABS_API_KEY = 'YOUR_ELEVENLABS_API_KEY';
    
    if (ELEVENLABS_API_KEY !== 'YOUR_ELEVENLABS_API_KEY') {
      // Use ElevenLabs API
      const VOICE_ID = getVoiceIdForSelection(ttsSelectedVoice);
      
      fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: textFromWord,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      })
      .then(response => response.blob())
      .then(audioBlob => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onloadedmetadata = () => {
          setTtsDuration(audio.duration);
          // Apply playback speed
          audio.playbackRate = ttsPlaybackSpeed;
        };
        
        intervalRef.current = window.setInterval(() => {
          if (audioRef.current) {
            setTtsCurrentTime(audioRef.current.currentTime);
            const wordsPerSecond = words.length / audio.duration;
            const estimatedWordIndex = wordIndex + Math.floor(audioRef.current.currentTime * wordsPerSecond);
            setCurrentWordIndex(estimatedWordIndex);
          }
        }, 100);
        
        audio.onended = () => {
          setIsSpeaking(false);
          setTtsCurrentTime(0);
          setCurrentWordIndex(-1);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
        
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
        
        audio.play();
      })
      .catch(() => {
        // Fall back to speech synthesis
        useSpeechSynthesis(textFromWord, wordIndex, words.length);
      });
    } else {
      // Use browser speech synthesis
      useSpeechSynthesis(textFromWord, wordIndex, words.length);
    }
  };
  
  const useSpeechSynthesis = (text: string, startWordIndex: number, totalWords: number) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9 * ttsPlaybackSpeed; // Base rate 0.9 multiplied by speed
      utterance.pitch = 1.0;
      
      const wordCount = text.split(/\s+/).length;
      const estimatedDuration = (wordCount / 150) * 60 / ttsPlaybackSpeed; // Adjust for speed
      setTtsDuration(estimatedDuration);
      
      let startTime = Date.now();
      intervalRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setTtsCurrentTime(Math.min(elapsed, estimatedDuration));
        const wordsPerSecond = wordCount / estimatedDuration;
        const estimatedWordIndex = startWordIndex + Math.floor(elapsed * wordsPerSecond);
        setCurrentWordIndex(estimatedWordIndex);
      }, 100);
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setTtsCurrentTime(0);
        setCurrentWordIndex(-1);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setTtsCurrentTime(0);
        setCurrentWordIndex(-1);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const getVoiceIdForSelection = (voiceName: string): string => {
    const voiceMap: Record<string, string> = {
      'Vrinda': 'EXAVITQu4vr4xnSDxMaL',
      'Rohan': '21m00Tcm4TlvDq8ikWAM',
      'Taylor': 'AZnzlk1XvdvUeBnXmlld',
      'Lennox': 'pNInz6obpgDQGcFmaJgB',
    };
    return voiceMap[voiceName] || 'EXAVITQu4vr4xnSDxMaL';
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
          onWordClick={handleWordClick}
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
        showTTS={processingState === 'ready'}
        ttsIsPlaying={isSpeaking}
        ttsCurrentTime={ttsCurrentTime}
        ttsDuration={ttsDuration}
        ttsSelectedVoice={ttsSelectedVoice}
        ttsPlaybackSpeed={ttsPlaybackSpeed}
        onTTSPlayPause={handleTTSPlayPause}
        onTTSSpeedChange={handleTTSSpeedChange}
        onTTSVoiceChange={handleTTSVoiceChange}
      >
        {renderPanelContent()}
      </ResizablePanel>

      {/* Focus Mode Effects */}
      {isPanelOpen && <FocusMode isActive={focusMode && processingState === 'ready'} />}
    </div>
  );
}