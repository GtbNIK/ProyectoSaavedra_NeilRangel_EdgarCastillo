// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/layout/topbar';
import Navbar from './components/layout/navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="wrapper">
        <TopBar />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<div>About Page</div>} />
          <Route path="/service" element={<div>Service Page</div>} />
          <Route path="/price" element={<div>Price Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;