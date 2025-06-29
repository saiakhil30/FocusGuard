import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Animated3DAvatarProps {
  avatar: {
    id: string;
    name: string;
    personality: string;
    specialty?: string[];
    greeting?: string;
    voice?: {
      tone: string;
      pace: string;
      accent: string;
    };
  };
  message: string;
  isActive: boolean;
  onComplete?: () => void;
}

export default function Animated3DAvatar({ avatar, message, isActive, onComplete }: Animated3DAvatarProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
  }, []);

  useEffect(() => {
    if (isActive && message) {
      startAnimation();
    }
    return () => {
      stopSpeech();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, message]);

  const getAvatarModel = () => {
    const avatarStyles = {
      einstein: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        hair: '#e8e8e8',
        skin: '#fdbcb4',
        clothes: '#4a5568'
      },
      curie: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        hair: '#8b4513',
        skin: '#fdbcb4',
        clothes: '#2d3748'
      },
      tesla: {
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        hair: '#2d3748',
        skin: '#fdbcb4',
        clothes: '#1a202c'
      },
      tutor: {
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        hair: '#4a5568',
        skin: '#fdbcb4',
        clothes: '#2b6cb0'
      }
    };

    return avatarStyles[avatar.id as keyof typeof avatarStyles] || avatarStyles.tutor;
  };

  const startAnimation = async () => {
    setIsAnimating(true);
    setCurrentWordIndex(0);
    
    if (speechSupported) {
      await startSpeech();
    }
    
    // Start breathing animation
    animateBreathing();
  };

  const startSpeech = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!speechSupported || !message) {
        resolve();
        return;
      }

      // Stop any existing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(message);
      speechRef.current = utterance;

      // Configure voice based on avatar
      const voices = window.speechSynthesis.getVoices();
      const voiceConfig = getVoiceConfig();
      
      const selectedVoice = voices.find(voice => 
        voice.lang.includes(voiceConfig.lang) && 
        voice.name.toLowerCase().includes(voiceConfig.gender)
      ) || voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = voiceConfig.rate;
      utterance.pitch = voiceConfig.pitch;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setIsSpeaking(true);
        startMouthAnimation();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsAnimating(false);
        onComplete?.();
        resolve();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsAnimating(false);
        toast({
          title: "Speech Error",
          description: "Could not play voice. Text is still available.",
          variant: "destructive"
        });
        resolve();
      };

      // Add word highlighting
      const words = message.split(' ');
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const wordIndex = Math.floor(event.charIndex / (message.length / words.length));
          setCurrentWordIndex(Math.min(wordIndex, words.length - 1));
        }
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const getVoiceConfig = () => {
    const configs = {
      einstein: { lang: 'en-US', gender: 'male', rate: 0.9, pitch: 1.0 },
      curie: { lang: 'en-US', gender: 'female', rate: 0.8, pitch: 1.1 },
      tesla: { lang: 'en-US', gender: 'male', rate: 1.1, pitch: 0.9 },
      tutor: { lang: 'en-US', gender: 'female', rate: 1.0, pitch: 1.0 }
    };
    return configs[avatar.id as keyof typeof configs] || configs.tutor;
  };

  const startMouthAnimation = () => {
    // Simulate mouth movement while speaking
    const mouthElement = document.getElementById(`mouth-${avatar.id}`);
    if (!mouthElement) return;

    let isOpen = false;
    const interval = setInterval(() => {
      if (!isSpeaking) {
        clearInterval(interval);
        mouthElement.style.transform = 'scaleY(0.3)';
        return;
      }
      
      isOpen = !isOpen;
      mouthElement.style.transform = isOpen ? 'scaleY(1)' : 'scaleY(0.3)';
    }, 150);
  };

  const animateBreathing = () => {
    const avatarElement = document.getElementById(`avatar-${avatar.id}`);
    if (!avatarElement) return;

    let scale = 1;
    let direction = 1;
    
    const breathe = () => {
      if (!isAnimating) return;
      
      scale += direction * 0.002;
      if (scale >= 1.02) direction = -1;
      if (scale <= 0.98) direction = 1;
      
      avatarElement.style.transform = `scale(${scale}) rotateX(${Math.sin(Date.now() * 0.001) * 2}deg)`;
      animationRef.current = requestAnimationFrame(breathe);
    };
    
    breathe();
  };

  const stopSpeech = () => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsAnimating(false);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
    } else if (message) {
      startAnimation();
    }
  };

  const avatarStyle = getAvatarModel();
  const words = message.split(' ');

  return (
    <div className="relative">
      {/* 3D Avatar Container */}
      <div className="perspective-1000 mb-4">
        <div
          id={`avatar-${avatar.id}`}
          className={`
            relative w-32 h-32 mx-auto rounded-full
            transform-gpu transition-all duration-500
            ${isAnimating ? 'animate-bounce' : ''}
            shadow-2xl
          `}
          style={{
            background: avatarStyle.background,
            transformStyle: 'preserve-3d',
            transform: isAnimating ? 'rotateY(5deg) rotateX(-5deg)' : 'rotateY(0deg) rotateX(0deg)'
          }}
        >
          {/* Face */}
          <div className="absolute inset-2 rounded-full" style={{ backgroundColor: avatarStyle.skin }}>
            {/* Eyes */}
            <div className="absolute top-6 left-6 w-3 h-3 bg-black rounded-full"></div>
            <div className="absolute top-6 right-6 w-3 h-3 bg-black rounded-full"></div>
            
            {/* Nose */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-300 rounded-full"></div>
            
            {/* Mouth */}
            <div
              id={`mouth-${avatar.id}`}
              className="absolute top-14 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-red-400 rounded-full transition-transform duration-150"
              style={{ transform: 'scaleY(0.3)' }}
            ></div>
          </div>

          {/* Hair */}
          <div 
            className="absolute -top-2 left-2 right-2 h-8 rounded-t-full"
            style={{ backgroundColor: avatarStyle.hair }}
          ></div>

          {/* Animated Glow Effect */}
          {isAnimating && (
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 animate-pulse"></div>
          )}

          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-6 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Info */}
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg text-gray-900">{avatar.name}</h3>
        <p className="text-sm text-gray-600">{avatar.personality}</p>
        {avatar.specialty && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {avatar.specialty.slice(0, 2).map((spec) => (
              <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Speech Controls */}
      {message && (
        <div className="flex justify-center gap-2 mb-4">
          <Button
            onClick={toggleSpeech}
            size="sm"
            variant={isSpeaking ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isSpeaking ? (
              <>
                <Pause className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Speak
              </>
            )}
          </Button>
          
          {speechSupported ? (
            <Button variant="outline" size="sm">
              <Volume2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <VolumeX className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Message with Word Highlighting */}
      {message && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="text-sm text-gray-700 leading-relaxed">
              {words.map((word, index) => (
                <span
                  key={index}
                  className={`
                    transition-all duration-200
                    ${index === currentWordIndex && isSpeaking ? 'bg-yellow-200 font-semibold' : ''}
                  `}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Info */}
      {avatar.voice && (
        <div className="text-xs text-gray-500 text-center">
          <p>Voice: {avatar.voice.tone} • {avatar.voice.pace} • {avatar.voice.accent}</p>
        </div>
      )}
    </div>
  );
}
