import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle2, Layout as LayoutIcon, Code, Heart, ArrowUpRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import SectionTitle from '../components/ui/SectionTitle';
import Magnetic from '../components/ui/Magnetic';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Home = () => {
  const heroRef = useScrollAnimation();
  const serviceRef = useScrollAnimation();
  const statsRef = useScrollAnimation();

  return (
    <div className="overflow-hidden">
      {/* 🚀 Hero Section */}
      {/* RESPONSIVE: Fluid padding and container max-width */}
      <section ref={heroRef} className="pt-24 sm:pt-32 pb-20 md:pb-32 px-6 sm:px-8 md:px-12 max-w-7xl mx-auto opacity-0 translate-y-8 transition-all duration-700">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-3/5 space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Badge>🚀 Trusted by 500+ Companies</Badge>
            </div>
            {/* RESPONSIVE: Scaled heading sizes */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-syne font-extrabold text-brand-black leading-[1.1] tracking-tight">
              We Build Digital <span className="text-brand-accent">Experiences</span> That Actually Work
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-dm-sans leading-relaxed max-w-2xl mx-auto lg:mx-0">
              From stunning interfaces to seamless user flows — we turn complex ideas into elegant digital products. Our design-centric approach ensures your brand stands out.
            </p>
            {/* RESPONSIVE: Buttons full-width on mobile */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 pt-6 md:pt-10">
              <Magnetic>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="primary" className="py-4 md:py-5 text-lg">
                    Start Your Project <ArrowUpRight className="inline-block ml-2" size={20} />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/work" className="w-full sm:w-auto">
                  <Button variant="secondary" className="py-4 md:py-5 text-lg">
                    View Case Studies
                  </Button>
                </Link>
              </Magnetic>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-8">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop"
                ].map((src, i) => (
                  <img key={i} src={src} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white object-cover shadow-sm" alt="User" />
                ))}
              </div>
              <p className="text-sm font-dm-sans font-medium text-gray-500">
                <span className="text-brand-black font-bold">500+</span> happy clients worldwide
              </p>
            </div>
          </div>
          
          {/* RESPONSIVE: Visual hidden on small mobile, shown on larger screens */}
          <div className="w-full lg:w-2/5 relative mt-12 lg:mt-0">
            <div className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl -rotate-2 sm:-rotate-3 hover:rotate-0 transition-transform duration-500 group">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop" 
                alt="Digital Agency Office" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Floating Cards: Scaled down for mobile */}
            <Card className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 z-20 py-3 sm:py-4 px-4 sm:px-6 shadow-2xl animate-bounce delay-300">
              <div className="flex items-center gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg text-green-600"><CheckCircle2 size={20} className="sm:w-6 sm:h-6" /></div>
                <div>
                  <p className="font-syne font-bold text-brand-black text-sm sm:text-base">250+</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Projects Delivered</p>
                </div>
              </div>
            </Card>
            <Card className="absolute -top-6 -right-2 sm:-top-10 sm:-right-4 z-20 py-3 sm:py-4 px-4 sm:px-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg text-amber-600"><Star size={20} className="sm:w-6 sm:h-6" fill="currentColor" /></div>
                <div>
                  <p className="font-syne font-bold text-brand-black text-sm sm:text-base">4.9/5</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Client Rating</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 🤝 Clients Strip */}
      <div className="bg-gray-50 border-y border-gray-100 py-8 md:py-12 overflow-hidden">
        <p className="text-center text-gray-400 text-[10px] sm:text-xs md:text-sm font-dm-sans uppercase tracking-[0.2em] mb-6 md:mb-8">Trusted by industry leaders</p>
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] px-6 gap-12 md:gap-24">
          <div className="flex items-center gap-12 md:gap-24 font-syne font-bold text-xl md:text-2xl text-gray-200 uppercase grayscale">
             <span>TechVibe</span> <span>FlowUI</span> <span>Stellar</span> <span>Nexus</span> <span>Prism</span> <span>Vertex</span> <span>Loom</span> <span>Pulse</span>
          </div>
          <div className="flex items-center gap-12 md:gap-24 font-syne font-bold text-xl md:text-2xl text-gray-200 uppercase grayscale">
             <span>TechVibe</span> <span>FlowUI</span> <span>Stellar</span> <span>Nexus</span> <span>Prism</span> <span>Vertex</span> <span>Loom</span> <span>Pulse</span>
          </div>
        </div>
      </div>

      {/* ✨ Services Preview */}
      <section ref={serviceRef} className="py-20 md:py-32 px-6 sm:px-8 md:px-12 max-w-7xl mx-auto opacity-0 translate-y-8 transition-all duration-700">
        <SectionTitle 
          subtitle="What We Do" 
          title="Elevate Your Brand with Expert Solutions" 
          centered 
        />
        {/* RESPONSIVE: Stack on mobile, grid on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: LayoutIcon, title: "UI/UX Design", desc: "Crafting intuitive and engaging human-centered digital experiences." },
            { icon: Code, title: "Web Development", desc: "Building scalable, high-performance websites using modern technologies." },
            { icon: Heart, title: "Brand Strategy", desc: "Defining your unique brand voice and positioning in the marketplace." }
          ].map((service, idx) => (
            <Card key={idx} className="group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-accent-light text-brand-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                <service.icon size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-syne font-bold mb-3 md:mb-4">{service.title}</h3>
              <p className="text-gray-600 font-dm-sans mb-6 text-sm md:text-base leading-relaxed">{service.desc}</p>
              <Link to="/services" className="inline-block">
                <Button variant="ghost">Learn more <ArrowRight size={18} /></Button>
              </Link>
            </Card>
          ))}
        </div>
        <div className="mt-12 md:mt-16 text-center">
            <Link to="/services" className="inline-block w-full sm:w-auto">
                <Button variant="secondary">View All Services</Button>
            </Link>
        </div>
      </section>

      {/* 💬 Testimonials */}
      <section className="py-20 md:py-32 px-6 sm:px-8 md:px-12 bg-gray-50 overflow-hidden text-center md:text-left">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            subtitle="Testimonials" 
            title="What Our Clients Say" 
            centered 
          />
          {/* RESPONSIVE: Grid stacking */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                text: "The level of detail and creativity they brought to or project was outstanding. Our conversion rate increased by 40% after the redesign.",
                author: "Sarah Johnson",
                role: "CEO at TechFlow",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"
              },
              { 
                text: "Easily the best agency we've worked with. They don't just build websites; they build digital ecosystems that actually drive results.",
                author: "Michael Chen",
                role: "Marketing Director at Stellix",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
              },
              { 
                text: "Minimalist design with maximum impact. They understood our brand vision perfectly and delivered beyond our expectations.",
                author: "Elena Rodriguez",
                role: "Founder of VibeMode",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop"
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="relative p-8! md:p-10! text-left">
                <div className="text-brand-accent/5 absolute top-4 right-6 md:top-6 md:right-8">
                   <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H12.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V12C6.017 12.5523 5.56929 13 5.017 13H4.017V21H6.017Z"/></svg>
                </div>
                <p className="text-base md:text-lg text-gray-600 font-dm-sans italic mb-6 md:mb-8 relative z-10 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover" alt={testimonial.author} />
                  <div>
                    <h4 className="font-syne font-bold text-gray-900 text-sm md:text-base">{testimonial.author}</h4>
                    <p className="text-xs md:text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 📊 Numbers / Stats */}
      <section ref={statsRef} className="bg-brand-black py-16 md:py-24 px-6 sm:px-8 md:px-12 opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
           {[
             { label: "Projects", val: "250+" },
             { label: "Satisfaction", val: "98%" },
             { label: "Clutch Rating", val: "5.0" },
             { label: "Years Exp", val: "7+" }
           ].map((stat, idx) => (
             <div key={idx} className="space-y-1">
               <p className="text-4xl sm:text-5xl md:text-6xl font-syne font-extrabold text-brand-accent">{stat.val}</p>
               <p className="text-gray-500 font-dm-sans uppercase tracking-[0.2em] text-[10px] md:text-xs">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* 💡 CTA Banner */}
      <section className="py-20 md:py-32 px-6 sm:px-8 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto bg-brand-accent rounded-4xl sm:rounded-4xl p-8 sm:p-12 md:p-20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-syne font-bold text-white leading-tight">Ready to Build Something Amazing?</h2>
            <p className="text-brand-accent-light text-base md:text-xl font-dm-sans opacity-90">Let's talk about your project and see how we can help you grow.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="white">Start Project</Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button variant="outlineWhite">See Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

