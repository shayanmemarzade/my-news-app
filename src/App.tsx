import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NewsProvider } from './contexts/NewsContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import HomePage from './pages/HomePage';
import PreferencesPage from './pages/PreferencesPage';
import './index.css';

function App() {
  return (
    <Router>
      <PreferencesProvider>
        <NewsProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
          </Routes>
        </NewsProvider>
      </PreferencesProvider>
    </Router>
  );
}

export default App;