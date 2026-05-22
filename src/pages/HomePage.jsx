import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parseNLInput } from '../utils/nlpParser';

const algorithms = [
  { id: 'bubble-sort', name: 'Bubble Sort' },
  { id: 'selection-sort', name: 'Selection Sort' },
  { id: 'insertion-sort', name: 'Insertion Sort' },
  { id: 'merge-sort', name: 'Merge Sort' },
  { id: 'quick-sort', name: 'Quick Sort' },
  { id: 'linear-search', name: 'Linear Search' },
  { id: 'binary-search', name: 'Binary Search' },
  { id: 'binary-search-tree', name: 'Binary Search Tree' },
  { id: 'dijkstra', name: 'Dijkstra Shortest Path' },
  { id: 'stack', name: 'Stack' },
  { id: 'queue', name: 'Queue' },
  { id: 'linked-list', name: 'Linked List' },
];

function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (input) => {
    const textToParse = input || searchInput;
    if (!textToParse.trim()) return;

    const { algorithm, array } = parseNLInput(textToParse);

    if (algorithm) {
      console.log("Navigating with array:", array);
      setError("");
      setIsSuccess(true);
      setTimeout(() => {
        navigate(`/visualizer/${algorithm}`, { state: { customArray: array } });
      }, 300);
    } else {
      setError("Hmm, I did not understand that. Try typing: show me bubble sort");
      setIsSuccess(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChipClick = (text) => {
    setSearchInput(text);
    handleSearch(text);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#3f7dd4] tracking-tight mb-4 drop-shadow-sm">
            AlgoAI
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium mb-8">
            Visualize DSA. Learn Faster.
          </p>
          
          {/* SEARCH BAR SECTION */}
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
            <div className="flex w-full gap-3 relative">
              <input 
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Try: show me bubble sort on [5,3,8,1]"
                className={`flex-1 bg-[#1a1a1a] border-2 rounded-xl px-5 py-4 text-white text-lg outline-none transition-all duration-300 ${
                  isSuccess 
                    ? 'border-green-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-green-900/20'
                    : 'border-gray-800 focus:border-[#3f7dd4] focus:shadow-[0_0_20px_rgba(63,125,212,0.2)]'
                }`}
              />
              <button 
                onClick={() => handleSearch()}
                className="bg-[#3f7dd4] hover:bg-[#3267b1] text-white font-bold px-6 rounded-xl transition-colors text-lg"
              >
                Go ➡️
              </button>
            </div>
            
            {error && (
              <p className="text-red-500 font-medium w-full text-left ml-2 animate-bounce">
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <button onClick={() => handleChipClick("show me bubble sort")} className="bg-gray-800 hover:bg-[#3f7dd4]/20 hover:text-[#3f7dd4] hover:border-[#3f7dd4] text-gray-300 text-sm font-medium py-1.5 px-3 rounded-full border border-gray-700 transition-all">
                show me bubble sort
              </button>
              <button onClick={() => handleChipClick("how does binary search work")} className="bg-gray-800 hover:bg-[#3f7dd4]/20 hover:text-[#3f7dd4] hover:border-[#3f7dd4] text-gray-300 text-sm font-medium py-1.5 px-3 rounded-full border border-gray-700 transition-all">
                how does binary search work
              </button>
              <button onClick={() => handleChipClick("visualize stack")} className="bg-gray-800 hover:bg-[#3f7dd4]/20 hover:text-[#3f7dd4] hover:border-[#3f7dd4] text-gray-300 text-sm font-medium py-1.5 px-3 rounded-full border border-gray-700 transition-all">
                visualize stack
              </button>
              <button onClick={() => handleChipClick("quick sort on [9,2,7,4]")} className="bg-gray-800 hover:bg-[#3f7dd4]/20 hover:text-[#3f7dd4] hover:border-[#3f7dd4] text-gray-300 text-sm font-medium py-1.5 px-3 rounded-full border border-gray-700 transition-all">
                quick sort on [9,2,7,4]
              </button>
              <button onClick={() => handleChipClick("explain merge sort")} className="bg-gray-800 hover:bg-[#3f7dd4]/20 hover:text-[#3f7dd4] hover:border-[#3f7dd4] text-gray-300 text-sm font-medium py-1.5 px-3 rounded-full border border-gray-700 transition-all">
                explain merge sort
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {algorithms.map((algo) => (
            <div 
              key={algo.id} 
              className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col justify-between hover:border-[#3f7dd4]/50 hover:shadow-[0_0_15px_rgba(63,125,212,0.15)] transition-all duration-300 group"
            >
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#6a9ce4] transition-colors">
                {algo.name}
              </h3>
              <Link 
                to={`/visualizer/${algo.id}`}
                className="w-full text-center bg-[#3f7dd4] hover:bg-[#3267b1] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
              >
                Visualize
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
