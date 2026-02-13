
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-300">
            <div className="container mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="flex flex-col gap-4">
                    <Link to="/" className="flex items-center gap-2 text-white">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                            <FileText size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">docmify</span>
                    </Link>
                    <p className="text-sm text-slate-400 max-w-xs">
                        The all-in-one PDF solution for productive people. Merge, split, compress, and edit PDFs with ease.
                    </p>
                </div>

                {/* Products */}
                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
                    <ul className="flex flex-col gap-2">
                        <li><Link to="/compress" className="text-sm hover:text-white transition-colors">Compress PDF</Link></li>
                        <li><Link to="/merge" className="text-sm hover:text-white transition-colors">Merge PDF</Link></li>
                        <li><Link to="/split" className="text-sm hover:text-white transition-colors">Split PDF</Link></li>
                        <li><Link to="/pdf-to-word" className="text-sm hover:text-white transition-colors">PDF to Word</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
                    <ul className="flex flex-col gap-2">
                        <li><Link to="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
                        <li><Link to="/contact" className="text-sm hover:text-white transition-colors">Contact</Link></li>
                        <li><Link to="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Follow Us</h3>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-white"><Twitter size={18} /></a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-white"><Facebook size={18} /></a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-white"><Linkedin size={18} /></a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-white"><Github size={18} /></a>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} docmify. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
