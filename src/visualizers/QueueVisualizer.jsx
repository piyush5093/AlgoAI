import { useLocation } from 'react-router-dom';
import AIChat from '../components/AIChat';
import React, { useState, useEffect, useRef } from 'react';

const QUEUE_EMOJIS = ['👨', '👩', '🧑', '👦', '👧', '👴', '👵', '🧔'];

import QuizMode from '../components/QuizMode';
import { quizData } from '../data/quizData';

export default function QueueVisualizer() {
  const location = useLocation();

  const [queue, setQueue] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("🎬 Queue is empty! Start adding people!");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const animatingRef = useRef(false);
  const voiceEnabledRef = useRef(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const isComplete = !isAnimating && queue.length > 0;

  useEffect(() => {
    if (location.state?.customArray) {
      const initQueue = location.state.customArray.map((val) => ({
        id: Math.random(), value: val, emoji: '👨', state: 'default'
      }));
      if (initQueue.length > 0) initQueue[0].state = 'front';
      setQueue(initQueue);
    }
    return () => window.speechSynthesis.cancel();
  }, [location.state]);

  useEffect(() => {
    voiceEnabledRef.current = isVoiceEnabled;
    if (!isVoiceEnabled) {
      window.speechSynthesis.cancel();
    }
  }, [isVoiceEnabled]);

  const speak = (text) => {
    return new Promise((resolve) => {
      if (!voiceEnabledRef.current) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleEnqueue = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a value.");
      return;
    }
    if (queue.length >= 8) {
      setError("");
      setMessage("🚫 Queue is full! No more room in the line!");
      await speak("🚫 Queue is full! No more room in the line!");
      return;
    }
    
    setError("");
    setInputValue("");
    
    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    const val = inputValue.trim();
    const randomEmoji = QUEUE_EMOJIS[Math.floor(Math.random() * QUEUE_EMOJIS.length)];
    const newItem = { id: Math.random(), value: val, emoji: randomEmoji, state: 'enqueued' };
    
    setMessage(`🎟️ Enqueueing ${val} at the rear of the queue...`);
    await speak(`🎟️ Enqueueing ${val} at the rear of the queue...`);
    
    const newQueue = [...queue, newItem]; 
    setQueue([...newQueue]);
    
    await sleep(1000);
    
    if (!animatingRef.current) return;
    
    newQueue[newQueue.length - 1].state = 'default';
    if (newQueue.length > 0) {
      newQueue[0].state = 'front';
    }
    setQueue([...newQueue]);

    setMessage(`✅ ${val} joined the line at rear! Queue size: ${newQueue.length}`);
    await speak(`✅ ${val} joined the line at rear! Queue size: ${newQueue.length}`);
    
    if (newQueue.length === 3) {
      await speak("🎉 You understand Queue now! FIFO master!");
    }

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleDequeue = async () => {
    if (queue.length === 0) {
      setError("");
      setMessage("🚫 Queue is empty! No one to dequeue!");
      await speak("🚫 Queue is empty! No one to dequeue!");
      return;
    }

    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    const frontVal = queue[0].value;
    setMessage(`🎬 Dequeueing from front... ${frontVal} gets the ticket!`);
    await speak(`🎬 Dequeueing from front... ${frontVal} gets the ticket!`);

    let currentQueue = [...queue];
    currentQueue[0].state = 'dequeuing';
    setQueue([...currentQueue]);

    await sleep(1000);
    
    if (!animatingRef.current) return;

    currentQueue.shift();
    if (currentQueue.length > 0) {
      currentQueue[0].state = 'front';
    }
    setQueue([...currentQueue]);

    if (currentQueue.length > 0) {
      setMessage(`✅ ${frontVal} left the queue! ${currentQueue[0].value} is now at the front.`);
      await speak(`✅ ${frontVal} left the queue! ${currentQueue[0].value} is now at the front.`);
    } else {
      setMessage(`✅ ${frontVal} left the queue! 🎬 Queue is empty! Start adding people!`);
      await speak(`✅ ${frontVal} left the queue! Queue is empty! Start adding people!`);
    }

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handlePeek = async () => {
    if (queue.length === 0) {
      setError("");
      setMessage("🚫 Queue is empty! No one to peek at!");
      await speak("🚫 Queue is empty! No one to peek at!");
      return;
    }

    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    const frontVal = queue[0].value;
    setMessage(`👀 Front of queue is ${frontVal} (just peeking!)`);
    await speak(`👀 Front of queue is ${frontVal} (just peeking!)`);

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleClear = () => {
    if (isAnimating) return;
    setQueue([]);
    setMessage("🎬 Queue is empty! Start adding people!");
    setError("");
    setInputValue("");
  };

  const getColor = (state) => {
    switch (state) {
      case 'enqueued': return '#10B981'; // green
      case 'dequeuing': return '#EF4444'; // red
      case 'front': return '#3B82F6'; // blue
      case 'default':
      default: return '#7C3AED'; // purple
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto items-start">
      
      {/* LEFT SIDE (60% width) */}
      <div className="w-full lg:w-[60%] flex flex-col gap-6 min-w-0">
        {/* SECTION 1: VISUALIZATION */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden overflow-x-auto">
          
          <div className="flex items-center justify-center w-full min-h-[200px] relative">
            {queue.length === 0 ? (
              <div className="text-gray-500 text-xl font-bold flex flex-col items-center gap-4 animate-pulse">
                <span className="text-6xl">🎬</span>
                <span>Empty Queue</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 relative px-16">
                <div className="absolute left-0 text-blue-400 font-bold flex flex-col items-center gap-1">
                  <span>🎬</span>
                  <span className="text-sm">FRONT</span>
                </div>
                
                {queue.map((item, idx) => (
                  <div 
                    key={item.id}
                    className="flex flex-col items-center justify-center w-20 h-24 sm:w-24 sm:h-28 rounded-xl shadow-lg font-bold text-white text-lg sm:text-xl transition-all duration-300 ease-in-out border-2 border-white/10 shrink-0"
                    style={{
                      backgroundColor: getColor(item.state),
                      transform: item.state === 'enqueued' ? 'scale(1.1)' : item.state === 'dequeuing' ? 'scale(0.9) opacity(0)' : 'scale(1)',
                    }}
                  >
                    <span className="text-3xl mb-1">{item.emoji}</span>
                    <span>{item.value}</span>
                  </div>
                ))}
                
                <div className="absolute right-0 text-green-400 font-bold flex flex-col items-center gap-1">
                  <span>🎟️</span>
                  <span className="text-sm">REAR</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: CONTROLS */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[150px]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
                placeholder="Enter value..."
                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-[#3f7dd4] transition-colors"
                disabled={isAnimating}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleEnqueue}
                disabled={isAnimating}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                Enqueue 🎟️
              </button>
              <button
                onClick={handleDequeue}
                disabled={isAnimating || queue.length === 0}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                Dequeue 🎬
              </button>
              <button
                onClick={handlePeek}
                disabled={isAnimating || queue.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                Peek Front 👀
              </button>
              <button
                onClick={handleClear}
                disabled={isAnimating || queue.length === 0}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                Clear 🗑️
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
        </div>
      </div>

      {/* RIGHT SIDE (40% width) */}
      <div className="w-full lg:w-[40%] flex flex-col gap-6 sticky top-[20px]">
        {/* SECTION 3: AI EXPLANATION BOX & SECTION 4: VOICE */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <h3 className="text-purple-400 font-bold flex items-center gap-2 text-lg">
              ✨ AI Explanation
            </h3>
            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${
                isVoiceEnabled 
                  ? 'bg-purple-600/20 text-purple-400 border-purple-500/50 hover:bg-purple-600/30' 
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
              }`}
            >
              {isVoiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
            </button>
          </div>
          <div className="bg-[#0f0f0f] rounded-lg border border-gray-800 p-6 min-h-[120px] flex items-center justify-center shadow-inner">
            <p className="text-white text-xl transition-all text-center leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>

        {/* SECTION 5: COMPLEXITY INFO */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-4">
          <h3 className="text-gray-400 font-bold mb-2 uppercase text-sm tracking-wider">Algorithm Info</h3>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 font-medium">Enqueue</span>
              <span className="text-green-400 font-mono font-bold">O(1) — Instant!</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 font-medium">Dequeue</span>
              <span className="text-red-400 font-mono font-bold">O(1) — Instant!</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 font-medium">Peek</span>
              <span className="text-blue-400 font-mono font-bold">O(1) — Instant!</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 font-medium">Space</span>
              <span className="text-white font-mono font-bold">O(n)</span>
            </div>
          </div>
        </div>

        {/* FUN FACT */}
        <div className="bg-gradient-to-r from-green-900/40 to-blue-900/40 rounded-xl border border-green-800/50 p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🎟️</div>
          <h3 className="text-green-300 font-bold mb-2 flex items-center gap-2">
            💡 Fun Fact
          </h3>
          <p className="text-green-100/80 leading-relaxed relative z-10">
            When you send multiple print jobs to a printer, they form a Queue! First document sent = First document printed!
          </p>
        </div>
        {isComplete && (
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] flex justify-center items-center gap-2 text-lg"
          >
            🎯 Take Quiz
          </button>
        )}
        {showQuiz && (
          <QuizMode
            algorithmName="Queue"
            quizData={quizData["Queue"]}
            onClose={() => setShowQuiz(false)}
          />
        )}

      </div>

    </div>
      <AIChat algorithmName="Queue" />
    </>
  );
}
