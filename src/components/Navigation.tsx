import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAdmin: boolean;
  onAdminToggle: () => void;
}

const Navigation = ({ activeSection, setActiveSection, isAdmin, onAdminToggle }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'guides', label: 'Hall of Fame' },
    { id: 'articles', label: 'Articles' }
  ];

  return (
    <nav className="glass-card fixed top-0 left-0 right-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">J</span>
            </div>
            <span className="text-xl font-bold neon-text">Johan</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-primary bg-primary/10 shadow-neon'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Admin Toggle */}
            <Button
              variant={isAdmin ? "neon" : "ghost"}
              size="sm"
              onClick={onAdminToggle}
              className="gap-2"
            >
              <Shield size={16} />
              {isAdmin ? "Admin" : "Login"}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass border-t border-border/50">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button
                variant={isAdmin ? "neon" : "glass"}
                size="sm"
                onClick={() => {
                  onAdminToggle();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-2"
              >
                <Shield size={16} />
                {isAdmin ? "Admin Panel" : "Admin Login"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;