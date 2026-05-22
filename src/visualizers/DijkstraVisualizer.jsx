import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AIChat from '../components/AIChat';
import QuizMode from '../components/QuizMode';
import { quizData } from '../data/quizData';

const SPEEDS = { 1: 1500, 2: 1000, 3: 600, 4: 300, 5: 100 };

const INITIAL_NODES = [
  { id: 'A', x: 150, y: 120, state: 'default' },
  { id: 'B', x: 450, y: 120, state: 'default' },
  { id: 'C', x: 80, y: 320, state: 'default' },
  { id: 'D', x: 380, y: 320, state: 'default' },
  { id: 'E', x: 650, y: 320, state: 'default' },
  { id: 'F', x: 300, y: 520, state: 'default' }
];

const INITIAL_EDGES = [
  { id: 'A-B', source: 'A', target: 'B', weight: 4, state: 'default' },
  { id: 'A-C', source: 'A', target: 'C', weight: 2, state: 'default' },
  { id: 'A-D', source: 'A', target: 'D', weight: 1, state: 'default' },
  { id: 'B-D', source: 'B', target: 'D', weight: 5, state: 'default' },
  { id: 'C-D', source: 'C', target: 'D', weight: 8, state: 'default' },
  { id: 'C-F', source: 'C', target: 'F', weight: 10, state: 'default' },
  { id: 'D-E', source: 'D', target: 'E', weight: 2, state: 'default' },
  { id: 'D-F', source: 'D', target: 'F', weight: 6, state: 'default' },
  { id: 'E-F', source: 'E', target: 'F', weight: 3, state: 'default' }
];

export default function DijkstraVisualizer() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);

  const [sourceNode, setSourceNode] = useState('A');
  const [distances, setDistances] = useState({});
  const [previous, setPrevious] = useState({});
  const [visited, setVisited] = useState({});

  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [message, setMessage] = useState("Ready to start! Select a source node and click Start.");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const animatingRef = useRef(false);
  const speedRef = useRef(3);
  const voiceEnabledRef = useRef(false);

  const [stats, setStats] = useState({ currentNode: '-', visitedCount: 0, edgesProcessed: 0 });

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    voiceEnabledRef.current = isVoiceEnabled;
    if (!isVoiceEnabled) {
      window.speechSynthesis.cancel();
    }
  }, [isVoiceEnabled]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const resetGraph = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setDistances({});
    setPrevious({});
    setVisited({});
    setIsAnimating(false);
    setIsComplete(false);
    animatingRef.current = false;
    setMessage("Graph reset. Ready to start!");
    setStats({ currentNode: '-', visitedCount: 0, edgesProcessed: 0 });
    window.speechSynthesis.cancel();
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
  const getDelay = () => SPEEDS[speedRef.current] || 600;

  const handleStart = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsComplete(false);
    animatingRef.current = true;

    let currentNodes = INITIAL_NODES.map(n => ({ ...n }));
    let currentEdges = INITIAL_EDGES.map(e => ({ ...e }));

    let dist = {};
    let prev = {};
    let vis = {};

    currentNodes.forEach(n => {
      dist[n.id] = Infinity;
      prev[n.id] = null;
      vis[n.id] = false;
    });

    dist[sourceNode] = 0;

    setNodes(currentNodes);
    setEdges(currentEdges);
    setDistances({ ...dist });
    setPrevious({ ...prev });
    setVisited({ ...vis });
    setStats({ currentNode: '-', visitedCount: 0, edgesProcessed: 0 });

    let edgesProcessedCount = 0;

    // STEP 1
    currentNodes = currentNodes.map(n => n.id === sourceNode ? { ...n, state: 'source' } : n);
    setNodes(currentNodes);

    setMessage(`Starting Dijkstra algorithm from node ${sourceNode}.`);
    await speak(`Starting Dijkstra algorithm from node ${sourceNode}.`);
    await sleep(getDelay());

    while (true) {
      if (!animatingRef.current) return;

      // Find unvisited node with minimum distance
      let u = null;
      let min = Infinity;
      Object.keys(dist).forEach(nodeId => {
        if (!vis[nodeId] && dist[nodeId] < min) {
          min = dist[nodeId];
          u = nodeId;
        }
      });

      if (u === null || min === Infinity) {
        break; // All reachable nodes visited
      }

      setStats(s => ({ ...s, currentNode: u }));

      // Highlight current node
      currentNodes = currentNodes.map(n => n.id === u ? { ...n, state: 'current' } : n);
      setNodes(currentNodes);

      // STEP 2
      setMessage(`Visiting node ${u} with distance ${min}.`);
      await speak(`Visiting node ${u} with distance ${min}.`);
      await sleep(getDelay());

      // Get neighbors
      const neighbors = currentEdges.filter(e => e.source === u || e.target === u);

      for (let edge of neighbors) {
        if (!animatingRef.current) return;

        const v = edge.source === u ? edge.target : edge.source;
        if (vis[v]) continue; // Skip visited nodes

        edgesProcessedCount++;
        setStats(s => ({ ...s, edgesProcessed: edgesProcessedCount }));

        // STEP 3: Highlight edge relaxing
        currentEdges = currentEdges.map(e => (e.source === edge.source && e.target === edge.target) ? { ...e, state: 'relaxing' } : e);
        setEdges(currentEdges);

        setMessage(`Checking edge from ${u} to ${v} with weight ${edge.weight}.`);
        await speak(`Checking edge from ${u} to ${v} with weight ${edge.weight}.`);
        await sleep(getDelay() / 1.5);

        const alt = dist[u] + edge.weight;
        if (alt < dist[v]) {
          const oldDist = dist[v] === Infinity ? "infinity" : dist[v];
          dist[v] = alt;
          prev[v] = u;

          setDistances({ ...dist });
          setPrevious({ ...prev });

          // STEP 4: Neighbor node and edge flashes blue
          currentNodes = currentNodes.map(n => n.id === v ? { ...n, state: 'flash-blue' } : n);
          currentEdges = currentEdges.map(e => (e.source === edge.source && e.target === edge.target) ? { ...e, state: 'flash-blue' } : e);
          setNodes(currentNodes);
          setEdges(currentEdges);

          setMessage(`Found shorter path to ${v}. Updating distance from ${oldDist} to ${alt}.`);
          await speak(`Found shorter path to ${v}. Updating distance from ${oldDist} to ${alt}.`);
          await sleep(getDelay());

          // Revert neighbor node to default
          currentNodes = currentNodes.map(n => n.id === v ? { ...n, state: 'default' } : n);
          setNodes(currentNodes);
        } else {
          setMessage(`Path to ${v} is not shorter. Skipping.`);
          await sleep(getDelay() / 2);
        }

        // Unhighlight edge
        currentEdges = currentEdges.map(e => (e.source === edge.source && e.target === edge.target) ? { ...e, state: 'default' } : e);
        setEdges(currentEdges);
      }

      if (!animatingRef.current) return;

      // STEP 5: Mark as visited
      vis[u] = true;
      setVisited({ ...vis });
      setStats(s => ({ ...s, visitedCount: Object.keys(vis).filter(k => vis[k]).length }));

      currentNodes = currentNodes.map(n => n.id === u ? { ...n, state: 'visited' } : n);
      setNodes(currentNodes);

      setMessage(`Node ${u} marked as visited.`);
      await speak(`Node ${u} marked as visited.`);
      await sleep(getDelay() / 1.5);
    }

    if (!animatingRef.current) return;

    setMessage(`Dijkstra algorithm complete. Highlighting shortest paths.`);
    await sleep(getDelay() / 2);

    // FINAL STEP: Highlight final path
    currentNodes = currentNodes.map(n => vis[n.id] ? { ...n, state: 'path' } : n);
    setNodes(currentNodes);

    // Highlight edges that form the shortest path tree
    Object.keys(prev).forEach(v => {
      if (prev[v]) {
        const u = prev[v];
        currentEdges = currentEdges.map(e =>
          ((e.source === u && e.target === v) || (e.source === v && e.target === u))
            ? { ...e, state: 'path' }
            : e
        );
      }
    });
    setEdges(currentEdges);

    setMessage(`Shortest paths calculated successfully.`);
    await speak(`Shortest paths calculated successfully.`);

    setIsAnimating(false);
    animatingRef.current = false;
    setIsComplete(true);
  };

  const getNodeStyle = (state) => {
    const baseStyle = {
      width: '70px',
      height: '70px',
      transition: 'all 0.3s ease-in-out',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
    };

    switch (state) {
      case 'source':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          boxShadow: '0 0 25px rgba(59, 130, 246, 0.8)',
          zIndex: 5,
        };
      case 'current':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          boxShadow: '0 0 35px rgba(245, 158, 11, 1)',
          transform: 'translate(-50%, -50%) scale(1.15)',
          zIndex: 10,
        };
      case 'visited':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #10B981, #047857)',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
          zIndex: 2,
        };
      case 'flash-blue':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          boxShadow: '0 0 35px rgba(59, 130, 246, 1)',
          transform: 'translate(-50%, -50%) scale(1.1)',
          zIndex: 8,
        };
      case 'path':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #22C55E, #16A34A)',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.9)',
          border: '2px solid rgba(255,255,255,0.6)',
          transform: 'translate(-50%, -50%) scale(1.05)',
          zIndex: 6,
        };
      case 'default':
      default:
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
          zIndex: 1,
        };
    }
  };

  const getEdgeStyleProps = (state) => {
    switch (state) {
      case 'relaxing':
        return { stroke: '#F59E0B', width: '6', dash: '8,8', filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.8))' };
      case 'flash-blue':
        return { stroke: '#3B82F6', width: '6', dash: '0', filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.9))' };
      case 'path':
        return { stroke: '#22C55E', width: '6', dash: '0', filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.8))' };
      case 'default':
      default:
        return { stroke: '#4B5563', width: '3', dash: '0', filter: 'none' };
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1400px] mx-auto items-start pb-20">

        {/* LEFT SIDE (65% width) */}
        <div className="w-full lg:w-[65%] flex flex-col gap-6">

          {/* SECTION 1: VISUALIZATION */}
          <div className="bg-[#111111] rounded-2xl border border-gray-800 relative overflow-x-auto overflow-y-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            <div className="min-w-[800px] w-full h-[650px] relative mx-auto bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#111111] to-[#0a0a0a]">
              {/* Draw Edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {edges.map((edge, idx) => {
                  const srcNode = nodes.find(n => n.id === edge.source);
                  const tgtNode = nodes.find(n => n.id === edge.target);
                  if (!srcNode || !tgtNode) return null;

                  const midX = (srcNode.x + tgtNode.x) / 2;
                  const midY = (srcNode.y + tgtNode.y) / 2;

                  const edgeProps = getEdgeStyleProps(edge.state);
                  const isRelaxing = edge.state === 'relaxing';

                  return (
                    <g key={`${edge.source}-${edge.target}-${idx}`}>
                      <line
                        x1={srcNode.x} y1={srcNode.y}
                        x2={tgtNode.x} y2={tgtNode.y}
                        stroke={edgeProps.stroke}
                        strokeWidth={edgeProps.width}
                        strokeDasharray={edgeProps.dash}
                        style={{ filter: edgeProps.filter }}
                        className={`transition-all duration-300 ${isRelaxing ? 'animate-[pulse_1s_ease-in-out_infinite]' : ''}`}
                      />

                      {/* Edge Weight Pill */}
                      <rect
                        x={midX - 16} y={midY - 14}
                        width="32" height="28"
                        rx="8"
                        fill={isRelaxing ? "#F59E0B" : edge.state === 'path' ? '#22C55E' : edge.state === 'flash-blue' ? '#3B82F6' : "#1f2937"}
                        className="transition-colors duration-300 shadow-lg"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
                      />
                      <text
                        x={midX} y={midY + 1}
                        fill={edge.state !== 'default' ? "#000" : "#fff"}
                        fontSize="14"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="transition-colors duration-300 pointer-events-none"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Draw Nodes */}
              {nodes.map(node => (
                <div
                  key={node.id}
                  className={`${node.state === 'current' ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`}
                  style={{
                    ...getNodeStyle(node.state),
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                  }}
                >
                  {node.id}
                </div>
              ))}
            </div>

            {/* LEGEND */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 flex flex-wrap gap-4 text-xs font-semibold text-gray-300 max-w-[90%]">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_5px_#3B82F6]"></div> Source</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_5px_#F59E0B] animate-pulse"></div> Current</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_5px_#10B981]"></div> Visited</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_5px_#8B5CF6]"></div> Unvisited</div>
              <div className="flex items-center gap-2"><div className="w-6 h-1 bg-orange-500 shadow-[0_0_5px_#F59E0B]"></div> Relaxing Edge</div>
              <div className="flex items-center gap-2"><div className="w-6 h-1 bg-green-500 shadow-[0_0_5px_#22C55E]"></div> Shortest Path</div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <label className="text-gray-300 font-medium whitespace-nowrap">Source Node:</label>
                <select
                  value={sourceNode}
                  onChange={(e) => {
                    setSourceNode(e.target.value);
                    resetGraph();
                  }}
                  disabled={isAnimating}
                  className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-[#3f7dd4] transition-colors"
                >
                  {INITIAL_NODES.map(n => (
                    <option key={n.id} value={n.id}>{n.id}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={handleStart}
                  disabled={isAnimating}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                >
                  Start Dijkstra
                </button>
                <button
                  onClick={resetGraph}
                  disabled={isAnimating}
                  className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 bg-[#0f0f0f] px-4 py-2 rounded-lg border border-gray-800 flex-1">
                <label className="text-gray-300 font-medium">Speed: {speed}</label>
                <input
                  type="range" min="1" max="5" value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                  className="accent-[#3f7dd4] cursor-pointer w-full"
                />
              </div>
            </div>
          </div>

          {/* DISTANCE TABLE */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 overflow-x-auto">
            <h3 className="text-gray-400 font-bold mb-4 uppercase text-sm tracking-wider">Distance Table</h3>
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr>
                  <th className="border-b border-gray-700 p-3 text-gray-300">Node</th>
                  <th className="border-b border-gray-700 p-3 text-gray-300">Shortest Distance</th>
                  <th className="border-b border-gray-700 p-3 text-gray-300">Previous Node</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_NODES.map(node => {
                  const dist = distances[node.id];
                  const prev = previous[node.id];
                  const isVis = visited[node.id];

                  let distDisplay = "-";
                  if (dist !== undefined) {
                    distDisplay = dist === Infinity ? "∞" : dist;
                  }

                  return (
                    <tr key={node.id} className={`${isVis ? 'bg-green-900/10' : ''} transition-colors`}>
                      <td className="border-b border-gray-800 p-3">
                        <span className={`font-bold ${isVis ? 'text-green-400' : 'text-white'}`}>
                          {node.id} {node.id === sourceNode && '(Source)'}
                        </span>
                      </td>
                      <td className="border-b border-gray-800 p-3 font-mono text-lg text-purple-400">
                        {distDisplay}
                      </td>
                      <td className="border-b border-gray-800 p-3 font-mono text-gray-400">
                        {prev || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT SIDE (35% width) */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6 sticky top-[20px]">
          {/* EXPLANATION & VOICE */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <h3 className="text-purple-400 font-bold flex items-center gap-2 text-lg">✨ AI Explanation</h3>
              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${isVoiceEnabled ? 'bg-purple-600/20 text-purple-400 border-purple-500/50 hover:bg-purple-600/30' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                  }`}
              >
                {isVoiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
              </button>
            </div>
            <div className="bg-[#0f0f0f] rounded-lg border border-gray-800 p-6 min-h-[140px] flex items-center justify-center shadow-inner">
              <p className="text-white text-xl transition-all text-center leading-relaxed font-medium">
                {message}
              </p>
            </div>
          </div>

          {/* LIVE STATS */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-4">
            <h3 className="text-gray-400 font-bold mb-2 uppercase text-sm tracking-wider">Live Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f0f0f] p-3 rounded-lg border border-gray-800 flex flex-col">
                <span className="text-gray-500 text-xs">Current Node</span>
                <span className="text-orange-400 font-mono font-bold text-xl">{stats.currentNode}</span>
              </div>
              <div className="bg-[#0f0f0f] p-3 rounded-lg border border-gray-800 flex flex-col">
                <span className="text-gray-500 text-xs">Visited Nodes</span>
                <span className="text-green-400 font-mono font-bold text-xl">{stats.visitedCount} / {INITIAL_NODES.length}</span>
              </div>
              <div className="bg-[#0f0f0f] p-3 rounded-lg border border-gray-800 flex flex-col col-span-2 items-center">
                <span className="text-gray-500 text-xs">Total Edges Processed</span>
                <span className="text-purple-400 font-mono font-bold text-2xl">{stats.edgesProcessed}</span>
              </div>
            </div>
          </div>

          {/* COMPLEXITY INFO */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-4">
            <h3 className="text-gray-400 font-bold mb-2 uppercase text-sm tracking-wider">Algorithm Info</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
                <span className="text-gray-400 text-sm">Time Complexity</span>
                <span className="text-red-400 font-mono font-bold text-sm">O((V + E) log V)</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
                <span className="text-gray-400 text-sm">Space Complexity</span>
                <span className="text-purple-400 font-mono font-bold text-sm">O(V)</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
                <span className="text-gray-400 text-sm">Algorithm Type</span>
                <span className="text-blue-400 font-mono font-bold text-sm">Greedy</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
                <span className="text-gray-400 text-sm">Best Use Case</span>
                <span className="text-green-400 font-mono font-bold text-sm">Shortest Path Finding</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {isComplete && (
        <div className="max-w-[1400px] mx-auto px-6 pb-6">
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] flex justify-center items-center gap-2 text-lg"
          >
            🎯 Take Quiz
          </button>
        </div>
      )}

      {showQuiz && (
        <QuizMode
          algorithmName="Dijkstra"
          quizData={quizData["Dijkstra"]}
          onClose={() => setShowQuiz(false)}
        />
      )}
      <AIChat algorithmName="Dijkstra" />
    </>
  );
}
