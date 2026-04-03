import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/work' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={clsx(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300",
      scrolled 
        ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100 py-3" 
        : "bg-white/50 backdrop-blur-md py-4"
    )}>
      {/* RESPONSIVE: Consistent padding across all screens */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-syne font-bold text-xl sm:text-2xl flex items-center gap-1 group">
          <span className="text-brand-accent">DIGITAL</span>
          <span className={clsx(
            "transition-colors duration-300",
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

        {/* Mobile Toggle Button */}
        <button 
          className={clsx(
            "md:hidden p-2 -mr-2 flex items-center justify-center cursor-pointer transition-colors",
            isOpen || !scrolled ? "text-white" : "text-brand-black"
          )} 
          onClick={() => setIsOpen(true)}
          aria-label="Open Menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={clsx(
        "fixed inset-0 bg-brand-black z-60 transition-all duration-300",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )} onClick={() => setIsOpen(false)} />

      {/* Mobile Drawer Menu */}
      <div className={clsx(
        "fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#0A0A0B] text-white z-70 shadow-2xl transition-transform duration-500 ease-in-out p-8 sm:p-10 flex flex-col border-l border-white/10",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
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
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="font-syne font-bold text-2xl sm:text-3xl text-white hover:text-brand-accent transition-colors py-2 border-b border-white/5 cursor-pointer"
            >
              {link.name}
            </Link>
          ))}
          {/* User Auth in Mobile View */}
          <div className="mt-6 flex flex-col gap-4">
            {user ? (
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                 <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 cursor-pointer">
                   <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold">
                     {user.name[0].toUpperCase()}
                   </div>
                   <span className="font-bold text-white">{user.name}</span>
                 </Link>
                 <button onClick={logout} className="text-red-500 font-bold cursor-pointer hover:text-red-400 transition-colors">Logout</button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="w-full text-center py-4 font-bold text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full!">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

