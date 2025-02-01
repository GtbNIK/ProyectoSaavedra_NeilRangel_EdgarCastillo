// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/layout/topbar';
import Navbar from './components/layout/navbar';
import Home from './pages/Home';
import Services from './components/home/Services';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <div className="wrapper">
        <TopBar />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Home />} />
          <Route path="/About.html" element={<AboutPage />} />
          <Route path="/service.html" element={<Services />} />
          <Route path="/price.html" element={<div>Price Page</div>} />
          <Route path="/contact.html" element={<div>Contact Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;