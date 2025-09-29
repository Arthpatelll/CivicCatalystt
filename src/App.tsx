import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthProvider';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import SimplifiedMode from './components/UI/SimplifiedMode';
import Login from './pages/Login';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Analytics from './pages/Analytics';
import APIDocs from './pages/APIDocs';

function App() {
  const [isSimplified, setIsSimplified] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen bg-gray-50 flex flex-col ${isSimplified ? 'text-lg' : ''}`}>
          <SimplifiedMode 
            isSimplified={isSimplified} 
            onToggle={() => setIsSimplified(!isSimplified)} 
          />
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/report" element={<ReportIssue />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/api" element={<APIDocs />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;