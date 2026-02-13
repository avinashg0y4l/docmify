import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToolCard from '../components/ToolCard';
import { motion } from 'framer-motion';
import Link from 'react-router-dom'; // Assuming Link might be needed, but strictly moving SEO
import { FileText, Scissors, Layers, Settings, Image as ImageIcon, Briefcase, Zap, Shield, Repeat } from 'lucide-react';
import SEO from '../components/SEO';

const tools = [
    { title: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: Settings, link: "/compress", color: "text-rose-600 bg-rose-100" },
    { title: "Merge PDF", description: "Combine PDFs in the order you want with the easiest PDF merger available.", icon: Layers, link: "/merge", color: "text-rose-600 bg-rose-100" },
    { title: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: Scissors, link: "/split", color: "text-rose-600 bg-rose-100" },
    { title: "PDF to Word", description: "Convert your PDF to WORD documents with incredible accuracy.", icon: FileText, link: "/pdf-to-word", color: "text-blue-600 bg-blue-100" },
    { title: "Word to PDF", description: "Make DOC and DOCX files easy to read by converting them to PDF.", icon: FileText, link: "/word-to-pdf", color: "text-blue-600 bg-blue-100" },
    { title: "PDF to Powerpoint", description: "Turn your PDF files into easy to edit PPT and PPTX slideshows.", icon: Briefcase, link: "/pdf-to-ppt", color: "text-orange-600 bg-orange-100" },
    { title: "Excel to PDF", description: "Make EXCEL spreadsheets easy to read by converting them to PDF.", icon: FileText, link: "/excel-to-pdf", color: "text-green-600 bg-green-100" },
    { title: "Edit PDF", description: "Add text, images, shapes or freehand annotations to a PDF document.", icon: FileText, link: "/edit-pdf", color: "text-purple-600 bg-purple-100" },
    { title: "PDF to JPG", description: "Convert each PDF page into a JPG or extract all images contained in a PDF.", icon: ImageIcon, link: "/pdf-to-jpg", color: "text-yellow-600 bg-yellow-100" },
    { title: "Sign PDF", description: "Sign a document and request signatures. Draw your signature or sign PDF files.", icon: FileText, link: "/sign-pdf", color: "text-red-600 bg-red-100" },
    { title: "Watermark", description: "Stamp an image or text over your PDF in seconds. Choose typography, transparency and position.", icon: FileText, link: "/watermark", color: "text-red-600 bg-red-100" },
    { title: "Rotate PDF", description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!", icon: Repeat, link: "/rotate-pdf", color: "text-sky-600 bg-sky-100" },
];

const features = [
    { title: "Lightning Fast", desc: "Process your documents in seconds with our optimized engine.", icon: Zap },
    { title: "Secure & Private", desc: "Files are automatically deleted after 1 hour. We don't read your content.", icon: Shield },
    { title: "No Installation", desc: "Works entirely in your browser. No software to download.", icon: Layers },
];



const Home = () => {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased overflow-x-hidden">
            <SEO />
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 text-white py-24 sm:py-32">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]" />
                </div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
                            Every tool you need to work with PDFs in one place
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Tools Grid Section */}
            <main className="flex-1 container mx-auto px-4 py-16 -mt-20 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {tools.map((tool, index) => (
                        <ToolCard key={index} {...tool} />
                    ))}
                </motion.div>
            </main>

            {/* Features Section */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why choose Docmify?</h2>
                        <p className="text-slate-600">We make PDF editing easy, fast, and secure for everyone.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {features.map((feature, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
