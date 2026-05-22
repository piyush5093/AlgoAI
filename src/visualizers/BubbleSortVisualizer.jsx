import { useLocation } from 'react-router-dom';
import AIChat from '../components/AIChat';
import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_ARRAY = [7, 3, 9, 1, 5, 8, 2, 6, 4];
const SPEEDS = { 1: 1500, 2: 1000, 3: 600, 4: 300, 5: 100 };

import QuizMode from '../components/QuizMode';
import { quizData } from '../data/quizData';

export default function BubbleSortVisualizer() {
  const location = useLocation();

  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [message, setMessage] = useState("Ready to sort. Click Play to start!");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");

  // Refs for async loop control
  const sortingRef = useRef(false);
  const pausedRef = useRef(false);
  const speedRef = useRef(3);
  const voiceEnabledRef = useRef(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const isComplete = !isSorting && array.length > 0 && array.every(item => item.state === 'sorted');

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
    sortingRef.current = false;
    pausedRef.current = false;
    setIsSorting(false);
    setIsPaused(false);
    window.speechSynthesis.cancel();
    setMessage("Ready to sort. Click Play to start!");
    
    const newArray = values.map((val, idx) => ({
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
      if (!sortingRef.current) return;
      await sleep(100);
    }
  };

  const getDelay = () => SPEEDS[speedRef.current] || 600;

  const handlePlay = async () => {
    if (isSorting && isPaused) {
      setIsPaused(false);
      pausedRef.current = false;
      return;
    }
    
    if (isSorting && !isPaused) return;

    if (array.every(item => item.state === 'sorted')) {
      resetArray(array.map(a => a.value));
      await sleep(100);
    }

    setIsSorting(true);
    setIsPaused(false);
    sortingRef.current = true;
    pausedRef.current = false;
    
    let arr = [...array];
    setMessage(`Starting Bubble Sort on [${arr.map(a => a.value).join(', ')}]`);
    await speak(`Starting Bubble Sort on [${arr.map(a => a.value).join(', ')}]`);
    await sleep(getDelay());

    let comparisons = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      let swapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (!sortingRef.current) return;
        await waitIfPaused();

        arr[j] = { ...arr[j], state: 'comparing' };
        arr[j+1] = { ...arr[j+1], state: 'comparing' };
        setArray([...arr]);
        comparisons++;
        
        setMessage(`Pass ${i + 1}: Comparing ${arr[j].value} and ${arr[j+1].value} at positions ${j} and ${j+1}`);
        
        await speak(`Pass ${i + 1}: Comparing ${arr[j].value} and ${arr[j+1].value} at positions ${j} and ${j+1}`);
        await sleep(getDelay());

        if (!sortingRef.current) return;
        await waitIfPaused();

        if (arr[j].value > arr[j+1].value) {
          arr[j] = { ...arr[j], state: 'swapping' };
          arr[j+1] = { ...arr[j+1], state: 'swapping' };
          setArray([...arr]);
          setMessage(`${arr[j].value} is greater than ${arr[j+1].value} — swapping!`);
          await speak(`${arr[j].value} is greater than ${arr[j+1].value} — swapping!`);
          await sleep(getDelay());

          if (!sortingRef.current) return;
          await waitIfPaused();

          let temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;
          swapped = true;
        } else {
          setMessage(`${arr[j].value} is less than ${arr[j+1].value} — no swap needed.`);
          await speak(`${arr[j].value} is less than ${arr[j+1].value} — no swap needed.`);
          await sleep(getDelay());
        }

        if (!sortingRef.current) return;
        
        arr[j] = { ...arr[j], state: 'default' };
        arr[j+1] = { ...arr[j+1], state: 'default' };
        setArray([...arr]);
      }

      if (!sortingRef.current) return;

      const sortedIdx = arr.length - 1 - i;
      arr[sortedIdx] = { ...arr[sortedIdx], state: 'sorted' };
      setArray([...arr]);
      setMessage(`Pass ${i + 1} complete! Largest element ${arr[sortedIdx].value} is now sorted.`);
      await speak(`Pass ${i + 1} complete! Largest element ${arr[sortedIdx].value} is now sorted.`);
      await sleep(getDelay());

      if (!swapped) {
        for (let k = 0; k <= arr.length - 1 - i; k++) {
          arr[k] = { ...arr[k], state: 'sorted' };
        }
        setArray([...arr]);
        break;
      }
    }

    if (!sortingRef.current) return;

    for (let k = 0; k < arr.length; k++) {
      arr[k] = { ...arr[k], state: 'sorted' };
    }
    setArray([...arr]);
    setMessage(`Array is fully sorted! Total comparisons: ${comparisons}. O(n²)`);
    await speak(`Array is fully sorted! Total comparisons: ${comparisons}. O(n²)`);
    
    setIsSorting(false);
    setIsPaused(false);
    sortingRef.current = false;
    pausedRef.current = false;
  };

  const handlePause = () => {
    if (isSorting && !isPaused) {
      setIsPaused(true);
      pausedRef.current = true;
      window.speechSynthesis.pause();
    }
  };

  const handleReset = () => {
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

  const maxValue = array.length > 0 ? Math.max(...array.map(d => d.value)) : 1;

  const getColor = (state) => {
    switch (state) {
      case 'comparing': return '#F59E0B'; 
      case 'swapping': return '#EF4444'; 
      case 'sorted': return '#10B981'; 
      case 'default':
      default: return '#7C3AED'; 
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto items-start">
      
      {/* LEFT SIDE (60% width) */}
      <div className="w-full lg:w-[60%] flex flex-col gap-6 min-w-0">
        {/* SECTION 1: BAR DISPLAY */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8 min-h-[300px] flex items-end justify-center gap-2 sm:gap-4 overflow-x-auto relative">
          {array.map((item) => {
            const barHeight = Math.max((item.value / maxValue) * 200, 20);
            return (
              <div key={item.id} className="flex flex-col items-center gap-2 group shrink-0">
                <div 
                  className="w-10 sm:w-14 rounded-t-md transition-all duration-300 ease-in-out shadow-lg"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: getColor(item.state),
                  }}
                ></div>
                <span className="text-white font-semibold text-sm sm:text-base">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* SECTION 2: CONTROLS */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlay}
                disabled={isSorting && !isPaused}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
              >
                Play
              </button>
              <button
                onClick={handlePause}
                disabled={!isSorting || isPaused}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
              >
                Pause
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center gap-3 bg-[#0f0f0f] px-4 py-2 rounded-lg border border-gray-800">
              <label className="text-gray-300 font-medium">Speed: {speed}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                className="accent-[#3f7dd4] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 pt-4 border-t border-gray-800">
            <div className="flex-1 w-full sm:w-auto min-w-[200px] flex flex-col gap-1">
              <label className="text-sm text-gray-400">Custom Array (comma separated)</label>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 5, 3, 8, 1, 9, 2"
                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#3f7dd4] transition-colors"
                disabled={isSorting}
              />
            </div>
            <button
              onClick={handleSetArray}
              disabled={isSorting}
              className="bg-[#3f7dd4] hover:bg-[#3267b1] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
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
            <span className="text-white font-mono font-bold">O(n²)</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <span className="text-gray-400 text-sm">Space Complexity</span>
            <span className="text-white font-mono font-bold">O(1)</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <span className="text-gray-400 text-sm">Stable Sort</span>
            <span className="text-green-400 font-bold">Yes</span>
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
            algorithmName="Bubble Sort"
            quizData={quizData["Bubble Sort"]}
            onClose={() => setShowQuiz(false)}
          />
        )}

      </div>

    </div>
      <AIChat algorithmName="Bubble Sort" />
    </>
  );
}
