import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle as Twitter, Camera as Instagram, Globe as Linkedin, Code as Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white pt-20 md:pt-24 pb-10 md:pb-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 mb-16">
        <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">
          <Link to="/" className="font-syne font-bold text-3xl text-brand-accent">
            DIGITAL<span className="text-white">CORE</span>
          </Link>
          <p className="text-gray-400 font-dm-sans max-w-md leading-relaxed">
            Secure, premium digital infrastructure for modern businesses. Providing state-of-the-art authentication and dashboard solutions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500 font-dm-sans text-center md:text-left">
        <p>© {currentYear} DigitalCore. All rights reserved.</p>
        <div className="flex gap-6 sm:gap-8">
          <span className="text-gray-600 italic">Secure. Reliable. Fast.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

