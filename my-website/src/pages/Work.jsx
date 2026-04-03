import React from 'react';
import { ArrowUpRight, Github, ExternalLink, Smartphone, Layout as LayoutIcon, Code } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Magnetic from '../components/ui/Magnetic';
import { Link } from 'react-router-dom';

const Work = () => {
  const projects = [
    {
      title: "Fintech Dashboard",
      category: "UI/UX Design",
      image: "https://images.unsplash.com/photo-1551288049-bb848a55a110?w=1200&q=80&fit=crop",
      desc: "A comprehensive financial dashboard that visualizes complex data with intuitive charts and real-time updates.",
      tech: ["React", "D3.js", "Tailwind CSS", "Figma"]
    },
    {
      title: "HealthConnect App",
      category: "Mobile Design",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&fit=crop",
      desc: "Telemedicine platform connecting patients with specialized doctors via secure video calls and health tracking.",
      tech: ["React Native", "Firebase", "WebRTC", "UI Design"]
    },
    {
      title: "Luxury Commerce",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&fit=crop",
      desc: "High-end e-commerce experience for a luxury watch brand, featuring an immersive virtual try-on.",
      tech: ["Next.js", "Three.js", "Stripe API", "Vercel"]
    },
    {
      title: "Estate Master",
      category: "SaaS Product",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80&fit=crop",
      desc: "Property management software designed for large-scale real estate firms to streamline operations.",
      tech: ["Node.js", "PostgreSQL", "React", "Docker"]
    }
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="px-6 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <SectionTitle 
          subtitle="Portfolio" 
          title="Exceptional Work, Exceptional Results" 
          centered 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-16">
          {projects.map((project, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-gray-100 mb-8 border border-gray-100 hover:border-brand-accent/30 transition-all shadow-lg hover:shadow-2xl">
                <img 
                   src={project.image} 
                   alt={project.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                   <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-brand-black hover:bg-brand-accent hover:text-white transition-all scale-75 group-hover:scale-100 duration-500">
                     <ArrowUpRight size={24} />
                   </div>
                </div>
              </div>
              <div className="flex justify-between items-start mb-4">
                 <div className="space-y-2">
                    <span className="text-brand-accent text-sm font-dm-sans font-bold uppercase tracking-widest">{project.category}</span>
                    <h3 className="text-3xl font-syne font-extrabold text-brand-black">{project.title}</h3>
                 </div>
              </div>
              <p className="text-gray-600 font-dm-sans mb-6 leading-relaxed max-w-xl">{project.desc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                 {project.tech.map((t, i) => (
                   <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-dm-sans font-medium text-gray-500">{t}</span>
                 ))}
              </div>
              <hr className="border-gray-100 mb-4" />
            </div>
          ))}
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-gray-50 border-y border-gray-100 py-16 mt-20">
         <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
               <p className="text-4xl font-syne font-bold text-brand-black">120+</p>
               <p className="text-xs text-gray-500 font-dm-sans uppercase tracking-[0.2em] mt-1">Live Projects</p>
            </div>
            <div>
               <p className="text-4xl font-syne font-bold text-brand-black">15+</p>
               <p className="text-xs text-gray-500 font-dm-sans uppercase tracking-[0.2em] mt-1">Global Awards</p>
            </div>
            <div>
               <p className="text-4xl font-syne font-bold text-brand-black">95%</p>
               <p className="text-xs text-gray-500 font-dm-sans uppercase tracking-[0.2em] mt-1">Client Retention</p>
            </div>
            <div>
               <p className="text-4xl font-syne font-bold text-brand-black">10M+</p>
               <p className="text-xs text-gray-500 font-dm-sans uppercase tracking-[0.2em] mt-1">End-Users Impacted</p>
            </div>
         </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-24 px-6 text-center space-y-8">
         <h2 className="text-4xl font-syne font-bold text-brand-black">Seen Enough? Let's Start Yours.</h2>
         <div className="flex justify-center pt-4">
            <Magnetic>
               <Link to="/contact">
                  <Button variant="primary" className="px-12 py-5 text-lg">Work With Us</Button>
               </Link>
            </Magnetic>
         </div>
      </section>
    </div>
  );
};

export default Work;
