import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Linkedin, Twitter, Github } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Magnetic from '../components/ui/Magnetic';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        // SYMBOLIC SUBMISSION: Since we don't have a contact backend, we'll simulate success.
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="pt-24 pb-20">
            <section className="px-6 sm:px-8 md:px-12 max-w-7xl mx-auto">
                <SectionTitle 
                  subtitle="Get In Touch" 
                  title="Let's Transform Your Vision Into Reality" 
                  centered 
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mt-20">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="max-w-md space-y-6">
                            <h2 className="text-3xl font-syne font-extrabold text-brand-black">Hate Forms? We've Got You Covered.</h2>
                            <p className="text-gray-500 font-dm-sans leading-relaxed text-lg">Send us an email directly or find us at our headquarters. We respond faster than you can say "Digital Core".</p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { icon: Mail, label: "Email Us", val: "hello@digitalcore.agency", link: "mailto:hello@digitalcore.agency" },
                                { icon: Phone, label: "Call Us", val: "+1 (555) 123-4567", link: "tel:+15551234567" },
                                { icon: MapPin, label: "Visit Us", val: "888 Design District, San Francisco, CA 94103", link: "#" }
                            ].map((item, idx) => (
                                <a key={idx} href={item.link} className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center text-brand-black group-hover:bg-brand-accent group-hover:text-white transition-all duration-300">
                                        <item.icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-dm-sans text-gray-400 font-bold uppercase tracking-[0.15em]">{item.label}</p>
                                        <p className="text-lg font-syne font-bold text-brand-black group-hover:text-brand-accent transition-colors">{item.val}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="pt-8 space-y-6">
                            <p className="text-lg font-dm-sans font-bold text-brand-black">Follow Our Journey</p>
                            <div className="flex gap-4">
                                {[Linkedin, Twitter, Github].map((Icon, i) => (
                                    <Magnetic key={i}>
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-brand-accent hover:text-white transition-all cursor-pointer">
                                            <Icon size={20} />
                                        </div>
                                    </Magnetic>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="p-8 md:p-12 border-brand-accent/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-bl-full pointer-events-none group-hover:bg-brand-accent/10 transition-all duration-700"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-brand-accent-light text-brand-accent rounded-lg shadow-sm"><MessageSquare size={20} /></div>
                                <h3 className="text-2xl font-syne font-bold">Write a Message</h3>
                            </div>
                            
                            {status === 'success' ? (
                                <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                                   <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                                      <Send size={40} />
                                   </div>
                                   <h4 className="text-2xl font-syne font-bold text-gray-900">Message Sent Successfully!</h4>
                                   <p className="text-gray-500 font-dm-sans max-w-xs">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                                   <Button variant="secondary" onClick={() => setStatus('idle')} className="mt-8">Send Another</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-dm-sans font-bold text-gray-600 ml-1">Full Name</label>
                                            <input 
                                               type="text" name="name" required value={formData.name} onChange={handleChange}
                                               className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-dm-sans" 
                                               placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-dm-sans font-bold text-gray-600 ml-1">Email Address</label>
                                            <input 
                                               type="email" name="email" required value={formData.email} onChange={handleChange}
                                               className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-dm-sans" 
                                               placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-dm-sans font-bold text-gray-600 ml-1">Subject</label>
                                        <input 
                                           type="text" name="subject" required value={formData.subject} onChange={handleChange}
                                           className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-dm-sans" 
                                           placeholder="Project Discovery"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-dm-sans font-bold text-gray-600 ml-1">Your Message</label>
                                        <textarea 
                                           name="message" required value={formData.message} onChange={handleChange} rows="5"
                                           className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-dm-sans resize-none" 
                                           placeholder="Tell us a bit about your project..."
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <Button 
                                           type="submit" variant="primary" 
                                           className="w-full! py-5! text-lg!"
                                           disabled={status === 'loading'}
                                        >
                                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Contact;
