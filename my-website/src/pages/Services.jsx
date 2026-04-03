import React from 'react';
import { Layout as LayoutIcon, Code, Heart, Smartphone, Megaphone, BarChart, ArrowRight } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Magnetic from '../components/ui/Magnetic';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    { 
      icon: LayoutIcon, 
      title: "UI/UX Design", 
      desc: "Creating visually stunning and highly functional interfaces that prioritize user experience and brand identity.",
      features: ["User Research", "Wireframing", "Prototyping", "Visual Identity"]
    },
    { 
      icon: Code, 
      title: "Web Development", 
      desc: "Building fast, secure, and scalable websites using the latest technologies like React, Next.js, and Node.js.",
      features: ["Custom Web Apps", "E-commerce", "Performance Optimization", "SEO Friendly"]
    },
    { 
      icon: Smartphone, 
      title: "Mobile Solutions", 
      desc: "Developing native and cross-platform mobile applications that provide seamless performance on all devices.",
      features: ["iOS & Android", "React Native", "App Store Optimization", "Offline Support"]
    },
    { 
      icon: Heart, 
      title: "Brand Strategy", 
      desc: "Defining your unique value proposition and building a cohesive brand that resonates with your target audience.",
      features: ["Brand Voice", "Logo Design", "Style Guides", "Market Positioning"]
    },
    { 
      icon: Megaphone, 
      title: "Digital Marketing", 
      desc: "Growing your online presence through data-driven marketing campaigns and social media management.",
      features: ["Social Media", "PPC Campaigns", "Email Marketing", "Content Strategy"]
    },
    { 
      icon: BarChart, 
      title: "Analytics & Growth", 
      desc: "Providing deep insights into user behavior and business metrics to drive informed decision-making.",
      features: ["Data Visualization", "Conversion Rate Optimization", "A/B Testing", "User Behavior Logs"]
    }
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="px-6 sm:px-8 md:px-12 max-w-7xl mx-auto mb-20">
        <SectionTitle 
          subtitle="Our Expertise" 
          title="Innovative Solutions for Modern Businesses" 
          centered 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {services.map((service, idx) => (
            <Card key={idx} className="group hover:border-brand-accent/30 transition-all duration-300">
              <div className="w-14 h-14 bg-brand-accent-light text-brand-accent rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-accent group-hover:text-white transition-all">
                <service.icon size={30} />
              </div>
              <h3 className="text-2xl font-syne font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600 font-dm-sans mb-8 leading-relaxed">{service.desc}</p>
              
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2 text-sm text-gray-500 font-dm-sans">
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link to="/contact" className="inline-block w-full">
                <Button variant="ghost" className="w-full justify-between">
                  Inquire Now <ArrowRight size={18} />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-black py-20 px-6 sm:px-8 md:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-syne font-bold text-white leading-tight">Need a Custom Solution?</h2>
          <p className="text-gray-400 text-lg font-dm-sans">We specialize in tailoring our services to meet your specific business requirements and goals.</p>
          <div className="flex justify-center pt-4">
            <Magnetic>
              <Link to="/contact">
                <Button variant="primary" className="px-10 py-5 text-lg">Schedule a Consultation</Button>
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
