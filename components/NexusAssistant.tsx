'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, X, Command, Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function NexusAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantText, setAssistantText] = useState('I am Nexus. How can I assist with your enterprise audit today?');
  const recognitionRef = useRef<any>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    // 1. Voice Initialization
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Expanded filter for female/professional voices across OS (Win, Mac, Linux, Mobile)
      const preferredVoices = [
        'Google UK English Female',
        'Google US English Female',
        'Microsoft Zira',
        'Samantha',
        'Victoria',
        'Tessa',
        'Moira',
        'English (United Kingdom) Female',
        'English (United States) Female'
      ];

      const bestVoice = voices.find(v => preferredVoices.some(pv => v.name.includes(pv))) || 
                        voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman')) ||
                        voices[0];
      
      voiceRef.current = bestVoice;
    };

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // 2. Speech Recognition Initialization
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.results[event.resultIndex][0].transcript;
        setTranscript(current);
        
        if (event.results[event.resultIndex].isFinal) {
          processVoiceCommand(current);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [pathname]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }
      
      utterance.pitch = 1.0;
      utterance.rate = 1.05;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setAssistantText(text);
    }
  };

  const processVoiceCommand = async (text: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, currentPath: pathname }),
      });

      const data = await response.json();
      
      // 1. Speak the response
      speak(data.spoken_response);

      // 2. Execute the action
      if (data.action === 'navigate' && data.target) {
        setTimeout(() => router.push(data.target), 1500);
      }
      if (data.action === 'scroll' && data.target) {
        const element = document.getElementById(data.target);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }

    } catch (error) {
      console.error("Assistant Error:", error);
      speak("I encountered a synchronization error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      
      {/* Assistant Bubble */}
      <AnimatePresence>
        {(isListening || isSpeaking || isProcessing || transcript) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl max-w-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nexus Intelligence</span>
              </div>
              {isProcessing && <Loader2 className="w-3 h-3 text-white/20 animate-spin" />}
            </div>
            
            <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest mb-1">
              {isListening ? "Listening..." : isProcessing ? "Thinking..." : "Nexus Response"}
            </p>
            <p className="text-sm text-white/90 font-medium leading-relaxed">
              {transcript || assistantText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neural Orb Trigger */}
      <button 
        onClick={toggleListening}
        className="relative group outline-none"
      >
        {/* Glow Effects */}
        <div className={`absolute inset-0 bg-blue-600 blur-2xl rounded-full transition-all duration-700 ${
          isListening || isSpeaking ? 'opacity-40 scale-150' : 'opacity-0 group-hover:opacity-20'
        }`} />
        
        <div className={`relative w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 ${
          isListening ? 'bg-blue-600 border-white scale-110 shadow-2xl shadow-blue-500/50' : 
          isSpeaking ? 'bg-neutral-800 border-blue-500/50' :
          'bg-black border-white/10 group-hover:border-white/20'
        }`}>
          {(isListening || isSpeaking) ? (
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div 
                  key={i}
                  animate={{ height: [6, 20, 6] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 0.6, 
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-1 bg-white rounded-full"
                />
              ))}
            </div>
          ) : (
            <Mic className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
          )}
        </div>

        {/* Command Tooltip */}
        {!isListening && !isSpeaking && (
          <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-4 group-hover:translate-x-0">
            <div className="bg-neutral-900/90 backdrop-blur text-white/60 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3 shadow-xl">
              <Command className="w-3.5 h-3.5 text-blue-500" />
              Ask Nexus anything
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
