import { useLocation } from 'react-router-dom';
import AIChat from '../components/AIChat';
import React, { useState, useEffect, useRef } from 'react';

const BURGER_EMOJIS = ['🍔', '🥩', '🧀', '🥬', '🍅', '🥓', '🫓', '🧅', '🍄'];

import QuizMode from '../components/QuizMode';
import { quizData } from '../data/quizData';

export default function StackVisualizer() {
  const location = useLocation();

  const [stack, setStack] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("🍔 Stack is empty! Start building your stack!");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const animatingRef = useRef(false);
  const voiceEnabledRef = useRef(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const isComplete = !isAnimating && stack.length > 0;

  useEffect(() => {
    if (location.state?.customArray) {
      const initStack = location.state.customArray.map((val) => ({
        id: Math.random(), value: val, emoji: '🍔', state: 'default'
      })).reverse();
      if (initStack.length > 0) initStack[0].state = 'top';
      setStack(initStack);
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

  const handlePush = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a value.");
      return;
    }
    if (stack.length >= 8) {
      setError("");
      setMessage("🚫 Stack is full! Cannot push more than 8 items.");
      await speak("🚫 Stack is full! Cannot push more than 8 items.");
      return;
    }
    
    setError("");
    setInputValue("");
    
    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    const val = inputValue.trim();
    const randomEmoji = BURGER_EMOJIS[Math.floor(Math.random() * BURGER_EMOJIS.length)];
    const newItem = { id: Math.random(), value: val, emoji: randomEmoji, state: 'pushed' };
    
    setMessage(`🚀 Pushing ${val} onto the top of the stack...`);
    await speak(`🚀 Pushing ${val} onto the top of the stack...`);
    
    const newStack = [newItem, ...stack]; 
    setStack([...newStack]);
    
    await sleep(1000);
    
    if (!animatingRef.current) return;
    
    newStack[0].state = 'top';
    if (newStack.length > 1) {
      newStack[1].state = 'default';
    }
    setStack([...newStack]);

    setMessage(`✅ ${val} is now sitting proudly on top! Stack size: ${newStack.length}`);
    await speak(`✅ ${val} is now sitting proudly on top! Stack size: ${newStack.length}`);
    
    if (newStack.length === 3) {
      await speak("🎉 Great job understanding Stack operations!");
    }

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handlePop = async () => {
    if (stack.length === 0) {
      setError("");
      setMessage("🚫 Stack is empty! Nothing to pop!");
      await speak("🚫 Stack is empty! Nothing to pop!");
      return;
    }

    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    const topVal = stack[0].value;
    setMessage(`💨 Popping ${topVal} from the top of the stack...`);
    await speak(`💨 Popping ${topVal} from the top of the stack...`);

    let currentStack = [...stack];
    currentStack[0].state = 'popping';
    setStack([...currentStack]);

    await sleep(1000);
    
    if (!animatingRef.current) return;

    currentStack.shift();
    if (currentStack.length > 0) {
      currentStack[0].state = 'top';
    }
    setStack([...currentStack]);

    if (currentStack.length > 0) {
      setMessage(`✅ ${topVal} has been removed! ${currentStack[0].value} is the new top!`);
      await speak(`✅ ${topVal} has been removed! ${currentStack[0].value} is the new top!`);
    } else {
      setMessage(`✅ ${topVal} has been removed! 🍔 Stack is empty! Start building your stack!`);
      await speak(`✅ ${topVal} has been removed! Stack is empty! Start building your stack!`);
    }

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handlePeek = async () => {
    if (stack.length === 0) {
      setError("");
      setMessage("🚫 Stack is empty! Nothing to peek!");
      await speak("🚫 Stack is empty! Nothing to peek!");
      return;
    }

    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    const topVal = stack[0].value;
    setMessage(`👀 Peeking at top... it's ${topVal}! (not removed)`);
    await speak(`👀 Peeking at top... it's ${topVal}! (not removed)`);

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleClear = () => {
    if (isAnimating) return;
    setStack([]);
    setMessage("🍔 Stack is empty! Start building your stack!");
    setError("");
    setInputValue("");
  };

  const getColor = (state) => {
    switch (state) {
      case 'pushed': return '#10B981'; // green
      case 'popping': return '#EF4444'; // red
      case 'top': return '#3B82F6'; // blue
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
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8 min-h-[400px] flex flex-col items-center justify-end relative overflow-hidden overflow-y-auto">
          
          <div className="flex flex-col items-center justify-end w-full min-h-[300px] pb-8 relative">
            {stack.length === 0 ? (
              <div className="text-gray-500 text-xl font-bold flex flex-col items-center gap-4 animate-pulse">
                <span className="text-6xl">🍔</span>
                <span>Empty Stack</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2 relative">
                {stack.map((item, idx) => (
                  <div key={item.id} className="relative flex items-center justify-center">
                    {idx === 0 && (
                      <div className="absolute -left-20 text-blue-400 font-bold flex items-center gap-2 animate-bounce">
                        TOP <span>→</span>
                      </div>
                    )}
                    <div 
                      className="flex items-center justify-center w-32 h-14 sm:w-40 sm:h-16 rounded-xl shadow-lg font-bold text-white text-lg sm:text-xl transition-all duration-300 ease-in-out border-2 border-white/10 relative overflow-hidden group"
                      style={{
                        backgroundColor: getColor(item.state),
                        transform: item.state === 'pushed' ? 'scale(1.1)' : item.state === 'popping' ? 'scale(0.9) opacity(0)' : 'scale(1)',
                        zIndex: 10 - idx
                      }}
                    >
                      <span className="absolute left-4 text-2xl">{item.emoji}</span>
                      <span>{item.value}</span>
                    </div>
                  </div>
                ))}
                {/* Burger base when items exist */}
                <div className="w-32 sm:w-40 h-8 bg-[#8B4513] rounded-b-xl mt-1 opacity-50 border-t-4 border-[#A0522D] flex items-center justify-center text-xs text-white/50">Base</div>
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
                onKeyDown={(e) => e.key === 'Enter' && handlePush()}
                placeholder="Enter value..."
                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-[#3f7dd4] transition-colors"
                disabled={isAnimating}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePush}
                disabled={isAnimating}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                Push 🍔
              </button>
              <button
                onClick={handlePop}
                disabled={isAnimating || stack.length === 0}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                Pop 💨
              </button>
              <button
                onClick={handlePeek}
                disabled={isAnimating || stack.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                Peek 👀
              </button>
              <button
                onClick={handleClear}
                disabled={isAnimating || stack.length === 0}
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
              <span className="text-gray-400 font-medium">Push</span>
              <span className="text-green-400 font-mono font-bold">O(1) — Instant!</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 font-medium">Pop</span>
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
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl border border-blue-800/50 p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🍔</div>
          <h3 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
            💡 Fun Fact
          </h3>
          <p className="text-blue-100/80 leading-relaxed relative z-10">
            Your browser's <strong>Back button</strong> uses a Stack! Every page you visit is pushed onto a stack. Clicking Back pops it!
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
            algorithmName="Stack"
            quizData={quizData["Stack"]}
            onClose={() => setShowQuiz(false)}
          />
        )}

      </div>

    </div>
      <AIChat algorithmName="Stack" />
    </>
  );
}
