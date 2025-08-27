
import { useState } from 'react';
import Hero from './Hero';
import Navigation from './Navigation';
import ContentGrid from './ContentGrid';
import ContentForm from './ContentForm';
import AdminLogin from './AdminLogin';
import SnakeGame from './SnakeGame';
import { Button } from './ui/button';
import { Settings, LogOut, GamepadIcon } from 'lucide-react';

const PersonalWebsite = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const categories = ['All', 'General', 'Tech', 'Business', 'Featured'];

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminPanel(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
  };

  return (
    <div className="min-h-screen"> 
      <div className="container mx-auto px-4 py-8">
        {/* Admin Controls */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={() => setShowGame(!showGame)}
            size="sm"
            variant="outline"
            className="bg-secondary/60 backdrop-blur-sm"
          >
            <GamepadIcon className="w-4 h-4" />
          </Button>
          {!isAdmin ? (
            <Button
              onClick={() => setShowAdminPanel(true)}
              size="sm"
              variant="outline"
              className="bg-secondary/60 backdrop-blur-sm"
            >
              <Settings className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              size="sm"
              variant="outline"
              className="bg-secondary/60 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Snake Game Modal */}
        {showGame && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
            <div className="glass-card rounded-lg p-6 max-w-md w-full border border-border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Snake Game</h2>
                <Button
                  onClick={() => setShowGame(false)}
                  variant="ghost"
                  size="sm"
                >
                  ×
                </Button>
              </div>
              <SnakeGame />
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {showAdminPanel && !isAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
            <div className="relative glass-card rounded-lg border border-border">
              <Button
                onClick={() => setShowAdminPanel(false)}
                className="absolute -top-2 -right-2 z-10"
                size="sm"
                variant="ghost"
              >
                ×
              </Button>
              <AdminLogin onLogin={handleAdminLogin} />
            </div>
          </div>
        )}

        {/* Top Navigation */}
        <Navigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isAdmin={isAdmin}
          onAdminToggle={() => setShowAdminPanel(true)}
        />

        {showAdminPanel && isAdmin ? (
          <div className="space-y-8 pt-20">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
              <p className="text-muted-foreground">Create and manage your content</p>
            </div>
            <ContentForm />
          </div>
        ) : (
          <div className="space-y-12 pt-20">
            {activeSection == 'home' && (
              <Hero setActiveSection={setActiveSection} />
            )}

            {(activeSection === 'articles' || activeSection === 'guides') && (
              <>
                {/* Category filtering UI can be added later; defaulting to All */}
                <ContentGrid selectedCategory={selectedCategory || 'All'} />
              </>
            )}

            {activeSection === 'snake' && (
              <div className="max-w-2xl mx-auto">
                <SnakeGame />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalWebsite;

