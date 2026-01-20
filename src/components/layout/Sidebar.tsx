import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Car, 
  Wrench, 
  ClipboardList, 
  CreditCard, 
  BarChart3, 
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/cars', icon: Car, label: 'Cars' },
  { path: '/services', icon: Wrench, label: 'Services' },
  { path: '/service-records', icon: ClipboardList, label: 'Service Records' },
  { path: '/payments', icon: CreditCard, label: 'Payments' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout, username } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-sidebar-foreground">SmartPark</h1>
            <p className="text-xs text-sidebar-foreground/60">CRPMS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-semibold text-sidebar-accent-foreground">
              {username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{username}</p>
            <p className="text-xs text-sidebar-foreground/50">Chief Mechanic</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
