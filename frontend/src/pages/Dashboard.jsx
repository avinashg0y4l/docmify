
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToolCard from '../components/ToolCard';
import {
    FileText, Layers, Scissors, Key, Image, Combine, Minimize,
    Trash, Monitor, FileCode, Search,
    Maximize,
    RotateCw,
    Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const allTools = [
    { icon: Layers, title: "Merge PDF", description: "Combine multiple PDFs into one unified document.", link: "/merge" },
    { icon: Scissors, title: "Split PDF", description: "Split PDF pages or extract specific pages.", link: "/split" },
    { icon: Minimize, title: "Compress PDF", description: "Reduce file size maintaining best quality.", link: "/compress" },
    { icon: Image, title: "PDF to JPG", description: "Convert each PDF page into a JPG image.", link: "/pdf-to-jpg" },
    { icon: Combine, title: "JPG to PDF", description: "Turn your images into a single PDF file.", link: "/jpg-to-pdf" },
    { icon: Lock, title: "Protect PDF", description: "Add password security to your PDF files.", link: "/protect" },
    { icon: Key, title: "Unlock PDF", description: "Remove password security from your PDF files.", link: "/unlock" },
    { icon: FileText, title: "PDF to Word", description: "Convert your PDF to editable Word documents.", link: "/pdf-to-word" },
    { icon: FileCode, title: "Word to PDF", description: "Convert Word documents to PDF format.", link: "/word-to-pdf" },
    { icon: Maximize, title: "Resize PDF", description: "Change the page size of your PDF document.", link: "/resize" },
    { icon: RotateCw, title: "Rotate PDF", description: "Rotate your PDF pages 90, 180 or 270 degrees.", link: "/rotate" },
    { icon: Trash, title: "Delete Pages", description: "Remove specific pages from your PDF file.", link: "/delete-pages" },
];

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTools = allTools.filter(tool =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
            <Header />

            <main className="flex-1 py-12 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            All PDF Tools
                        </h1>
                        <p className="mt-4 text-lg text-slate-600">
                            Make use of our collection of PDF tools to process your digital documents.
                        </p>

                        {/* Search Bar */}
                        <div className="mt-8 relative max-w-lg mx-auto">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-xl border-0 py-4 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                placeholder="Search for tools like 'compress' or 'merge'..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto max-w-7xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {filteredTools.map((tool, index) => (
                            <ToolCard key={index} {...tool} />
                        ))}
                    </motion.div>

                    {filteredTools.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No tools found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
