import React from 'react';
import { useParams, Link } from 'react-router-dom';
import BubbleSortVisualizer from '../visualizers/BubbleSortVisualizer';
import SelectionSortVisualizer from '../visualizers/SelectionSortVisualizer';
import InsertionSortVisualizer from '../visualizers/InsertionSortVisualizer';
import MergeSortVisualizer from '../visualizers/MergeSortVisualizer';
import QuickSortVisualizer from '../visualizers/QuickSortVisualizer';
import LinearSearchVisualizer from '../visualizers/LinearSearchVisualizer';
import BinarySearchVisualizer from '../visualizers/BinarySearchVisualizer';
import BinarySearchTreeVisualizer from '../visualizers/BinarySearchTreeVisualizer';
import DijkstraVisualizer from '../visualizers/DijkstraVisualizer';
import StackVisualizer from '../visualizers/StackVisualizer';
import QueueVisualizer from '../visualizers/QueueVisualizer';
import LinkedListVisualizer from '../visualizers/LinkedListVisualizer';

export default function VisualizerPage() {
  const { algorithm } = useParams();

  const title = algorithm 
    ? algorithm.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Unknown Algorithm';

  const renderVisualizer = () => {
    switch (algorithm) {
      case 'bubble-sort': return <BubbleSortVisualizer />;
      case 'selection-sort': return <SelectionSortVisualizer />;
      case 'insertion-sort': return <InsertionSortVisualizer />;
      case 'merge-sort': return <MergeSortVisualizer />;
      case 'quick-sort': return <QuickSortVisualizer />;
      case 'linear-search': return <LinearSearchVisualizer />;
      case 'binary-search': return <BinarySearchVisualizer />;
      case 'binary-search-tree': return <BinarySearchTreeVisualizer />;
      case 'dijkstra': return <DijkstraVisualizer />;
      case 'stack': return <StackVisualizer />;
      case 'queue': return <QueueVisualizer />;
      case 'linked-list': return <LinkedListVisualizer />;
      default:
        return (
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 min-h-[40vh] flex flex-col items-center justify-center gap-4">
            <span className="text-5xl">🚧</span>
            <h2 className="text-2xl font-bold text-white text-center">
              {title} <span className="text-[#3f7dd4]">Visualizer</span>
            </h2>
            <p className="text-gray-400 text-lg text-center">
              This algorithm visualization is coming soon!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-gray-400 hover:text-white transition-colors flex items-center justify-center bg-[#1a1a1a] px-4 py-2.5 rounded-lg border border-gray-800 hover:border-gray-600 font-semibold group"
              title="Back to Home"
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 
              Back
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {title}
            </h1>
          </div>
        </div>
        
        {renderVisualizer()}
      </div>
    </div>
  );
}
