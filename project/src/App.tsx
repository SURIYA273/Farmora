import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import {
  Plane as Plant,
  Users,
  BarChart3,
  Leaf,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { SearchBar } from './components/SearchBar';
import { WeatherWidget } from './components/WeatherWidget';
import { MarketPrices } from './components/MarketPrices';
import { GrowthAnalysis } from './components/GrowthAnalysis';
import { FarmMap } from './components/FarmMap';
import { AuthModal } from './components/AuthModal';
import { supabase } from './lib/supabase';
import { CropManagement } from './pages/CropManagement';
import { TeamCollaboration } from './pages/TeamCollaboration';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { UserProfile } from './pages/UserProfile';
import { Features } from './pages/Features';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';

function AuthModalWrapper() {
  const navigate = useNavigate();
  return <AuthModal isOpen={true} onClose={() => navigate('/')} />;
}

function App() {
  const { t } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      window.location.href = '/dashboard';
    }
    setIsMobileMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className="hover:text-green-400 transition"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {t('nav.home')}
      </Link>
      <Link
        to="/features"
        className="hover:text-green-400 transition"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {t('nav.features')}
      </Link>
      <Link
        to="/about"
        className="hover:text-green-400 transition"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {t('nav.about')}
      </Link>
      <Link
        to="/contact"
        className="hover:text-green-400 transition"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {t('nav.contact')}
      </Link>
      <div className="md:hidden">
        <LanguageSwitcher />
      </div>
      {user ? (
        <>
          <Link
            to="/dashboard"
            className="hover:text-green-400 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-green-400 transition"
          >
            {t('nav.logout')}
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setIsAuthModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className="hover:text-green-400 transition"
        >
          {t('nav.login')}
        </button>
      )}
    </>
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold text-gray-800">
                  Farmora
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <NavLinks />
                <div className="hidden md:block">
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center space-x-4 md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Get Started Button */}
              <button
                onClick={handleGetStarted}
                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition hidden md:block"
              >
                {t('nav.getStarted')}
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 py-4 border-t space-y-4">
                <div className="flex flex-col space-y-4">
                  <NavLinks />
                </div>
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
                >
                  {t('nav.getStarted')}
                </button>
              </div>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crop-management" element={<CropManagement />} />
          <Route path="/team-collaboration" element={<TeamCollaboration />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/signup" element={<AuthModalWrapper />} />
        </Routes>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;