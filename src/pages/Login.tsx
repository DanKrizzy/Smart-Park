import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Password must be at least 6 characters.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/50 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                <Settings className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold">SmartPark</h1>
                <p className="text-white/60">Car Repair Payment Management</p>
              </div>
            </div>
            <h2 className="text-2xl font-display font-semibold mb-4">
              Streamline Your Garage Operations
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">
              Manage car repairs, track services, process payments, and generate invoices 
              all in one powerful system designed for SmartPark garage.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur">
                <p className="text-3xl font-display font-bold text-primary">6+</p>
                <p className="text-white/60 text-sm">Repair Services</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur">
                <p className="text-3xl font-display font-bold text-primary">24/7</p>
                <p className="text-white/60 text-sm">System Access</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">SmartPark</h1>
              <p className="text-muted-foreground text-sm">CRPMS</p>
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Welcome back
          </h2>
          <p className="text-muted-foreground mb-8">
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-11 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters (strong & encrypted)
              </p>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Rubavu District, Western Province • Rwanda
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
