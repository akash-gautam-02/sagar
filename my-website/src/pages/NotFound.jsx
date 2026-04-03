import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home, Compass, MoveLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-white px-6">
      <div className="max-w-4xl w-full text-center space-y-12 relative">
        {/* Huge Background 404 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-syne font-black text-[12rem] md:text-[24rem] text-brand-accent/5 select-none pointer-events-none z-0">
          404
        </div>
        
        <div className="relative z-10 space-y-8">
           <div className="inline-flex items-center gap-4 bg-brand-accent-light text-brand-accent px-6 py-2 rounded-full font-dm-sans font-black uppercase tracking-widest text-xs">
              <Compass className="animate-spin duration-1000" size={18} /> Error Found
           </div>
           
           <h1 className="text-5xl md:text-8xl font-syne font-extrabold text-brand-black leading-tight">
              Looks like this page took a <span className="text-brand-accent italic">vacation.</span>
           </h1>
           
           <p className="text-xl md:text-2xl text-gray-500 font-dm-sans max-w-2xl mx-auto">
              Don't worry, even the best travelers get lost sometimes. Let's get you back on track to where the magic happens.
           </p>
           
           <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/">
                <Button variant="primary" className="!px-12 !py-5">
                   <Home size={20} /> Back to Home
                </Button>
              </Link>
              <Button variant="secondary" onClick={() => window.history.back()} className="!px-12 !py-5">
                 <MoveLeft size={20} /> Go Back
              </Button>
           </div>
        </div>
        
        <div className="pt-24 opacity-30 grayscale flex justify-center gap-16 font-syne font-black text-2xl select-none">
           <span>DIGITALCORE</span>
           <span>AGENCY</span>
           <span>EXPERIENCE</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
