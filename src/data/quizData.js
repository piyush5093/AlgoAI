export const quizData = {

  "Bubble Sort": [
    {
      question: "What is the number of swaps required to sort the array [2, 1, 3, 4, 5] using Bubble Sort?",
      options: ["1", "2", "3", "4"],
      correct: 0,
      explanation: "Only one swap is needed: swap 2 and 1 to get [1,2,3,4,5]. Rest of array is already sorted."
    },
    {
      question: "How many passes does Bubble Sort need to sort an array of n elements in worst case?",
      options: ["n", "n-1", "n/2", "n²"],
      correct: 1,
      explanation: "Bubble Sort needs exactly n-1 passes in worst case. After each pass, one element reaches its correct position."
    },
    {
      question: "What is the best case time complexity of Bubble Sort with early termination optimization?",
      options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
      correct: 2,
      explanation: "With early termination (flag to check if any swap happened), if array is already sorted, Bubble Sort makes only one pass giving O(n) best case."
    },
    {
      question: "Is Bubble Sort a stable sorting algorithm?",
      options: [
        "Yes, equal elements maintain relative order",
        "No, equal elements change order",
        "Depends on implementation",
        "Only stable for integers"
      ],
      correct: 0,
      explanation: "Bubble Sort is stable because it only swaps adjacent elements when strictly greater than, so equal elements never swap positions."
    },
    {
      question: "Which of the following is TRUE about Bubble Sort?",
      options: [
        "It uses divide and conquer approach",
        "It requires extra O(n) space",
        "After k passes, k largest elements are in correct position",
        "It is faster than Merge Sort for large arrays"
      ],
      correct: 2,
      explanation: "After each pass of Bubble Sort, the largest unsorted element bubbles to its correct position. So after k passes, k largest elements are correctly placed."
    }
  ],

  "Selection Sort": [
    {
      question: "What is the number of swaps performed by Selection Sort on any array of n elements?",
      options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
      correct: 1,
      explanation: "Selection Sort always performs exactly n-1 swaps regardless of input. It finds minimum and swaps once per pass."
    },
    {
      question: "Which array requires minimum comparisons in Selection Sort?",
      options: [
        "Already sorted array",
        "Reverse sorted array",
        "Random array",
        "Selection Sort always makes same comparisons"
      ],
      correct: 3,
      explanation: "Unlike Bubble Sort, Selection Sort always makes n(n-1)/2 comparisons regardless of input order. It has no best case optimization."
    },
    {
      question: "Is Selection Sort stable?",
      options: [
        "Always stable",
        "Never stable",
        "Not stable in standard implementation",
        "Stable only for small arrays"
      ],
      correct: 2,
      explanation: "Standard Selection Sort is NOT stable. When swapping minimum to front, it can change relative order of equal elements."
    },
    {
      question: "After 3 passes of Selection Sort on [64,25,12,22,11], which elements are in correct position?",
      options: [
        "11, 12, 22",
        "11, 12, 25",
        "64, 25, 12",
        "11, 25, 64"
      ],
      correct: 0,
      explanation: "Selection Sort places minimum element in each pass. Pass 1: 11 placed. Pass 2: 12 placed. Pass 3: 22 placed. So 11, 12, 22 are correctly placed."
    },
    {
      question: "Selection Sort is preferred over Bubble Sort when:",
      options: [
        "Array is already sorted",
        "Memory writes are costly (like Flash memory)",
        "Array is very large",
        "Stability is required"
      ],
      correct: 1,
      explanation: "Selection Sort makes only O(n) swaps while Bubble Sort makes O(n²) swaps. When memory writes are expensive like Flash storage, Selection Sort is preferred."
    }
  ],

  "Insertion Sort": [
    {
      question: "What is the best case time complexity of Insertion Sort?",
      options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
      correct: 2,
      explanation: "When array is already sorted, Insertion Sort makes exactly n-1 comparisons and 0 shifts, giving O(n) best case."
    },
    {
      question: "How many shifts are needed to insert element 2 in [1, 3, 4, 5, 2]?",
      options: ["1", "2", "3", "4"],
      correct: 2,
      explanation: "To insert 2 in correct position, elements 3, 4, 5 each shift one position right. That is 3 shifts total."
    },
    {
      question: "Insertion Sort is most efficient for:",
      options: [
        "Large unsorted arrays",
        "Arrays with more than 1000 elements",
        "Small or nearly sorted arrays",
        "Arrays with all duplicate elements"
      ],
      correct: 2,
      explanation: "Insertion Sort is very efficient for small arrays (n < 20) and nearly sorted arrays. Many libraries use it for small subarrays inside Merge Sort."
    },
    {
      question: "Which real world scenario is similar to Insertion Sort?",
      options: [
        "Finding a name in phone book",
        "Sorting playing cards in hand",
        "Organizing files by size",
        "Searching in a dictionary"
      ],
      correct: 1,
      explanation: "When sorting playing cards, we pick one card at a time and insert it in the correct position among already sorted cards. This is exactly how Insertion Sort works."
    },
    {
      question: "What is the space complexity of Insertion Sort?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      correct: 3,
      explanation: "Insertion Sort sorts in place using only one extra variable (key) regardless of array size, giving O(1) space complexity."
    }
  ],

  "Merge Sort": [
    {
      question: "What is the space complexity of Merge Sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 2,
      explanation: "Merge Sort needs an extra array of size n for merging. The recursion stack takes O(log n) but the temporary array takes O(n), so overall space is O(n)."
    },
    {
      question: "What is the minimum number of comparisons to merge two sorted arrays of size n/2 each?",
      options: ["n-1", "n/2", "n", "n log n"],
      correct: 0,
      explanation: "To merge two sorted arrays of total size n, minimum n-1 comparisons are needed in best case when all elements of one array are smaller than all elements of other."
    },
    {
      question: "Merge Sort is preferred over Quick Sort when:",
      options: [
        "Memory is limited",
        "Stable sorting is required",
        "Array is already sorted",
        "Array has no duplicates"
      ],
      correct: 1,
      explanation: "Merge Sort is a stable sort while Quick Sort is not stable in standard implementation. When stability is required (like sorting objects by multiple keys), Merge Sort is preferred."
    },
    {
      question: "How many levels of recursion does Merge Sort have for array of size 8?",
      options: ["2", "3", "4", "8"],
      correct: 1,
      explanation: "Merge Sort divides array in half each time. For n=8: 8→4→2→1 takes 3 levels (log₂8 = 3)."
    },
    {
      question: "Which of the following is the correct recurrence relation for Merge Sort?",
      options: [
        "T(n) = T(n-1) + O(n)",
        "T(n) = 2T(n/2) + O(n)",
        "T(n) = T(n/2) + O(1)",
        "T(n) = 2T(n-1) + O(1)"
      ],
      correct: 1,
      explanation: "Merge Sort divides into 2 subproblems of size n/2 (giving 2T(n/2)) and merging takes O(n). So T(n) = 2T(n/2) + O(n) which solves to O(n log n)."
    }
  ],

  "Quick Sort": [
    {
      question: "What is the worst case time complexity of Quick Sort and when does it occur?",
      options: [
        "O(n log n) when pivot is median",
        "O(n²) when array is already sorted with last element as pivot",
        "O(n) when array is reverse sorted",
        "O(n²) only when all elements are equal"
      ],
      correct: 1,
      explanation: "When pivot is always the smallest or largest element (like sorted array with last element pivot), partitioning is unbalanced giving O(n²). This is Quick Sort worst case."
    },
    {
      question: "What is the space complexity of Quick Sort?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correct: 2,
      explanation: "Quick Sort uses O(log n) space for recursion call stack in average case. Unlike Merge Sort, it does not need extra array for merging."
    },
    {
      question: "Which pivot selection strategy gives best average performance?",
      options: [
        "Always first element",
        "Always last element",
        "Random element or median of three",
        "Always middle element"
      ],
      correct: 2,
      explanation: "Random pivot or median of three (first, middle, last) avoids worst case on sorted arrays and gives consistently good O(n log n) average performance."
    },
    {
      question: "Quick Sort is NOT preferred when:",
      options: [
        "Array is large",
        "Stability is required",
        "Memory is limited",
        "Average performance matters"
      ],
      correct: 1,
      explanation: "Standard Quick Sort is not stable. Equal elements may change relative order during partitioning. When stability is needed, use Merge Sort instead."
    },
    {
      question: "After one partition step with pivot 5 on array [3,8,5,1,9,2,7], which is correct?",
      options: [
        "5 is at index 0",
        "All elements left of 5 are smaller and right are larger",
        "Array is fully sorted",
        "5 is always at middle index"
      ],
      correct: 1,
      explanation: "After one partition, pivot reaches its final correct position with all smaller elements to its left and all larger elements to its right. This is the key property of partitioning."
    }
  ],

  "Linear Search": [
    {
      question: "What is the average case time complexity of Linear Search?",
      options: ["O(1)", "O(log n)", "O(n/2) which is O(n)", "O(n²)"],
      correct: 2,
      explanation: "On average, Linear Search finds the element after checking n/2 elements. Since constants are ignored in Big O, average case is O(n)."
    },
    {
      question: "Linear Search works on:",
      options: [
        "Only sorted arrays",
        "Only unsorted arrays",
        "Both sorted and unsorted arrays",
        "Only arrays with unique elements"
      ],
      correct: 2,
      explanation: "Linear Search checks every element one by one so it works on both sorted and unsorted arrays unlike Binary Search which requires sorted array."
    },
    {
      question: "When is Linear Search preferred over Binary Search?",
      options: [
        "When array is very large",
        "When array is sorted",
        "When array is small or unsorted",
        "When searching multiple times"
      ],
      correct: 2,
      explanation: "For small arrays the overhead of Binary Search is not worth it. Also if array is unsorted, sorting first then Binary Search costs more than simple Linear Search."
    },
    {
      question: "What is the worst case of Linear Search?",
      options: [
        "Element is at first position",
        "Element is at last position or not present",
        "Array is sorted",
        "All elements are equal"
      ],
      correct: 1,
      explanation: "Worst case is when target is at last position or not in array at all. Linear Search must check all n elements before concluding."
    },
    {
      question: "Sentinel Linear Search improves performance by:",
      options: [
        "Reducing comparisons by half",
        "Eliminating boundary check in each iteration",
        "Sorting array before searching",
        "Using divide and conquer"
      ],
      correct: 1,
      explanation: "Sentinel Search places target value at end of array (sentinel). This removes the i < n boundary check in each loop iteration, reducing number of comparisons per step."
    }
  ],

  "Binary Search": [
    {
      question: "How many comparisons does Binary Search need to find element in sorted array of 1024 elements in worst case?",
      options: ["10", "512", "1024", "100"],
      correct: 0,
      explanation: "Binary Search worst case is O(log₂n). log₂(1024) = 10. So maximum 10 comparisons needed regardless of which element is searched."
    },
    {
      question: "What happens if Binary Search is applied on an unsorted array?",
      options: [
        "It works correctly",
        "It is slower but works",
        "It may give wrong answer",
        "It throws an error"
      ],
      correct: 2,
      explanation: "Binary Search REQUIRES sorted array to work correctly. On unsorted array it may eliminate the half containing the target and give wrong result or not find element at all."
    },
    {
      question: "What is the correct mid calculation to avoid integer overflow?",
      options: [
        "mid = (low + high) / 2",
        "mid = low + (high - low) / 2",
        "mid = high / 2",
        "mid = (low + high) * 2"
      ],
      correct: 1,
      explanation: "mid = (low + high) / 2 can overflow when low and high are large integers. mid = low + (high - low) / 2 avoids this and is the correct way to calculate mid."
    },
    {
      question: "Binary Search can be applied to find:",
      options: [
        "Only exact matches",
        "First occurrence of duplicate element",
        "Both exact match and first/last occurrence",
        "Only in integer arrays"
      ],
      correct: 2,
      explanation: "Binary Search variants can find exact match, first occurrence, last occurrence, smallest element greater than target, and many other things. It is very versatile."
    },
    {
      question: "What is the recurrence relation for Binary Search?",
      options: [
        "T(n) = 2T(n/2) + O(1)",
        "T(n) = T(n/2) + O(1)",
        "T(n) = T(n-1) + O(1)",
        "T(n) = 2T(n-1) + O(n)"
      ],
      correct: 1,
      explanation: "Binary Search divides into ONE subproblem of size n/2 (not two like Merge Sort) and does O(1) comparison work. So T(n) = T(n/2) + O(1) solving to O(log n)."
    }
  ],

  "Stack": [
    {
      question: "Which of the following applications uses Stack data structure?",
      options: [
        "CPU Scheduling",
        "Function call management and recursion",
        "Breadth First Search",
        "Printer spooling"
      ],
      correct: 1,
      explanation: "Function calls use Stack. When function A calls B, A is pushed. When B returns, A is popped and execution continues. This is called call stack."
    },
    {
      question: "What is the output of: Push 1, Push 2, Push 3, Pop, Push 4, Pop, Pop?",
      options: ["3, 4, 2", "1, 2, 3", "3, 2, 1", "4, 3, 2"],
      correct: 0,
      explanation: "Stack after pushes: [1,2,3]. Pop→3. Push 4: [1,2,4]. Pop→4. Pop→2. So output is 3, 4, 2 in order."
    },
    {
      question: "Infix expression A+B*C is converted to postfix as:",
      options: ["ABC*+", "AB+C*", "ABC+*", "A+BC*"],
      correct: 0,
      explanation: "B*C has higher precedence so it evaluates first. Postfix: ABC*+. Stack is used to convert infix to postfix by handling operator precedence."
    },
    {
      question: "What is the time complexity of all basic Stack operations?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correct: 2,
      explanation: "Push, Pop, Peek all operate only on the top of Stack. No traversal needed. All operations are O(1) constant time."
    },
    {
      question: "A stack is implemented using an array of size 5. After Push(1), Push(2), Push(3), Pop(), Push(4), Push(5), Push(6), what happens?",
      options: [
        "Stack stores all 6 elements",
        "Stack Overflow occurs at Push(6)",
        "Push(5) causes overflow",
        "Pop makes room so no overflow"
      ],
      correct: 1,
      explanation: "After Push(1,2,3), Pop removes 3, then Push(4,5) fills to size 5 with [1,2,4,5]. Push(6) would exceed size 5 causing Stack Overflow."
    }
  ],

  "Queue": [
    {
      question: "Which of following uses Queue data structure?",
      options: [
        "Undo operation in text editor",
        "Recursive function calls",
        "CPU process scheduling (Round Robin)",
        "Balancing parentheses"
      ],
      correct: 2,
      explanation: "Round Robin CPU scheduling uses Queue. Each process gets equal time slice. After its turn, process goes to back of queue. First come first served."
    },
    {
      question: "In a circular queue of size 5, after Enqueue(1,2,3,4,5) and Dequeue twice, how many elements can still be enqueued?",
      options: ["0", "1", "2", "5"],
      correct: 2,
      explanation: "After enqueueing 5 elements, queue is full. After 2 dequeues, 2 slots are freed. In circular queue, those 2 slots can be reused, so 2 more elements can be enqueued."
    },
    {
      question: "What is the difference between Queue and Deque?",
      options: [
        "Queue is faster than Deque",
        "Deque allows insertion and deletion from both ends",
        "Queue allows deletion from both ends",
        "There is no difference"
      ],
      correct: 1,
      explanation: "Deque (Double Ended Queue) allows insertion and deletion from BOTH front and rear. Regular Queue only allows enqueue at rear and dequeue from front."
    },
    {
      question: "Enqueue 5 elements and Dequeue 3. What is the front of queue if elements were 1,2,3,4,5?",
      options: ["1", "3", "4", "5"],
      correct: 2,
      explanation: "Enqueue: [1,2,3,4,5]. Dequeue 3 times removes 1, 2, 3 from front. Remaining: [4,5]. Front is now 4."
    },
    {
      question: "Which traversal of a Binary Tree uses Queue?",
      options: [
        "Inorder traversal",
        "Preorder traversal",
        "Postorder traversal",
        "Level order traversal"
      ],
      correct: 3,
      explanation: "Level order traversal (BFS) uses Queue. We enqueue root, then dequeue and enqueue children level by level. This visits nodes level by level from top to bottom."
    }
  ],

  "Linked List": [
    {
      question: "Which operation is O(1) in Singly Linked List?",
      options: [
        "Search for an element",
        "Delete last node",
        "Insert at head",
        "Find length of list"
      ],
      correct: 2,
      explanation: "Insert at head is O(1) because we just create new node, point it to current head, and update head pointer. No traversal needed."
    },
    {
      question: "What is the main advantage of Linked List over Array?",
      options: [
        "Faster random access",
        "Less memory usage",
        "Dynamic size and O(1) insertion at head",
        "Better cache performance"
      ],
      correct: 2,
      explanation: "Linked List grows and shrinks dynamically unlike arrays with fixed size. Insertion at head is O(1) and no shifting needed unlike arrays where insertion requires shifting."
    },
    {
      question: "In a linked list 1→2→3→4→5, what happens when we delete node with value 3?",
      options: [
        "Node 2 points to NULL",
        "Node 2 points to Node 4",
        "Node 4 points to Node 2",
        "List becomes 1→2→4→5→3"
      ],
      correct: 1,
      explanation: "To delete node 3, we make node 2's next pointer skip node 3 and point directly to node 4. Result: 1→2→4→5. Node 3 is disconnected and removed."
    },
    {
      question: "How do you detect a cycle in a Linked List?",
      options: [
        "Count total nodes",
        "Use two pointers: slow moves 1 step, fast moves 2 steps",
        "Check if last node points to NULL",
        "Sort the linked list first"
      ],
      correct: 1,
      explanation: "Floyd's Cycle Detection uses slow and fast pointers. If there is a cycle, fast pointer will eventually meet slow pointer inside the cycle. If no cycle, fast reaches NULL."
    },
    {
      question: "What is the time complexity to find the middle of a Linked List?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correct: 2,
      explanation: "To find middle, we either count total nodes and go n/2 steps (O(n)) or use slow/fast pointer where fast moves 2x speed (also O(n)). No way to do it faster than O(n)."
    }
  ],

  "Binary Search Tree": [
    {
      question: "What is the average time complexity for searching in a Binary Search Tree?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 1,
      explanation: "In an average (balanced) BST, each step eliminates half of the remaining nodes, giving O(log n) time complexity. However, worst case is O(n) for a skewed tree."
    },
    {
      question: "Which traversal of a BST visits the nodes in sorted (ascending) order?",
      options: ["Preorder", "Postorder", "Level Order", "Inorder"],
      correct: 3,
      explanation: "Inorder traversal visits the left subtree, then the root, then the right subtree. In a BST, this guarantees the nodes are visited in ascending sorted order."
    },
    {
      question: "When deleting a node with two children in a BST, how do you find its replacement?",
      options: [
        "Replace it with the root node",
        "Replace it with its left child",
        "Find the inorder successor or inorder predecessor",
        "Delete the entire subtree"
      ],
      correct: 2,
      explanation: "To maintain the BST property, a node with two children is replaced by its inorder successor (smallest node in right subtree) or inorder predecessor (largest in left subtree)."
    },
    {
      question: "What happens if you insert sorted data (e.g., 1, 2, 3, 4, 5) into a standard BST?",
      options: [
        "It becomes a perfectly balanced tree",
        "It becomes a skewed tree (like a linked list)",
        "The insertions are rejected",
        "It automatically balances itself"
      ],
      correct: 1,
      explanation: "Inserting sorted data into a standard BST causes every new node to be added as a right child, creating a right-skewed tree that degrades performance to O(n)."
    },
    {
      question: "Which of the following properties defines a Binary Search Tree?",
      options: [
        "Left child > Parent > Right child",
        "Parent is strictly greater than both children",
        "Left child < Parent < Right child",
        "All leaf nodes must be at the same level"
      ],
      correct: 2,
      explanation: "The core property of a BST is that for any node, all nodes in its left subtree are smaller, and all nodes in its right subtree are larger."
    }
  ],

  "Dijkstra": [
    {
      question: "What is the primary purpose of Dijkstra's algorithm?",
      options: [
        "To find the Minimum Spanning Tree of a graph",
        "To find the shortest path from a single source node to all other nodes",
        "To traverse all nodes in a graph using Depth First Search",
        "To sort the vertices of a Directed Acyclic Graph"
      ],
      correct: 1,
      explanation: "Dijkstra's algorithm is a Single-Source Shortest Path (SSSP) algorithm, meaning it finds the shortest path from one starting node to all other reachable nodes in the graph."
    },
    {
      question: "What type of edges cause Dijkstra's algorithm to fail or produce incorrect results?",
      options: ["Directed edges", "Undirected edges", "Negative weight edges", "Self-loops"],
      correct: 2,
      explanation: "Dijkstra's greedy approach assumes that once a node is visited, its shortest distance is final. Negative weight edges break this assumption, requiring algorithms like Bellman-Ford instead."
    },
    {
      question: "What is the time complexity of Dijkstra's algorithm when implemented with a Min-Priority Queue?",
      options: ["O(V + E)", "O(V²)", "O(E log V)", "O((V + E) log V)"],
      correct: 3,
      explanation: "Using a Min-Heap (Priority Queue), extracting the minimum distance node takes O(log V) and relaxing edges takes O(log V), resulting in an overall time complexity of O((V + E) log V)."
    },
    {
      question: "Which algorithmic paradigm does Dijkstra's algorithm use?",
      options: ["Dynamic Programming", "Greedy Algorithm", "Divide and Conquer", "Backtracking"],
      correct: 1,
      explanation: "Dijkstra is a Greedy algorithm because at every step it makes the locally optimal choice by picking the unvisited node with the absolute smallest known distance."
    },
    {
      question: "In Dijkstra's algorithm, what does 'Edge Relaxation' mean?",
      options: [
        "Removing an edge from the graph",
        "Updating the shortest known distance to a node if a cheaper path is found through a neighbor",
        "Ignoring edges that lead to already visited nodes",
        "Decreasing the weight of all edges by a constant amount"
      ],
      correct: 1,
      explanation: "Relaxation is the process of checking if the path to a destination node is shorter when going through the current node. If it is, the known distance is updated."
    }
  ]
};
