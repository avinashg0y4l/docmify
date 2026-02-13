
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ToolPage from './pages/ToolPage';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />

        {/* Tool Routes */}
        <Route path="/compress" element={<ToolPage />} />
        <Route path="/merge" element={<ToolPage />} />
        <Route path="/split" element={<ToolPage />} />
        <Route path="/pdf-to-word" element={<ToolPage />} />
        <Route path="/pdf-to-ppt" element={<ToolPage />} />
        <Route path="/excel-to-pdf" element={<ToolPage />} />
        <Route path="/edit-pdf" element={<ToolPage />} />
        <Route path="/pdf-to-jpg" element={<ToolPage />} />
        <Route path="/jpg-to-pdf" element={<ToolPage />} />
        <Route path="/sign-pdf" element={<ToolPage />} />
        <Route path="/watermark" element={<ToolPage />} />
        <Route path="/rotate-pdf" element={<ToolPage />} />
        <Route path="/protect" element={<ToolPage />} />
        <Route path="/unlock" element={<ToolPage />} />
        <Route path="/resize" element={<ToolPage />} />
        <Route path="/rotate" element={<ToolPage />} />
        <Route path="/delete-pages" element={<ToolPage />} />
        <Route path="/word-to-pdf" element={<ToolPage />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
