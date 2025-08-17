import { useState } from 'react';
import { Shield, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  onClose: () => void;
}

const AdminLogin = ({ onLogin, onClose }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card p-8 rounded-xl border border-border/50 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Admin Login</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter admin password..."
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              variant="neon"
              className="flex-1"
            >
              Login
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/30">
          <p className="text-xs text-muted-foreground">
            <strong>Demo Password:</strong> abcd1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;