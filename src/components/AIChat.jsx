import React, { useState, useRef, useEffect } from 'react';

const QUESTIONS = {
  "Bubble Sort": [
    "Why is Bubble Sort O(n²)?",
    "When would I use Bubble Sort?",
    "How to explain it in interview?"
  ],
  "Selection Sort": [
    "Why is Selection Sort O(n²)?",
    "Selection Sort vs Bubble Sort?",
    "Is Selection Sort stable?"
  ],
  "Insertion Sort": [
    "Why is Insertion Sort fast for small arrays?",
    "When should I use Insertion Sort?",
    "How does Insertion Sort work in real life?"
  ],
  "Merge Sort": [
    "Why does Merge Sort use O(n) space?",
    "Merge Sort vs Quick Sort?",
    "When to use Merge Sort?"
  ],
  "Quick Sort": [
    "Why is Quick Sort O(n log n) average?",
    "What is the worst case of Quick Sort?",
    "How to choose a good pivot?"
  ],
  "Linear Search": [
    "When should I use Linear Search?",
    "Linear Search vs Binary Search?",
    "What is the worst case of Linear Search?"
  ],
  "Binary Search": [
    "Why must array be sorted for Binary Search?",
    "How is Binary Search O(log n)?",
    "Binary Search real life examples?"
  ],
  "Stack": [
    "Real world uses of Stack?",
    "Stack vs Queue difference?",
    "How is Stack used in recursion?"
  ],
  "Queue": [
    "Real world uses of Queue?",
    "Queue vs Stack difference?",
    "Types of Queue in DSA?"
  ],
  "Linked List": [
    "Array vs Linked List difference?",
    "When to use Linked List over Array?",
    "Types of Linked List?"
  ]
};

const askAI = async (userMessage, algorithmName) => {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are an expert DSA teacher 
            helping a college student understand 
            ${algorithmName}.
            Keep answers short (max 4-5 lines).
            Use simple English a beginner understands.
            Use real life examples when explaining.
            Add relevant emojis to make it engaging.
            If asked about time complexity explain why.
            If asked for interview tips give practical 
            advice that helps in placements.`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 300
      })
    }
  );
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to fetch from Groq API");
  }
  return data.choices[0].message.content;
};

export default function AIChat({ algorithmName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi! I am your AlgoAI Assistant!\nI can help you understand this algorithm.\nTry asking me anything about it!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const smartQuestions = QUESTIONS[algorithmName] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { sender: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const answer = await askAI(userMsg.text, algorithmName);
      setMessages(prev => [...prev, { sender: "ai", text: answer }]);
    } catch (error) {
      console.error("Groq API Error:", error);
      setMessages(prev => [...prev, { 
        sender: "ai", 
        text: "Oops! Could not connect to AI. Please check your API key in .env file." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend(inputValue);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.7) }
            70% { box-shadow: 0 0 0 10px rgba(124,58,237,0) }
            100% { box-shadow: 0 0 0 0 rgba(124,58,237,0) }
          }
          .animate-pulse-ring {
            animation: pulse-ring 2s infinite;
          }
          .typing-dot {
            animation: typing 1.4s infinite ease-in-out both;
          }
          .typing-dot:nth-child(1) { animation-delay: -0.32s; }
          .typing-dot:nth-child(2) { animation-delay: -0.16s; }
          @keyframes typing {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}
      </style>

      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-full flex items-center justify-center text-2xl shadow-lg transition-colors animate-pulse-ring z-50"
        >
          💬
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[450px] bg-[#1a1a2e] border border-[#7C3AED] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          
          {/* Header */}
          <div className="bg-[#7C3AED] p-4 flex justify-between items-center text-white">
            <div className="font-bold flex items-center gap-2">
              <span className="text-xl">🤖</span> AlgoAI Assistant
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 text-xl font-bold leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#1a1a2e]">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                  msg.sender === "user" 
                    ? "bg-[#7C3AED] text-white self-end rounded-tr-sm" 
                    : "bg-[#2d2d2d] text-white self-start rounded-tl-sm border border-gray-700"
                }`}
              >
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div className="bg-[#2d2d2d] text-white self-start rounded-2xl rounded-tl-sm border border-gray-700 p-3 max-w-[85%] flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {smartQuestions.length > 0 && messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-col gap-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Suggested Questions</p>
              <div className="flex flex-wrap gap-2">
                {smartQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-xs bg-transparent border border-[#7C3AED] text-[#a78bfa] hover:bg-[#7C3AED] hover:text-white px-3 py-1.5 rounded-full transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-[#1a1a2e] border-t border-gray-800 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 bg-[#2d2d2d] text-white text-sm rounded-full px-4 py-2 outline-none border border-gray-700 focus:border-[#7C3AED] transition-colors"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors flex-shrink-0"
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}
