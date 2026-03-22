import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Trophy, CreditCard, Heart, Award, Shield, LogOut } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Scores', path: '/scores', icon: Trophy },
    { name: 'Subscription', path: '/subscription', icon: CreditCard },
    { name: 'Charity', path: '/charity', icon: Heart },
    { name: 'Winners', path: '/winners', icon: Award },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: Shield });
  }

  return (
    <div className="w-64 bg-brand-sidebar text-brand-text min-h-screen fixed left-0 top-0 flex flex-col p-6 border-r border-brand-border">
      <div className="flex items-center gap-3 mb-10 pl-2">
        <Trophy className="w-8 h-8 text-brand-accent" />
        <h1 className="text-xl font-extrabold tracking-tight text-brand-text">Fairway Fund</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                isActive 
                  ? "bg-white text-brand-text shadow-sm ring-1 ring-brand-border" 
                  : "text-brand-muted hover:text-brand-text hover:bg-black/5"
              )}
            >
              <Icon className="w-5 h-5 stroke-[1.5]" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-brand-border">
        <div className="mb-4 pl-2">
          <p className="text-sm font-medium text-brand-text truncate">{user?.name}</p>
          <p className="text-xs text-brand-muted truncate capitalize">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 stroke-[1.5]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
