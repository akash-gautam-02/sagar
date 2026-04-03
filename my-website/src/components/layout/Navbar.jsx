import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import Button from '../ui/Button';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/work' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/90 dark:bg-brand-black/90 backdrop-blur-xl shadow-lg border-b border-gray-100 dark:border-white/10 py-3" 
          : "bg-white/50 dark:bg-brand-black/50 backdrop-blur-md py-4"
      )}>
      {/* RESPONSIVE: Consistent padding across all screens */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-syne font-bold text-xl sm:text-2xl flex items-baseline gap-1 group translate-y-[-1px]">
          <span className="text-brand-accent leading-none">DIGITAL</span>
          <span className={clsx(
            "transition-colors duration-300 leading-none",
            scrolled ? "text-brand-black" : "text-brand-black/80"
          )}>CORE</span>
        </Link>

        {/* Desktop Nav: Hidden on mobile, shown from md onwards */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={clsx(
                "relative font-dm-sans font-medium transition-all duration-300 hover:text-brand-accent group py-2",
                location.pathname === link.path ? "text-brand-accent" : "text-gray-600"
              )}
            >
              {link.name}
              <span className={clsx(
                "absolute bottom-0 left-0 h-0.5 bg-brand-accent transition-all duration-300",
                location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
              )}></span>
            </Link>
          ))}
          
          <div className="flex items-center gap-4 ml-4 pl-8 border-l border-gray-200">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-4 cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-brand-white rounded-full border border-gray-100 hover:bg-gray-50 transition-colors">
                     <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white text-xs font-bold font-syne">
                        {user.name[0].toUpperCase()}
                     </div>
                     <span className="text-sm font-bold font-dm-sans text-brand-black">{user.name}</span>
                  </div>
                </Link>
                <button 
                   onClick={logout}
                   className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                   title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold font-dm-sans text-gray-500 hover:text-brand-accent transition-colors">Login</Link>
                <Link to="/register">
                  <Button variant="primary" className="px-6! py-2.5! text-sm!">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-gray-100 dark:bg-white/10 text-brand-black dark:text-white transition-all cursor-pointer hover:scale-110"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button 
              className={clsx(
                "md:hidden p-3 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300",
                isOpen ? "bg-brand-accent text-white shadow-xl" : scrolled ? "bg-gray-100 dark:bg-white/10 text-brand-black dark:text-white" : "bg-white/20 text-brand-black shadow-sm"
              )} 
              onClick={() => setIsOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay - MOVED OUTSIDE NAV */}
      <div className={clsx(
        "fixed inset-0 bg-brand-black/95 backdrop-blur-md z-[100] transition-all duration-500",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )} onClick={() => setIsOpen(false)} />

      {/* Mobile Drawer Menu - MOVED OUTSIDE NAV */}
      <div 
        className={clsx(
          "fixed top-0 right-0 h-full w-[85%] max-w-sm text-white z-[110] shadow-2xl transition-transform duration-500 ease-in-out p-8 sm:p-10 flex flex-col border-l border-white/10",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ backgroundColor: '#0A0A0B' }}
      >
        <div className="flex justify-between items-center mb-10">
          <Link to="/" className="font-syne font-bold text-xl flex items-center gap-1 group" onClick={() => setIsOpen(false)}>
            <span className="text-brand-accent">DIGITAL</span>
            <span className="text-white">CORE</span>
          </Link>
          <button 
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer" 
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
          >
            <X size={28} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="group font-syne font-bold text-2xl sm:text-3xl text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300 py-4 px-6 rounded-3xl border-b border-white/5 cursor-pointer block"
            >
              <div className="flex items-center justify-between">
                <span>{link.name}</span>
                <ArrowRight size={20} className="text-brand-accent/50 group-hover:text-brand-accent transition-all" />
              </div>
            </Link>
          ))}
          {/* User Auth in Mobile View */}
          <div className="mt-8 flex flex-col gap-4">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10">
                   <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 cursor-pointer">
                     <div className="w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                       {user.name[0].toUpperCase()}
                     </div>
                     <span className="font-syne font-bold text-xl text-white">{user.name}</span>
                   </Link>
                </div>
                <button 
                   onClick={logout} 
                   className="w-full text-center py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold border border-red-500/20 active:bg-red-500/20 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="w-full text-center py-5 rounded-3xl bg-white/10 border border-white/10 font-bold text-white hover:bg-white/20 transition-all active:scale-[0.98]"
                >
                  Sign In to Dashboard
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full! h-20! text-2xl! shadow-2xl! shadow-brand-accent/30 rounded-3xl!">Get Started Now</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

