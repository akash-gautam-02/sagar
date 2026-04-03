import React, { useState } from 'react';
import { Check, X, ArrowRight, Star, HelpCircle } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Link } from 'react-router-dom';

const Pricing = () => {
    const [isYearly, setIsYearly] = useState(false);

    const plans = [
        {
            name: "Basic",
            price: isYearly ? 290 : 29,
            desc: "For solo creators and small projects needing a professional touch.",
            features: ["Custom UI Design", "5 Pages", "SEO Optimization", "Mobile Responsive", "Social Media Pack"],
            notIncluded: ["CMS Support", "Priority Support", "Maintenance"],
            recommended: false
        },
        {
            name: "Pro",
            price: isYearly ? 590 : 59,
            desc: "Advanced features for growing businesses and serious digital presence.",
            features: ["Everything in Basic", "15 Pages", "Advanced CMS", "Speed Optimization", "Animation Suite", "Priority Email Support"],
            notIncluded: ["API Integrations", "Database Setup"],
            recommended: true
        },
        {
            name: "Enterprise",
            price: isYearly ? 1990 : 199,
            desc: "Fully custom enterprise solutions and long-term partnerships.",
            features: ["Everything in Pro", "Unlimited Pages", "Custom API & DB", "24/7 Dedicated Support", "Weekly Maintenance", "Security Audit"],
            notIncluded: [],
            recommended: false
        }
    ];

    return (
        <div className="pt-24 pb-20 overflow-hidden">
            <section className="px-6 sm:px-8 md:px-12 max-w-7xl mx-auto">
                <SectionTitle 
                  subtitle="Invest in Quality" 
                  title="Fair Pricing Plans for Every Digital Need" 
                  centered 
                />

                <div className="flex justify-center mt-12 mb-16">
                    <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-full border border-gray-200">
                        <button 
                           onClick={() => setIsYearly(false)}
                           className={`px-6 py-2.5 rounded-full text-sm font-bold font-dm-sans transition-all duration-300 ${!isYearly ? 'bg-white text-brand-black shadow-md' : 'text-gray-500 hover:text-brand-black'}`}
                        >
                            Monthly
                        </button>
                        <button 
                           onClick={() => setIsYearly(true)}
                           className={`px-6 py-2.5 rounded-full text-sm font-bold font-dm-sans transition-all duration-300 ${isYearly ? 'bg-white text-brand-black shadow-md' : 'text-gray-500 hover:text-brand-black'}`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative flex flex-col p-8 md:p-10 rounded-4xl border-2 transition-all duration-500 bg-white group hover:shadow-2xl hover:scale-[1.02] ${plan.recommended ? 'border-brand-accent shadow-xl' : 'border-gray-100'}`}>
                            {plan.recommended && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                     <Badge className="px-6 py-2 bg-brand-accent text-white border-0 shadow-lg animate-pulse">MOST POPULAR</Badge>
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-2xl font-syne font-bold mb-2 text-brand-black">{plan.name}</h3>
                                <p className="text-gray-500 text-sm font-dm-sans leading-relaxed">{plan.desc}</p>
                            </div>
                            <div className="mb-10 flex items-baseline gap-1">
                                <span className="text-4xl md:text-5xl font-syne font-extrabold text-brand-black">${plan.price}</span>
                                <span className="text-gray-400 font-dm-sans text-lg font-medium">{isYearly ? '/year' : '/month'}</span>
                            </div>
                            
                            <hr className="border-gray-100 mb-10" />

                            <ul className="space-y-4 mb-12 flex-grow">
                                {plan.features.map((f, fi) => (
                                    <li key={fi} className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                            <Check size={14} className="stroke-[3]" />
                                        </div>
                                        <span className="text-sm md:text-base text-gray-600 font-dm-sans">{f}</span>
                                    </li>
                                ))}
                                {plan.notIncluded.map((f, fi) => (
                                    <li key={fi} className="flex items-start gap-3 opacity-40 grayscale">
                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <X size={14} />
                                        </div>
                                        <span className="text-sm md:text-base text-gray-400 font-dm-sans line-through">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/contact" className="w-full">
                                <Button 
                                   variant={plan.recommended ? "primary" : "secondary"} 
                                   className="w-full! py-4! text-lg!"
                                >
                                    Get Started Today <ArrowRight size={20} className="inline ml-2" />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Preview */}
            <section className="mt-24 px-6 md:py-12 bg-gray-50 border-t border-gray-100">
                <div className="max-w-4xl mx-auto space-y-12">
                   <div className="text-center">
                       <h2 className="text-3xl font-syne font-bold mb-4">Quick Questions</h2>
                       <p className="text-gray-500 font-dm-sans">Everything you need to know about the plans.</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {[
                           { q: "Can I upgrade my plan later?", a: "Absolutely! You can upgrade your plan at any time to unlock more features and higher limits." },
                           { q: "Are there any hidden fees?", a: "No hidden fees. The price you see is the price you pay per month or per year." },
                           { q: "Do you offer custom quotes?", a: "Yes, for very specific or large-scale projects, we provide custom quotes after a brief discovery call." },
                           { q: "Is maintenance included?", a: "Maintenance is included in our Enterprise plan, but we offer support packages for Pro and Basic users as well." }
                       ].map((faq, i) => (
                           <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100">
                               <h4 className="font-syne font-bold mb-2 flex items-center gap-2"><HelpCircle size={18} className="text-brand-accent" /> {faq.q}</h4>
                               <p className="text-sm text-gray-500 font-dm-sans leading-relaxed">{faq.a}</p>
                           </div>
                       ))}
                   </div>
                </div>
            </section>
        </div>
    );
};

export default Pricing;
