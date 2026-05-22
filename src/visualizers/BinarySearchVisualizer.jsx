import { useLocation } from 'react-router-dom';
import AIChat from '../components/AIChat';
import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_ARRAY = [7, 3, 9, 1, 5, 8, 2, 6, 4];
const SPEEDS = { 1: 1500, 2: 1000, 3: 600, 4: 300, 5: 100 };

import QuizMode from '../components/QuizMode';
import { quizData } from '../data/quizData';

export default function BinarySearchVisualizer() {
  const location = useLocation();

  const [array, setArray] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [message, setMessage] = useState("Ready to search. Enter a target and click Search!");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [targetInput, setTargetInput] = useState("");
  const [error, setError] = useState("");

  const [pointers, setPointers] = useState({ left: null, mid: null, right: null });

  const searchingRef = useRef(false);
  const pausedRef = useRef(false);
  const speedRef = useRef(3);
  const voiceEnabledRef = useRef(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const isComplete = !isSearching && array.length > 0 && array.some(item => item.state === 'found' || item.state === 'eliminated');

  useEffect(() => {
    if (location.state?.customArray && location.state.customArray.length > 0) {
      console.log("Array loaded from NL input:", location.state.customArray);
      resetArray(location.state.customArray);
    } else {
      resetArray(DEFAULT_ARRAY);
    }
    return () => window.speechSynthesis.cancel();
  }, [location.state]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    voiceEnabledRef.current = isVoiceEnabled;
    if (!isVoiceEnabled) {
      window.speechSynthesis.cancel();
    }
  }, [isVoiceEnabled]);

  const resetArray = (values) => {
    searchingRef.current = false;
    pausedRef.current = false;
    setIsSearching(false);
    setIsPaused(false);
    window.speechSynthesis.cancel();
    setMessage("Ready to search. Enter a target and click Search!");
    setPointers({ left: null, mid: null, right: null });
    
    // Auto sort for binary search
    const sortedValues = [...values].sort((a, b) => a - b);
    
    const newArray = sortedValues.map((val, idx) => ({
      id: `${val}-${idx}-${Math.random()}`,
      value: val,
      state: 'default' 
    }));
    setArray(newArray);
  };

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

  const waitIfPaused = async () => {
    while (pausedRef.current) {
      if (!searchingRef.current) return;
      await sleep(100);
    }
  };

  const getDelay = () => SPEEDS[speedRef.current] || 600;

  const handleSearch = async () => {
    if (!targetInput.trim()) {
      setError("Please enter a target number to search.");
      return;
    }
    const target = parseInt(targetInput, 10);
    if (isNaN(target)) {
      setError("Target must be a number.");
      return;
    }
    setError("");

    if (isSearching && isPaused) {
      setIsPaused(false);
      pausedRef.current = false;
      return;
    }
    
    if (isSearching && !isPaused) return;

    if (array.some(item => item.state !== 'default')) {
      const vals = array.map(a => a.value);
      searchingRef.current = false;
      pausedRef.current = false;
      setIsSearching(false);
      setIsPaused(false);
      setPointers({ left: null, mid: null, right: null });
      setArray(vals.map((val, idx) => ({
        id: `${val}-${idx}-${Math.random()}`,
        value: val,
        state: 'default' 
      })));
      await sleep(100);
    }

    setIsSearching(true);
    setIsPaused(false);
    searchingRef.current = true;
    pausedRef.current = false;
    
    let arr = [...array];
    
    setMessage(`Array auto-sorted: [${arr.map(a => a.value).join(', ')}]`);
    await speak(`Array auto-sorted: [${arr.map(a => a.value).join(', ')}]`);
    await sleep(getDelay());

    if (!searchingRef.current) return;
    await waitIfPaused();

    setMessage(`Starting Binary Search for target ${target}...`);
    await speak(`Starting Binary Search for target ${target}...`);
    await sleep(getDelay());

    let comparisons = 0;
    let found = false;
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      if (!searchingRef.current) return;
      await waitIfPaused();

      comparisons++;
      let mid = Math.floor((left + right) / 2);
      
      setPointers({ left, mid, right });
      arr[mid] = { ...arr[mid], state: 'mid' };
      setArray([...arr]);
      
      setMessage(`Left=${left}, Right=${right}, Mid=${mid}. Checking middle value ${arr[mid].value}.`);
      await speak(`Left=${left}, Right=${right}, Mid=${mid}. Checking middle value ${arr[mid].value}.`);
      await sleep(getDelay());

      if (!searchingRef.current) return;
      await waitIfPaused();

      if (arr[mid].value === target) {
        arr[mid] = { ...arr[mid], state: 'found' };
        setArray([...arr]);
        found = true;
        
        setMessage(`Found it! Target ${target} is at index ${mid}!`);
        await speak(`Found it! Target ${target} is at index ${mid}!`);
        await sleep(getDelay());
        break;
      } else if (arr[mid].value < target) {
        setMessage(`${arr[mid].value} is less than ${target}. Eliminating left half.`);
        await speak(`${arr[mid].value} is less than ${target}. Eliminating left half.`);
        
        for (let i = left; i <= mid; i++) {
          arr[i] = { ...arr[i], state: 'eliminated' };
        }
        setArray([...arr]);
        await sleep(getDelay());
        
        left = mid + 1;
      } else {
        setMessage(`${arr[mid].value} is greater than ${target}. Eliminating right half.`);
        await speak(`${arr[mid].value} is greater than ${target}. Eliminating right half.`);
        
        for (let i = mid; i <= right; i++) {
          arr[i] = { ...arr[i], state: 'eliminated' };
        }
        setArray([...arr]);
        await sleep(getDelay());
        
        right = mid - 1;
      }
    }

    if (!searchingRef.current) return;

    if (found) {
      setMessage(`Binary Search found ${target} in only ${comparisons} comparisons!`);
      await speak(`Binary Search found ${target} in only ${comparisons} comparisons!`);
    } else {
      setPointers({ left: null, mid: null, right: null });
      setMessage(`Target ${target} not found. Search space exhausted.`);
      await speak(`Target ${target} not found. Search space exhausted.`);
      await sleep(getDelay());
      
      if (!searchingRef.current) return;
      setMessage(`Binary Search checked only ${comparisons} elements out of ${arr.length}!`);
      await speak(`Binary Search checked only ${comparisons} elements out of ${arr.length}!`);
    }
    
    setIsSearching(false);
    setIsPaused(false);
    searchingRef.current = false;
    pausedRef.current = false;
  };

  const handlePause = () => {
    if (isSearching && !isPaused) {
      setIsPaused(true);
      pausedRef.current = true;
      window.speechSynthesis.pause();
    }
  };

  const handleReset = () => {
    setTargetInput("");
    resetArray(DEFAULT_ARRAY);
  };

  const handleSetArray = () => {
    if (!customInput.trim()) {
      setError("Please enter some numbers.");
      return;
    }
    const parts = customInput.split(',').map(s => s.trim());
    const newValues = [];
    for (let p of parts) {
      if (!/^\d+$/.test(p)) {
        setError("Only numbers and commas are allowed.");
        return;
      }
      const num = parseInt(p, 10);
      if (num > 999) {
        setError("Maximum allowed value is 999.");
        return;
      }
      newValues.push(num);
    }
    if (newValues.length === 0) {
      setError("Please enter valid numbers.");
      return;
    }
    if (newValues.length > 12) {
      setError("Maximum 12 numbers allowed.");
      return;
    }
    setError("");
    setCustomInput("");
    resetArray(newValues);
  };

  const getColor = (state) => {
    switch (state) {
      case 'mid': return '#F59E0B'; // yellow/orange
      case 'eliminated': return '#6B7280'; // gray
      case 'found': return '#10B981'; // green
      case 'default':
      default: return '#7C3AED'; // purple
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto items-start">
      
      {/* LEFT SIDE (60% width) */}
      <div className="w-full lg:w-[60%] flex flex-col gap-6">
        {/* SECTION 1: BOX DISPLAY */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8 min-h-[300px] flex flex-col items-center justify-center gap-6 relative">
          
          <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto w-full pb-8">
            {array.map((item, idx) => {
              return (
                <div key={item.id} className="flex flex-col items-center gap-2 relative">
                  <div 
                    className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-lg font-bold text-white text-lg sm:text-xl transition-all duration-300 ease-in-out shrink-0 border border-white/10"
                    style={{
                      backgroundColor: getColor(item.state),
                      transform: item.state === 'mid' ? 'scale(1.1)' : 'scale(1)',
                      opacity: item.state === 'eliminated' ? 0.4 : 1,
                    }}
                  >
                    {item.value}
                  </div>
                  
                  {/* POINTER LABELS BELOW BOXES */}
                  <div className="absolute -bottom-8 flex gap-1 justify-center w-full font-bold text-sm">
                    {pointers.left === idx && <span className="text-blue-500">L</span>}
                    {pointers.mid === idx && <span className="text-yellow-500">M</span>}
                    {pointers.right === idx && <span className="text-red-500">R</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-gray-500 text-sm italic absolute bottom-4">
            Note: Array is auto-sorted for Binary Search
          </p>

        </div>

        {/* SECTION 2: CONTROLS */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-6">
          
          <div className="flex flex-wrap items-center gap-4 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
              <label className="text-gray-300 font-medium whitespace-nowrap">Target:</label>
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="e.g. 5"
                className="w-full sm:w-32 bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#3f7dd4] transition-colors"
                disabled={isSearching}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={handleSearch}
                disabled={isSearching && !isPaused}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex-1 sm:flex-none"
              >
                Search
              </button>
              <button
                onClick={handlePause}
                disabled={!isSearching || isPaused}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex-1 sm:flex-none"
              >
                Pause
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex-1 sm:flex-none"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-[#0f0f0f] px-4 py-2 rounded-lg border border-gray-800 w-full sm:w-auto">
              <label className="text-gray-300 font-medium whitespace-nowrap">Speed: {speed}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                className="accent-[#3f7dd4] cursor-pointer w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 pt-4 border-t border-gray-800">
            <div className="flex-1 min-w-[200px] flex flex-col gap-1">
              <label className="text-sm text-gray-400">Custom Array (comma separated)</label>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 5, 3, 8, 1, 9, 2"
                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#3f7dd4] transition-colors"
                disabled={isSearching}
              />
            </div>
            <button
              onClick={handleSetArray}
              disabled={isSearching}
              className="bg-[#3f7dd4] hover:bg-[#3267b1] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              Set Array
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>

      {/* RIGHT SIDE (40% width) */}
      <div className="w-full lg:w-[40%] flex flex-col gap-6 sticky top-[20px]">
        {/* SECTION 3: AI EXPLANATION BOX & SECTION 4: VOICE */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <h3 className="text-purple-400 font-bold flex items-center gap-2">
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
          <div className="bg-[#0f0f0f] rounded-lg border border-gray-800 p-4 min-h-[120px] flex items-center justify-center">
            <p className="text-white text-lg transition-all text-center">
              {message}
            </p>
          </div>
        </div>

        {/* SECTION 5: COMPLEXITY INFO */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-4">
          <h3 className="text-gray-400 font-bold mb-2 uppercase text-sm tracking-wider">Algorithm Info</h3>
          
          <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <span className="text-gray-400 text-sm">Time Complexity</span>
            <span className="text-white font-mono font-bold">O(log n)</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <span className="text-gray-400 text-sm">Space Complexity</span>
            <span className="text-white font-mono font-bold">O(1)</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <span className="text-gray-400 text-sm">Type</span>
            <span className="text-[#3f7dd4] font-bold">Divide and Conquer</span>
          </div>
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
            algorithmName="Binary Search"
            quizData={quizData["Binary Search"]}
            onClose={() => setShowQuiz(false)}
          />
        )}

      </div>

    </div>
      <AIChat algorithmName="Binary Search" />
    </>
  );
}
