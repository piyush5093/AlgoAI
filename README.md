# 🚀 AlgoAI - Premium DSA Visualizer & AI Tutor

[![Live Demo](https://img.shields.io/badge/Live_Demo-algo--ai--rosy.vercel.app-brightgreen?style=for-the-badge)](https://algo-ai-rosy.vercel.app)
[![Tech Stack](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

AlgoAI is a professional-grade, interactive educational platform designed to make learning Data Structures and Algorithms (DSA) intuitive and engaging. Built with a premium, modern design, it combines real-time algorithm visualization with an integrated AI tutor to provide a "LeetCode-premium" level learning experience.

## ✨ Features

- **Interactive Visualizers:** Watch algorithms come to life with dynamic animations, glowing elements, and step-by-step state tracking. Supports 10+ algorithms and data structures:
  - **Sorting:** Merge Sort, Quick Sort, Bubble Sort, Insertion Sort, Selection Sort
  - **Searching:** Linear Search, Binary Search
  - **Data Structures:** Linked Lists, Stacks, Queues, Binary Search Trees
  - **Graph Algorithms:** Dijkstra's Shortest Path with real-time distance tables
- **Code Execution Simulator:** A "Python Tutor"-inspired engine that tracks and animates memory allocation, stack frames, and pointers line-by-line.
- **AI Chat Assistant:** Powered by the Groq API, the integrated AI assistant acts as your personal tutor. Ask algorithm-specific questions, request complexity analysis, and get instant explanations without leaving the visualizer.
- **Interactive Quiz Mode:** Test your knowledge with dynamically generated quizzes based on the algorithms you study.
- **Premium UI/UX:** Built with sleek dark themes, glassmorphism, smooth micro-animations, and responsive layouts to ensure a state-of-the-art learning environment.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **AI Integration:** Groq API (LLM inference)
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine
- A [Groq API Key](https://console.groq.com/) for the AI Chat feature

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/piyush5093/AlgoAi.git
   cd AlgoAI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add your Groq API key:
   ```env
   VITE_GROQ_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🎯 Why I Built This

I developed AlgoAI to bridge the gap between static code execution and true comprehension. While solving algorithm problems, visualizing the data transformation is often the hardest part. AlgoAI solves this by treating code execution like a movie—allowing users to pause, step through, and truly understand the mechanics of complex algorithms. The integration of an AI tutor ensures that whenever a user gets stuck, contextual help is just a message away.

---
*Developed by Piyush*
