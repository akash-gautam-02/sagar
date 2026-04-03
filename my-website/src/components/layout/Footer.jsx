import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Instagram, ArrowUpRight, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/work' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-[#0A0A0B] text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="space-y-8 col-span-1 lg:col-span-1">
            <Link to="/" className="font-syne font-bold text-3xl flex items-center gap-1 group">
              <span className="text-brand-accent">DIGITAL</span>
              <span className="text-white">CORE</span>
            </Link>
            <p className="text-gray-400 font-dm-sans leading-relaxed max-w-xs">
              We build high-performance digital products that scale. From elite designs to secure infrastructure.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-brand-accent hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="font-syne font-bold text-lg uppercase tracking-widest text-brand-accent">Sitemap</h4>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-colors font-dm-sans flex items-center gap-2 group">
                    {link.name} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support / Contact */}
          <div className="space-y-8">
            <h4 className="font-syne font-bold text-lg uppercase tracking-widest text-brand-accent">Get in Touch</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-gray-500 mt-1" />
                <div>
                   <p className="text-white font-dm-sans font-bold text-sm">Write to us</p>
                   <p className="text-gray-400 text-sm">hello@digitalcore.agency</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-500 mt-1" />
                <div>
                   <p className="text-white font-dm-sans font-bold text-sm">Headquarters</p>
                   <p className="text-gray-400 text-sm">Design District, SF</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-8">
            <h4 className="font-syne font-bold text-lg uppercase tracking-widest text-brand-accent">Newsletter</h4>
            <p className="text-gray-400 text-sm font-dm-sans">Stay updated with latest trends and our recent work.</p>
            <div className="relative group">
               <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-dm-sans focus:outline-none focus:border-brand-accent transition-colors"
               />
               <button className="absolute right-2 top-2 bottom-2 aspect-square bg-brand-accent rounded-xl flex items-center justify-center text-white hover:bg-brand-accent/80 transition-colors">
                  <ArrowUpRight size={18} />
               </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-dm-sans">
          <p>© {currentYear} DigitalCore Agency. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
