import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import CatalogSection from './components/CatalogSection';
import Features from './components/Features';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatModal, { ChatButton } from './components/ChatModal';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import './index.css';

type View = 'home' | 'productDetail';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    // Simple URL check for admin route
    if (window.location.pathname === '/admin') {
      setIsAdminRoute(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  const handleViewProduct = (productId: number) => {
    setSelectedProductId(productId.toString());
    setCurrentView('productDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedProductId(null);
    // Scroll to catalog section
    setTimeout(() => {
      const catalogEl = document.getElementById('catalogo');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (isAdminRoute) {
    return (
      <ProductProvider>
        <ThemeProvider>
          {isAdminAuthenticated ? (
            <Admin onLogout={handleAdminLogout} />
          ) : (
            <Login onLogin={handleAdminLogin} />
          )}
        </ThemeProvider>
      </ProductProvider>
    );
  }

  // Product Detail View
  if (currentView === 'productDetail' && selectedProductId) {
    return (
      <ProductProvider>
        <ThemeProvider>
          <ProductDetail
            productId={selectedProductId}
            onBack={handleBackToHome}
          />
        </ThemeProvider>
      </ProductProvider>
    );
  }

  return (
    <ProductProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <Navbar />
          <main>
            <Hero3D onOpenChat={() => setIsChatOpen(true)} />
            <CatalogSection onViewProduct={handleViewProduct} />
            <Features />
            <Contact />
          </main>
          <Footer />

          {/* Chat Widget */}
          <ChatButton onClick={() => setIsChatOpen(true)} />
          <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
      </ThemeProvider>
    </ProductProvider>
  );
}

export default App;
