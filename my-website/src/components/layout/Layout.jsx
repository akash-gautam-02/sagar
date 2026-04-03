import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SmoothScroll from '../animations/SmoothScroll';
import CustomCursor from '../ui/CustomCursor';
import PageTransition from '../animations/PageTransition';
import { AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { pathname } = useLocation();
  const hideLayout = pathname === '/login' || pathname === '/register' || pathname.startsWith('/dashboard');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen font-dm-sans bg-brand-white text-brand-black selection:bg-brand-accent selection:text-white">
        <CustomCursor />
        {!hideLayout && <Navbar />}
        <main className="grow overflow-hidden">
          <AnimatePresence mode="wait">
            <PageTransition key={pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
        {!hideLayout && <Footer />}
      </div>
    </SmoothScroll>
  );
};

export default Layout;
