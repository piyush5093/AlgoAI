import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AIChat from '../components/AIChat';
import QuizMode from '../components/QuizMode';
import { quizData } from '../data/quizData';

const SPEEDS = { 1: 1500, 2: 1000, 3: 600, 4: 300, 5: 100 };

export default function BinarySearchTreeVisualizer() {
  const location = useLocation();
  const [root, setRoot] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [message, setMessage] = useState("🌲 BST is empty! Insert a node to begin.");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [traversalOutput, setTraversalOutput] = useState("");

  const [showQuiz, setShowQuiz] = useState(false);
  const isComplete = !isAnimating && root !== null;

  const animatingRef = useRef(false);
  const speedRef = useRef(3);
  const voiceEnabledRef = useRef(false);
  
  // Keep a mutable ref of root for async functions
  const rootRef = useRef(null);

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

  const cloneTree = (node) => {
    if (!node) return null;
    return {
      ...node,
      left: cloneTree(node.left),
      right: cloneTree(node.right)
    };
  };

  const updateTreeState = (newRoot) => {
    setRoot(newRoot);
    rootRef.current = newRoot;
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

  const resetNodeStates = (node) => {
    if (!node) return null;
    return {
      ...node,
      state: 'default',
      left: resetNodeStates(node.left),
      right: resetNodeStates(node.right)
    };
  };

  const clearTreeStates = () => {
    const cleanTree = resetNodeStates(rootRef.current);
    updateTreeState(cleanTree);
    return cleanTree;
  };

  // Find node by id in the cloned tree to mutate it safely before setting state
  const findAndMutateNode = (node, id, newState) => {
    if (!node) return false;
    if (node.id === id) {
      node.state = newState;
      return true;
    }
    return findAndMutateNode(node.left, id, newState) || findAndMutateNode(node.right, id, newState);
  };

  const setNodeStateAnim = async (currentRoot, id, stateStr, msg, speakMsg = msg) => {
    const newTree = cloneTree(currentRoot);
    findAndMutateNode(newTree, id, stateStr);
    updateTreeState(newTree);
    
    if (msg) setMessage(msg);
    if (speakMsg) await speak(speakMsg);
    await sleep(getDelay());
    return newTree;
  };

  // --- OPERATIONS ---

  const handleInsert = async () => {
    if (!inputValue.trim()) { setError("Please enter a value."); return; }
    const val = parseInt(inputValue.trim(), 10);
    if (isNaN(val)) { setError("Must be a number."); return; }
    if (val > 999 || val < -999) { setError("Value between -999 and 999."); return; }

    setError("");
    setInputValue("");
    if (isAnimating) return;
    
    setIsAnimating(true);
    animatingRef.current = true;
    setTraversalOutput("");

    let currentRoot = clearTreeStates();

    setMessage(`Starting insertion of value ${val}...`);
    await speak(`Starting insertion of value ${val}...`);
    await sleep(getDelay());

    if (!currentRoot) {
      const newNode = { id: Math.random(), value: val, left: null, right: null, state: 'inserted' };
      updateTreeState(newNode);
      setMessage(`Tree is empty. Inserting ${val} as the root node.`);
      await speak(`Tree is empty. Inserting ${val} as the root node.`);
      await sleep(getDelay());
      
      newNode.state = 'default';
      updateTreeState({ ...newNode });
      setIsAnimating(false);
      animatingRef.current = false;
      return;
    }

    let curr = currentRoot;
    let prev = null;
    let isLeft = false;

    while (curr) {
      if (!animatingRef.current) return;
      currentRoot = await setNodeStateAnim(currentRoot, curr.id, 'checking', `Comparing ${val} with ${curr.value}...`);

      if (val === curr.value) {
        currentRoot = await setNodeStateAnim(currentRoot, curr.id, 'deleted', `Value ${val} already exists in the BST!`);
        currentRoot = clearTreeStates();
        setIsAnimating(false);
        animatingRef.current = false;
        return;
      }

      prev = curr;
      if (val < curr.value) {
        setMessage(`${val} is less than ${curr.value}. Moving left.`);
        await speak(`${val} is less than ${curr.value}. Moving left.`);
        await sleep(getDelay());
        
        currentRoot = await setNodeStateAnim(currentRoot, curr.id, 'default', null, null);
        curr = curr.left;
        isLeft = true;
      } else {
        setMessage(`${val} is greater than ${curr.value}. Moving right.`);
        await speak(`${val} is greater than ${curr.value}. Moving right.`);
        await sleep(getDelay());
        
        currentRoot = await setNodeStateAnim(currentRoot, curr.id, 'default', null, null);
        curr = curr.right;
        isLeft = false;
      }
    }

    if (!animatingRef.current) return;
    
    setMessage(`Found empty spot! Inserting ${val} as ${isLeft ? 'left' : 'right'} child of ${prev.value}.`);
    await speak(`Found empty spot! Inserting ${val} as ${isLeft ? 'left' : 'right'} child of ${prev.value}.`);
    
    const newNode = { id: Math.random(), value: val, left: null, right: null, state: 'inserted' };
    
    const finalTree = cloneTree(currentRoot);
    const parentNode = findNodeObj(finalTree, prev.id);
    if (isLeft) parentNode.left = newNode;
    else parentNode.right = newNode;
    
    updateTreeState(finalTree);
    await sleep(getDelay());

    setMessage(`Insertion complete.`);
    await speak(`Insertion complete.`);
    
    clearTreeStates();
    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleSearch = async () => {
    if (!inputValue.trim()) { setError("Please enter a value to search."); return; }
    const val = parseInt(inputValue.trim(), 10);
    if (isNaN(val)) { setError("Must be a number."); return; }

    setError("");
    setInputValue("");
    if (isAnimating) return;
    if (!rootRef.current) {
      setMessage("Tree is empty!");
      return;
    }

    setIsAnimating(true);
    animatingRef.current = true;
    setTraversalOutput("");

    let currentRoot = clearTreeStates();

    setMessage(`Searching for value ${val}...`);
    await speak(`Searching for value ${val}...`);
    await sleep(getDelay());

    let curr = currentRoot;
    
    while (curr) {
      if (!animatingRef.current) return;
      currentRoot = await setNodeStateAnim(currentRoot, curr.id, 'checking', `Checking node ${curr.value}...`);

      if (curr.value === val) {
        currentRoot = await setNodeStateAnim(currentRoot, curr.id, 'found', `Value ${val} found successfully!`);
        setIsAnimating(false);
        animatingRef.current = false;
        return;
      }

      if (val < curr.value) {
        setMessage(`${val} is less than ${curr.value}. Moving left.`);
        await speak(`${val} is less than ${curr.value}. Moving left.`);
        await sleep(getDelay());
        curr = curr.left;
      } else {
        setMessage(`${val} is greater than ${curr.value}. Moving right.`);
        await speak(`${val} is greater than ${curr.value}. Moving right.`);
        await sleep(getDelay());
        curr = curr.right;
      }
    }

    if (!animatingRef.current) return;
    setMessage(`Reached empty subtree. Value ${val} does not exist in the tree.`);
    await speak(`Reached empty subtree. Value ${val} does not exist in the tree.`);
    
    clearTreeStates();
    setIsAnimating(false);
    animatingRef.current = false;
  };

  const findNodeObj = (node, id) => {
    if (!node) return null;
    if (node.id === id) return node;
    return findNodeObj(node.left, id) || findNodeObj(node.right, id);
  };

  const handleDelete = async () => {
    if (!inputValue.trim()) { setError("Please enter a value to delete."); return; }
    const val = parseInt(inputValue.trim(), 10);
    if (isNaN(val)) { setError("Must be a number."); return; }

    setError("");
    setInputValue("");
    if (isAnimating) return;
    if (!rootRef.current) {
      setMessage("Tree is empty!");
      return;
    }

    setIsAnimating(true);
    animatingRef.current = true;
    setTraversalOutput("");

    let currentRoot = clearTreeStates();

    setMessage(`Deleting node ${val}...`);
    await speak(`Deleting node ${val}...`);
    await sleep(getDelay());

    let curr = currentRoot;
    let parent = null;
    let isLeft = false;

    // Search for node
    while (curr && curr.value !== val) {
      if (!animatingRef.current) return;
      currentRoot = await setNodeStateAnim(currentRoot, curr.id, 'checking', `Searching for ${val}... checking ${curr.value}`);
      
      parent = curr;
      if (val < curr.value) {
        currentRoot = await setNodeStateAnim(currentRoot, curr.id, 'default', null, null);
        curr = curr.left;
        isLeft = true;
      } else {
        currentRoot = await setNodeStateAnim(currentRoot, curr.id, 'default', null, null);
        curr = curr.right;
        isLeft = false;
      }
    }

    if (!curr) {
      setMessage(`Node ${val} not found! Cannot delete.`);
      await speak(`Node ${val} not found! Cannot delete.`);
      clearTreeStates();
      setIsAnimating(false);
      animatingRef.current = false;
      return;
    }

    // Found node to delete
    currentRoot = await setNodeStateAnim(currentRoot, curr.id, 'deleted', `Found node ${val} to delete!`);

    // Case 1: Leaf Node
    if (!curr.left && !curr.right) {
      setMessage(`Node ${val} is a leaf node. Removing node directly.`);
      await speak(`Node ${val} is a leaf node. Removing node directly.`);
      await sleep(getDelay());

      let finalTree = cloneTree(currentRoot);
      if (!parent) {
        finalTree = null;
      } else {
        const pNode = findNodeObj(finalTree, parent.id);
        if (isLeft) pNode.left = null;
        else pNode.right = null;
      }
      updateTreeState(finalTree);
    } 
    // Case 2: One Child
    else if (!curr.left || !curr.right) {
      setMessage(`Node ${val} has one child. Replacing node with its child.`);
      await speak(`Node ${val} has one child. Replacing node with its child.`);
      await sleep(getDelay());

      const child = curr.left ? curr.left : curr.right;
      let finalTree = cloneTree(currentRoot);
      
      if (!parent) {
        finalTree = child;
      } else {
        const pNode = findNodeObj(finalTree, parent.id);
        if (isLeft) pNode.left = child;
        else pNode.right = child;
      }
      updateTreeState(finalTree);
    } 
    // Case 3: Two Children
    else {
      setMessage(`Node has two children. Finding inorder successor...`);
      await speak(`Node has two children. Finding inorder successor...`);
      await sleep(getDelay());

      let successorParent = curr;
      let successor = curr.right;
      
      if (successor.left) {
        while (successor.left) {
          currentRoot = await setNodeStateAnim(currentRoot, successor.id, 'checking', `Traversing left to find minimum...`);
          currentRoot = await setNodeStateAnim(currentRoot, successor.id, 'default', null, null);
          successorParent = successor;
          successor = successor.left;
        }
      }
      
      currentRoot = await setNodeStateAnim(currentRoot, successor.id, 'found', `Inorder successor is ${successor.value}.`);
      await sleep(getDelay());

      setMessage(`Replacing node ${val} with ${successor.value}.`);
      await speak(`Replacing node ${val} with ${successor.value}.`);
      await sleep(getDelay());

      let finalTree = cloneTree(currentRoot);
      const targetNode = findNodeObj(finalTree, curr.id);
      targetNode.value = successor.value;
      
      const spNode = findNodeObj(finalTree, successorParent.id);
      if (spNode.left && spNode.left.id === successor.id) {
        spNode.left = successor.right;
      } else {
        spNode.right = successor.right;
      }

      updateTreeState(finalTree);
    }

    setMessage(`Deletion complete.`);
    await speak(`Deletion complete.`);
    clearTreeStates();
    
    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleTraversal = async (type) => {
    if (isAnimating) return;
    if (!rootRef.current) {
      setMessage("Tree is empty!");
      return;
    }

    setIsAnimating(true);
    animatingRef.current = true;
    setTraversalOutput("");
    
    let currentRoot = clearTreeStates();
    let result = [];
    
    setMessage(`Starting ${type} Traversal...`);
    await speak(`Starting ${type} Traversal...`);
    await sleep(getDelay());

    const visit = async (node) => {
      if (!node || !animatingRef.current) return;
      
      currentRoot = await setNodeStateAnim(currentRoot, node.id, 'checking', `Moving to node ${node.value}...`, null);
      
      if (type === 'Preorder') {
        currentRoot = await setNodeStateAnim(currentRoot, node.id, 'visited', `Visiting node ${node.value}.`);
        result.push(node.value);
        setTraversalOutput(result.join(" → "));
      }
      
      if (node.left) {
        setMessage(`Moving to left subtree of ${node.value}.`);
        await speak(`Moving to left subtree of ${node.value}.`);
        await sleep(getDelay() / 2);
        await visit(node.left);
        if (!animatingRef.current) return;
        setMessage(`Returning to parent node ${node.value}.`);
        await speak(`Returning to parent node ${node.value}.`);
        await sleep(getDelay() / 2);
      } else {
        setMessage(`Left child of ${node.value} is empty.`);
        await speak(`Left child is empty.`);
        await sleep(getDelay() / 2);
      }
      
      if (type === 'Inorder') {
        currentRoot = await setNodeStateAnim(currentRoot, node.id, 'visited', `Visiting node ${node.value}.`);
        result.push(node.value);
        setTraversalOutput(result.join(" → "));
      }
      
      if (node.right) {
        setMessage(`Moving to right subtree of ${node.value}.`);
        await speak(`Moving to right subtree of ${node.value}.`);
        await sleep(getDelay() / 2);
        await visit(node.right);
        if (!animatingRef.current) return;
        setMessage(`Returning to parent node ${node.value}.`);
        await speak(`Returning to parent node ${node.value}.`);
        await sleep(getDelay() / 2);
      } else {
        setMessage(`Right child of ${node.value} is empty.`);
        await speak(`Right child is empty.`);
        await sleep(getDelay() / 2);
      }
      
      if (type === 'Postorder') {
        currentRoot = await setNodeStateAnim(currentRoot, node.id, 'visited', `Visiting node ${node.value}.`);
        result.push(node.value);
        setTraversalOutput(result.join(" → "));
      }
    };

    const levelOrder = async () => {
      let queue = [rootRef.current];
      while (queue.length > 0 && animatingRef.current) {
        const node = queue.shift();
        currentRoot = await setNodeStateAnim(currentRoot, node.id, 'visited', `Visiting node ${node.value}.`);
        result.push(node.value);
        setTraversalOutput(result.join(" → "));
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
    };

    if (type === 'Level Order') {
      await levelOrder();
    } else {
      await visit(rootRef.current);
    }

    if (!animatingRef.current) return;
    
    setMessage(`Traversal complete. Output: ${result.join(" → ")}`);
    await speak(`Traversal complete.`);
    
    setIsAnimating(false);
    animatingRef.current = false;
  };

  const handleClear = () => {
    if (isAnimating) return;
    updateTreeState(null);
    setMessage("🌲 BST is empty! Insert a node to begin.");
    setError("");
    setInputValue("");
    setTraversalOutput("");
  };

  const handleRandomTree = async () => {
    if (isAnimating) return;
    handleClear();
    
    // Quick insertion logic without animations to build the tree instantly
    const vals = [];
    while (vals.length < 8) {
      const r = Math.floor(Math.random() * 90) + 10;
      if (!vals.includes(r)) vals.push(r);
    }
    
    let newRoot = null;
    const insertRaw = (node, val) => {
      if (!node) return { id: Math.random(), value: val, left: null, right: null, state: 'default' };
      if (val < node.value) node.left = insertRaw(node.left, val);
      else if (val > node.value) node.right = insertRaw(node.right, val);
      return node;
    };
    
    for (let v of vals) {
      newRoot = insertRaw(newRoot, v);
    }
    
    updateTreeState(newRoot);
    setMessage(`Generated random tree with 8 nodes!`);
    await speak(`Generated random tree.`);
  };

  // --- STATS & LAYOUT ---
  const getStats = (node) => {
    if (!node) return { count: 0, height: 0, leaves: 0, min: '-', max: '-' };
    const leftStats = getStats(node.left);
    const rightStats = getStats(node.right);
    
    let min = node.value;
    if (node.left) {
      let curr = node.left;
      while (curr.left) curr = curr.left;
      min = curr.value;
    }
    let max = node.value;
    if (node.right) {
      let curr = node.right;
      while (curr.right) curr = curr.right;
      max = curr.value;
    }

    return {
      count: 1 + leftStats.count + rightStats.count,
      height: 1 + Math.max(leftStats.height, rightStats.height),
      leaves: (!node.left && !node.right) ? 1 : leftStats.leaves + rightStats.leaves,
      min,
      max
    };
  };

  const stats = getStats(root);

  const getTreeLayout = (node) => {
    if (!node) return { nodes: [], edges: [], maxDepth: 0 };
    
    const nodes = [];
    const edges = [];
    let maxDepth = 0;
    
    const traverse = (n, x, y, dx, depth) => {
      if (!n) return;
      maxDepth = Math.max(maxDepth, depth);
      
      nodes.push({ ...n, x, y });
      
      const verticalGap = 70;
      
      if (n.left) {
        edges.push({ id: `e-l-${n.id}`, x1: x, y1: y, x2: x - dx, y2: y + verticalGap, state: n.left.state });
        traverse(n.left, x - dx, y + verticalGap, dx / 1.8, depth + 1);
      }
      if (n.right) {
        edges.push({ id: `e-r-${n.id}`, x1: x, y1: y, x2: x + dx, y2: y + verticalGap, state: n.right.state });
        traverse(n.right, x + dx, y + verticalGap, dx / 1.8, depth + 1);
      }
    };
    
    traverse(node, 50, 40, 25, 1);
    return { nodes, edges, maxDepth };
  };

  const layout = getTreeLayout(root);
  const containerHeight = Math.max(400, layout.maxDepth * 70 + 80);

  const getColor = (state) => {
    switch (state) {
      case 'checking': return '#F59E0B'; // orange
      case 'inserted':
      case 'found': return '#10B981'; // green
      case 'deleted': return '#EF4444'; // red
      case 'visited': return '#3B82F6'; // blue
      case 'default':
      default: return '#7C3AED'; // purple
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1400px] mx-auto items-start pb-20">
      
      {/* LEFT SIDE (65% width) */}
      <div className="w-full lg:w-[65%] flex flex-col gap-6 min-w-0">
        
        {/* SECTION 1: VISUALIZATION */}
        <div 
          className="bg-[#1a1a1a] rounded-xl border border-gray-800 relative overflow-x-auto overflow-y-hidden"
          style={{ minHeight: `${containerHeight}px` }}
        >
          <div className="min-w-[300px] sm:min-w-[600px] w-full h-full relative" style={{ height: `${containerHeight}px` }}>
            {/* Draw Edges */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {layout.edges.map(edge => (
                <line 
                  key={edge.id}
                  x1={`${edge.x1}%`} y1={edge.y1}
                  x2={`${edge.x2}%`} y2={edge.y2}
                  stroke={edge.state === 'checking' || edge.state === 'visited' ? getColor(edge.state) : '#374151'}
                  strokeWidth={edge.state === 'checking' || edge.state === 'visited' ? "4" : "2"}
                  className="transition-all duration-300"
                />
              ))}
            </svg>

            {/* Draw Nodes */}
            {layout.nodes.map(node => (
              <div 
                key={node.id}
                className="absolute flex items-center justify-center rounded-full font-bold text-white shadow-lg transition-all duration-300 ease-in-out border-2 border-white/20"
                style={{
                  left: `calc(${node.x}% - 24px)`, // 24px is half of 48px width
                  top: `${node.y - 24}px`,
                  width: '48px',
                  height: '48px',
                  backgroundColor: getColor(node.state),
                  transform: node.state === 'inserted' ? 'scale(1.2)' : node.state === 'deleted' ? 'scale(0.8) opacity(0.5)' : 'scale(1)',
                  zIndex: node.state === 'checking' ? 10 : 1,
                  boxShadow: node.state !== 'default' ? `0 0 15px ${getColor(node.state)}` : 'none'
                }}
              >
                {node.value}
              </div>
            ))}

            {layout.nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 opacity-50">
                <span className="text-6xl mb-4">🌲</span>
                <span className="text-xl font-bold">Empty Tree</span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: CONTROLS */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 w-full sm:w-auto min-w-[150px]">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                placeholder="Enter value..."
                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-[#3f7dd4] transition-colors"
                disabled={isAnimating}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleInsert}
                disabled={isAnimating}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-3 rounded-lg font-bold transition-colors"
              >
                Insert
              </button>
              <button
                onClick={handleSearch}
                disabled={isAnimating || !root}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-lg font-bold transition-colors"
              >
                Search
              </button>
              <button
                onClick={handleDelete}
                disabled={isAnimating || !root}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-3 rounded-lg font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-gray-800 pt-4">
            <button onClick={() => handleTraversal('Inorder')} disabled={isAnimating || !root} className="bg-[#0f0f0f] border border-gray-700 hover:border-purple-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-semibold transition-all">Inorder</button>
            <button onClick={() => handleTraversal('Preorder')} disabled={isAnimating || !root} className="bg-[#0f0f0f] border border-gray-700 hover:border-purple-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-semibold transition-all">Preorder</button>
            <button onClick={() => handleTraversal('Postorder')} disabled={isAnimating || !root} className="bg-[#0f0f0f] border border-gray-700 hover:border-purple-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-semibold transition-all">Postorder</button>
            <button onClick={() => handleTraversal('Level Order')} disabled={isAnimating || !root} className="bg-[#0f0f0f] border border-gray-700 hover:border-purple-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-semibold transition-all">Level Order</button>
          </div>

          <div className="flex justify-between items-center border-t border-gray-800 pt-4 gap-4">
            <div className="flex items-center gap-3 bg-[#0f0f0f] px-4 py-2 rounded-lg border border-gray-800 flex-1">
              <label className="text-gray-300 font-medium">Speed: {speed}</label>
              <input
                type="range" min="1" max="5" value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                className="accent-[#3f7dd4] cursor-pointer w-full"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleRandomTree} disabled={isAnimating} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">Random Tree</button>
              <button onClick={handleClear} disabled={isAnimating} className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">Clear</button>
            </div>
          </div>
          
          {traversalOutput && (
            <div className="bg-[#0f0f0f] p-4 rounded-lg border border-blue-900/50 mt-2">
              <h4 className="text-blue-400 text-sm font-bold mb-1">Traversal Output:</h4>
              <p className="text-white font-mono text-lg break-all">{traversalOutput}</p>
            </div>
          )}
          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${
                isVoiceEnabled ? 'bg-purple-600/20 text-purple-400 border-purple-500/50 hover:bg-purple-600/30' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
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

        {/* TREE STATISTICS */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-4">
          <h3 className="text-gray-400 font-bold mb-2 uppercase text-sm tracking-wider">Tree Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0f0f0f] p-3 rounded-lg border border-gray-800 flex flex-col">
              <span className="text-gray-500 text-xs">Total Nodes</span>
              <span className="text-white font-mono font-bold text-lg">{stats.count}</span>
            </div>
            <div className="bg-[#0f0f0f] p-3 rounded-lg border border-gray-800 flex flex-col">
              <span className="text-gray-500 text-xs">Tree Height</span>
              <span className="text-white font-mono font-bold text-lg">{stats.height}</span>
            </div>
            <div className="bg-[#0f0f0f] p-3 rounded-lg border border-gray-800 flex flex-col">
              <span className="text-gray-500 text-xs">Leaf Nodes</span>
              <span className="text-white font-mono font-bold text-lg">{stats.leaves}</span>
            </div>
            <div className="bg-[#0f0f0f] p-3 rounded-lg border border-gray-800 flex flex-col">
              <span className="text-gray-500 text-xs">Root Value</span>
              <span className="text-purple-400 font-mono font-bold text-lg">{root ? root.value : '-'}</span>
            </div>
            <div className="bg-[#0f0f0f] p-3 rounded-lg border border-gray-800 flex flex-col">
              <span className="text-gray-500 text-xs">Min Value</span>
              <span className="text-green-400 font-mono font-bold text-lg">{stats.min}</span>
            </div>
            <div className="bg-[#0f0f0f] p-3 rounded-lg border border-gray-800 flex flex-col">
              <span className="text-gray-500 text-xs">Max Value</span>
              <span className="text-red-400 font-mono font-bold text-lg">{stats.max}</span>
            </div>
          </div>
        </div>

        {/* COMPLEXITY INFO */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col gap-4">
          <h3 className="text-gray-400 font-bold mb-2 uppercase text-sm tracking-wider">Complexity</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 text-sm">Search / Insert / Delete</span>
              <span className="text-green-400 font-mono font-bold text-sm">Avg: O(log n)</span>
            </div>
            <div className="flex justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 text-sm">Worst Case (Skewed)</span>
              <span className="text-red-400 font-mono font-bold text-sm">O(n)</span>
            </div>
            <div className="flex justify-between p-2.5 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <span className="text-gray-400 text-sm">Traversals</span>
              <span className="text-blue-400 font-mono font-bold text-sm">O(n)</span>
            </div>
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
      </div>

    </div>
    
    {showQuiz && (
      <QuizMode
        algorithmName="Binary Search Tree"
        quizData={quizData["Binary Search Tree"]}
        onClose={() => setShowQuiz(false)}
      />
    )}
    <AIChat algorithmName="Binary Search Tree" />
    </>
  );
}
