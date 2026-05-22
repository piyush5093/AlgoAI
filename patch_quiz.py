import os
import re

files_info = {
    "src/visualizers/BubbleSortVisualizer.jsx": {
        "algo_name": "Bubble Sort",
        "is_complete": "const isComplete = !isSorting && array.length > 0 && array.every(item => item.state === 'sorted');",
    },
    "src/visualizers/SelectionSortVisualizer.jsx": {
        "algo_name": "Selection Sort",
        "is_complete": "const isComplete = !isSorting && array.length > 0 && array.every(item => item.state === 'sorted');",
    },
    "src/visualizers/InsertionSortVisualizer.jsx": {
        "algo_name": "Insertion Sort",
        "is_complete": "const isComplete = !isSorting && array.length > 0 && array.every(item => item.state === 'sorted');",
    },
    "src/visualizers/MergeSortVisualizer.jsx": {
        "algo_name": "Merge Sort",
        "is_complete": "const isComplete = !isSorting && array.length > 0 && array.every(item => item.state === 'sorted');",
    },
    "src/visualizers/QuickSortVisualizer.jsx": {
        "algo_name": "Quick Sort",
        "is_complete": "const isComplete = !isSorting && array.length > 0 && array.every(item => item.state === 'sorted');",
    },
    "src/visualizers/LinearSearchVisualizer.jsx": {
        "algo_name": "Linear Search",
        "is_complete": "const isComplete = !isSearching && array.length > 0 && array.some(item => item.state === 'found' || item.state === 'eliminated');",
    },
    "src/visualizers/BinarySearchVisualizer.jsx": {
        "algo_name": "Binary Search",
        "is_complete": "const isComplete = !isSearching && array.length > 0 && array.some(item => item.state === 'found' || item.state === 'eliminated');",
    },
    "src/visualizers/StackVisualizer.jsx": {
        "algo_name": "Stack",
        "is_complete": "const isComplete = !isAnimating && stack.length > 0;",
    },
    "src/visualizers/QueueVisualizer.jsx": {
        "algo_name": "Queue",
        "is_complete": "const isComplete = !isAnimating && queue.length > 0;",
    },
    "src/visualizers/LinkedListVisualizer.jsx": {
        "algo_name": "Linked List",
        "is_complete": "const isComplete = !isAnimating && list.length > 0;",
    },
}

for filepath, info in files_info.items():
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "QuizMode" in content:
        print(f"Already patched: {filepath}")
        continue

    # Add imports
    import_index = content.find("export default function")
    if import_index != -1:
        imports = "import QuizMode from '../components/QuizMode';\nimport { quizData } from '../data/quizData';\n\n"
        content = content[:import_index] + imports + content[import_index:]

    # Add states
    match = re.search(r'(export default function [a-zA-Z0-9_]+\(\) \{\s+const location = useLocation\(\);)', content)
    if not match:
        match = re.search(r'(export default function [a-zA-Z0-9_]+\(\) \{)', content)
    
    if match:
        state_str = f"\n  const [showQuiz, setShowQuiz] = useState(false);\n  {info['is_complete']}\n"
        content = content[:match.end()] + state_str + content[match.end():]

    # Add Quiz UI before closing div
    # Find the last closing tags
    # Usually: 
    #       </div>
    #     </div>
    #       <AIChat algorithmName="..." />
    #     </>
    
    quiz_ui = f"""
        {{isComplete && (
          <button
            onClick={{() => setShowQuiz(true)}}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] flex justify-center items-center gap-2 text-lg"
          >
            🎯 Take Quiz
          </button>
        )}}
        {{showQuiz && (
          <QuizMode
            algorithmName="{info['algo_name']}"
            quizData={{quizData["{info['algo_name']}"]}}
            onClose={{() => setShowQuiz(false)}}
          />
        )}}
"""
    
    # We find the <AIChat element and insert right before the two closing divs above it
    aichat_match = re.search(r'(\s*</div>\s*</div>\s*<AIChat)', content)
    if aichat_match:
        # replace the match with quiz_ui + match
        content = content[:aichat_match.start()] + quiz_ui + content[aichat_match.start():]
    else:
        print(f"Could not find AIChat tag in {filepath}")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Patched {filepath}")

print("Done.")
