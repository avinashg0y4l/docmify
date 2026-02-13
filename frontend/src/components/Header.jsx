
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                        <FileText size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">docmify</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/tools" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Tools</Link>
                    <Link to="/features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Features</Link>
                    <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Pricing</Link>
                    <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Contact</Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Log in</Link>
                    <Link to="/signup" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-all hover:shadow-lg">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 shadow-lg">
                    <nav className="flex flex-col gap-4">
                        <Link to="/tools" className="text-base font-medium text-slate-600" onClick={() => setIsOpen(false)}>Tools</Link>
                        <Link to="/contact" className="text-base font-medium text-slate-600" onClick={() => setIsOpen(false)}>Contact</Link>
                        <hr className="border-slate-100" />
                        <Link to="/login" className="text-base font-medium text-slate-600" onClick={() => setIsOpen(false)}>Log in</Link>
                        <Link to="/signup" className="w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white" onClick={() => setIsOpen(false)}>
                            Get Started
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
