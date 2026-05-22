import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VisualizerPage from './pages/VisualizerPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f0f0f] text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/visualizer/:algorithm" element={<VisualizerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
