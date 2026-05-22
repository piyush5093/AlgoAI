import React, { useState } from 'react';

const QuizMode = ({ algorithmName, quizData, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showScore, setShowScore] = useState(false);

  if (!quizData || quizData.length === 0) {
    return null;
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const totalQuestions = quizData.length;

  const handleOptionClick = (index) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowScore(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowScore(false);
  };

  const getScoreMessage = () => {
    if (score === 5) return { stars: "⭐⭐⭐⭐⭐", text: "Placement Ready! 🚀" };
    if (score === 4) return { stars: "⭐⭐⭐⭐", text: "Almost there! 💪" };
    if (score === 3) return { stars: "⭐⭐⭐", text: "Good! Keep practicing! 📚" };
    if (score === 2) return { stars: "⭐⭐", text: "Review the concept again 🔄" };
    if (score === 1) return { stars: "⭐", text: "Watch the animation again! 👀" };
    return { stars: "", text: "Don't give up! Try again! 💡" };
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      <div 
        className="w-full max-w-[600px] bg-[#0f0f0f] border-2 border-purple-500 rounded-2xl p-8 relative shadow-[0_0_30px_rgba(168,85,247,0.2)]"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {showScore ? (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-gray-400 mb-8">{algorithmName} Assessment</p>
            
            <div className="text-6xl font-extrabold text-purple-500 mb-4">
              {score}/{totalQuestions}
            </div>
            
            <div className="text-2xl mb-4">{getScoreMessage().stars}</div>
            <div className="text-xl text-white font-medium mb-10">
              {getScoreMessage().text}
            </div>

            <div className="flex gap-4 w-full sm:w-auto">
              <button 
                onClick={handleRetry}
                className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-gray-700"
              >
                Retry Quiz 🔄
              </button>
              <button 
                onClick={onClose}
                className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Back to Visualizer
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Header & Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-purple-400 font-bold uppercase tracking-wider text-sm">
                  {algorithmName} Quiz
                </h3>
                <span className="text-gray-400 font-medium text-sm">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-[18px] text-white font-bold mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                let buttonStyle = "bg-[#1a1a1a] border-gray-700 text-gray-200 hover:border-purple-500 hover:bg-[#232323]";
                
                if (isAnswered) {
                  if (index === currentQuestion.correct) {
                    buttonStyle = "bg-green-900/40 border-green-500 text-green-400";
                  } else if (index === selectedOption) {
                    buttonStyle = "bg-red-900/40 border-red-500 text-red-400";
                  } else {
                    buttonStyle = "bg-[#1a1a1a] border-gray-800 text-gray-500 opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-black/30 text-sm border border-white/10 shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <div className="bg-[#151515] border-l-4 border-purple-500 p-4 rounded-r-lg mb-6 animate-[fadeIn_0.3s_ease-out]">
                <p className="text-gray-300 italic text-sm leading-relaxed">
                  <span className="font-bold text-white not-italic block mb-1">Explanation:</span>
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 flex justify-center items-center gap-2"
              >
                {currentQuestionIndex + 1 === totalQuestions ? 'See Results' : 'Next Question'} 
                <span>→</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
