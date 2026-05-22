import { useLocation } from 'react-router-dom';
import AIChat from '../components/AIChat';
import React, { useState, useEffect, useRef } from 'react';

import QuizMode from '../components/QuizMode';
import { quizData } from '../data/quizData';

export default function LinkedListVisualizer() {
  const location = useLocation();

  const [list, setList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("🗺️ Linked List is empty! Insert some nodes!");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const animatingRef = useRef(false);
  const voiceEnabledRef = useRef(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const isComplete = !isAnimating && list.length > 0;

  useEffect(() => {
    if (location.state?.customArray) {
      const initList = location.state.customArray.map((val) => ({
        id: Math.random(), value: val, state: 'default'
      }));
      setList(initList);
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

  const printList = (arr) => {
    if (arr.length === 0) return "NULL";
    return arr.map(n => n.value).join(' → ') + ' → NULL';
  };

  const handleInsertHead = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a value.");
      return;
    }
    if (list.length >= 8) {
      setError("");
      setMessage("🚫 List is full! Maximum 8 nodes allowed.");
      await speak("🚫 List is full! Maximum 8 nodes allowed.");
      return;
    }
    
    setError("");
    setInputValue("");
    
    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    const val = inputValue.trim();
    const newNode = { id: Math.random(), value: val, state: 'inserted' };
    
    setMessage(`🏁 Inserting ${val} at head...`);
    await speak(`🏁 Inserting ${val} at head...`);
    
    const newList = [newNode, ...list.map(n => ({...n, state: 'default'}))];
    setList([...newList]);
    
    await sleep(1000);
    
    if (!animatingRef.current) return;
    
    newList[0].state = 'default';
    setList([...newList]);

    const listStr = printList(newList);
    setMessage(`✅ ${val} is now the HEAD node! List: ${listStr}`);
    await speak(`✅ ${val} is now the HEAD node! List: ${listStr}`);
    
    if (newList.length === 3) {
      await speak("🎉 You are a Linked List champion!");
    }

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleInsertTail = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a value.");
      return;
    }
    if (list.length >= 8) {
      setError("");
      setMessage("🚫 List is full! Maximum 8 nodes allowed.");
      await speak("🚫 List is full! Maximum 8 nodes allowed.");
      return;
    }
    
    setError("");
    setInputValue("");
    
    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    const val = inputValue.trim();
    setMessage(`🏴 Inserting ${val} at tail... traversing to end...`);
    await speak(`🏴 Inserting ${val} at tail... traversing to end...`);

    let currentList = list.map(n => ({...n, state: 'default'}));
    
    // Traverse animation
    for (let i = 0; i < currentList.length; i++) {
      if (!animatingRef.current) return;
      currentList[i].state = 'searched';
      setList([...currentList]);
      await sleep(500);
      currentList[i].state = 'default';
      setList([...currentList]);
    }

    if (!animatingRef.current) return;

    const newNode = { id: Math.random(), value: val, state: 'inserted' };
    currentList.push(newNode);
    setList([...currentList]);
    
    await sleep(1000);
    
    if (!animatingRef.current) return;
    
    currentList[currentList.length - 1].state = 'default';
    setList([...currentList]);

    const listStr = printList(currentList);
    setMessage(`✅ ${val} added at tail! List: ${listStr}`);
    await speak(`✅ ${val} added at tail! List: ${listStr}`);

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleDeleteHead = async () => {
    if (list.length === 0) {
      setError("");
      setMessage("🚫 List is empty! Nothing to delete!");
      await speak("🚫 List is empty! Nothing to delete!");
      return;
    }

    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    const headVal = list[0].value;
    setMessage(`❌ Deleting head node ${headVal}...`);
    await speak(`❌ Deleting head node ${headVal}...`);

    let currentList = list.map(n => ({...n, state: 'default'}));
    currentList[0].state = 'deleted';
    setList([...currentList]);

    await sleep(1000);
    
    if (!animatingRef.current) return;

    currentList.shift();
    setList([...currentList]);

    if (currentList.length > 0) {
      const listStr = printList(currentList);
      setMessage(`✅ ${currentList[0].value} is the new HEAD! List: ${listStr}`);
      await speak(`✅ ${currentList[0].value} is the new HEAD! List: ${listStr}`);
    } else {
      setMessage(`✅ Node deleted! 🗺️ Linked List is empty! Insert some nodes!`);
      await speak(`✅ Node deleted! Linked List is empty! Insert some nodes!`);
    }

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleDeleteTail = async () => {
    if (list.length === 0) {
      setError("");
      setMessage("🚫 List is empty! Nothing to delete!");
      await speak("🚫 List is empty! Nothing to delete!");
      return;
    }

    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    setMessage(`❌ Traversing to find tail for deletion...`);
    await speak(`❌ Traversing to find tail for deletion...`);

    let currentList = list.map(n => ({...n, state: 'default'}));
    
    for (let i = 0; i < currentList.length - 1; i++) {
      if (!animatingRef.current) return;
      currentList[i].state = 'searched';
      setList([...currentList]);
      await sleep(500);
      currentList[i].state = 'default';
      setList([...currentList]);
    }

    if (!animatingRef.current) return;

    const tailIdx = currentList.length - 1;
    const tailVal = currentList[tailIdx].value;
    
    currentList[tailIdx].state = 'deleted';
    setList([...currentList]);
    
    setMessage(`❌ Deleting tail node ${tailVal}...`);
    await speak(`❌ Deleting tail node ${tailVal}...`);

    await sleep(1000);
    
    if (!animatingRef.current) return;

    currentList.pop();
    setList([...currentList]);

    if (currentList.length > 0) {
      const listStr = printList(currentList);
      setMessage(`✅ Tail deleted! List: ${listStr}`);
      await speak(`✅ Tail deleted! List: ${listStr}`);
    } else {
      setMessage(`✅ Node deleted! 🗺️ Linked List is empty! Insert some nodes!`);
      await speak(`✅ Node deleted! Linked List is empty! Insert some nodes!`);
    }

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleSearch = async () => {
    if (list.length === 0) {
      setError("");
      setMessage("🚫 List is empty! Nothing to search!");
      await speak("🚫 List is empty! Nothing to search!");
      return;
    }
    if (!inputValue.trim()) {
      setError("Please enter a value to search.");
      return;
    }

    setError("");
    const target = inputValue.trim();
    setInputValue("");

    if (isAnimating) return;
    setIsAnimating(true);
    animatingRef.current = true;

    setMessage(`🔍 Searching for value ${target}...`);
    await speak(`🔍 Searching for value ${target}...`);

    let currentList = list.map(n => ({...n, state: 'default'}));
    let foundIdx = -1;

    for (let i = 0; i < currentList.length; i++) {
      if (!animatingRef.current) return;
      
      currentList[i].state = 'searched';
      setList([...currentList]);
      await sleep(600);
      
      if (currentList[i].value === target) {
        foundIdx = i;
        break;
      } else {
        currentList[i].state = 'default';
        setList([...currentList]);
      }
    }

    if (!animatingRef.current) return;

    if (foundIdx !== -1) {
      setMessage(`✅ Found ${target} at position ${foundIdx}! 🎯`);
      await speak(`✅ Found ${target} at position ${foundIdx}! 🎯`);
      await sleep(1000);
      
      if (!animatingRef.current) return;
      currentList[foundIdx].state = 'default';
      setList([...currentList]);
    } else {
      setMessage(`❌ Value ${target} not found in the list.`);
      await speak(`❌ Value ${target} not found in the list.`);
    }

    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleClear = () => {
    if (isAnimating) return;
    setList([]);
    setMessage("🗺️ Linked List is empty! Insert some nodes!");
    setError("");
    setInputValue("");
  };

  const getColor = (state) => {
    switch (state) {
      case 'inserted': return '#10B981'; // green
      case 'deleted': return '#EF4444'; // red
      case 'searched': return '#F59E0B'; // yellow/orange
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
          
          <div className="flex items-center justify-center min-w-max min-h-[200px] relative px-4">
            {list.length === 0 ? (
              <div className="text-gray-500 text-xl font-bold flex flex-col items-center gap-4 animate-pulse">
                <span className="text-6xl">🗺️</span>
                <span>NULL — Empty List 🗺️</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 relative mt-8">
                {list.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <div className="flex flex-col items-center gap-2 relative shrink-0">
                      {/* Position / Head / Tail labels */}
                      <div className="absolute -top-12 flex flex-col items-center w-full whitespace-nowrap">
                        <span className="text-xs text-gray-400 font-mono">Index: {idx}</span>
                        {idx === 0 && <span className="text-xs text-blue-400 font-bold mt-1">HEAD 🏁</span>}
                        {idx === list.length - 1 && <span className="text-xs text-green-400 font-bold mt-1">TAIL 🏴</span>}
                      </div>

                      {/* Node Box */}
                      <div 
                        className="flex items-stretch rounded-lg shadow-lg font-bold text-white transition-all duration-300 ease-in-out border border-white/20 overflow-hidden"
                        style={{
                          transform: item.state === 'inserted' ? 'scale(1.1)' : item.state === 'deleted' ? 'scale(0.8) opacity(0.5)' : item.state === 'searched' ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        <div 
                          className="flex items-center justify-center w-12 sm:w-16 h-12 sm:h-14 text-lg"
                          style={{ backgroundColor: getColor(item.state) }}
                        >
                          {item.value}
                        </div>
                        <div className="flex items-center justify-center w-8 sm:w-10 h-12 sm:h-14 bg-gray-800 border-l border-gray-700 text-sm">
                          {idx === list.length - 1 ? 'NULL' : '➡️'}
                        </div>
                      </div>
                    </div>

                    {/* Arrow between nodes */}
                    {idx < list.length - 1 && (
                      <div className="text-gray-500 font-bold text-xl px-1">
                        →
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: CONTROLS */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-full sm:w-auto flex-1 min-w-[200px]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value..."
                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-[#3f7dd4] transition-colors"
                disabled={isAnimating}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={handleInsertHead}
              disabled={isAnimating}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-2.5 rounded-lg font-bold transition-colors text-sm"
            >
              Insert Head 🏁
            </button>
            <button
              onClick={handleInsertTail}
              disabled={isAnimating}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2.5 rounded-lg font-bold transition-colors text-sm"
            >
              Insert Tail 🏴
            </button>
            <button
              onClick={handleDeleteHead}
              disabled={isAnimating || list.length === 0}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2.5 rounded-lg font-bold transition-colors text-sm"
            >
              Delete Head ❌
            </button>
            <button
              onClick={handleDeleteTail}
              disabled={isAnimating || list.length === 0}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-3 py-2.5 rounded-lg font-bold transition-colors text-sm"
            >
              Delete Tail ❌
            </button>
            <button
              onClick={handleSearch}
              disabled={isAnimating || list.length === 0}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-3 py-2.5 rounded-lg font-bold transition-colors text-sm"
            >
              Search 🔍
            </button>
            <button
              onClick={handleClear}
              disabled={isAnimating || list.length === 0}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-3 py-2.5 rounded-lg font-bold transition-colors text-sm"
            >
              Clear 🗑️
            </button>
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
            <div className="flex items-center justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 font-medium text-sm">Insert Head</span>
              <span className="text-green-400 font-mono font-bold text-sm">O(1) — Instant!</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 font-medium text-sm">Insert Tail</span>
              <span className="text-blue-400 font-mono font-bold text-sm">O(n) — Traverse to end</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 font-medium text-sm">Delete</span>
              <span className="text-red-400 font-mono font-bold text-sm">O(n) — Find then delete</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 font-medium text-sm">Search</span>
              <span className="text-yellow-400 font-mono font-bold text-sm">O(n) — Check each node</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 font-medium text-sm">Space</span>
              <span className="text-white font-mono font-bold text-sm">O(n)</span>
            </div>
          </div>
        </div>

        {/* FUN FACT */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-red-900/40 rounded-xl border border-yellow-800/50 p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🗺️</div>
          <h3 className="text-yellow-300 font-bold mb-2 flex items-center gap-2">
            💡 Fun Fact
          </h3>
          <p className="text-yellow-100/80 leading-relaxed relative z-10 text-sm">
            Your music playlist is a Linked List! Each song points to the next song. Shuffle = randomize the pointers!
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
            algorithmName="Linked List"
            quizData={quizData["Linked List"]}
            onClose={() => setShowQuiz(false)}
          />
        )}

      </div>

    </div>
      <AIChat algorithmName="Linked List" />
    </>
  );
}
