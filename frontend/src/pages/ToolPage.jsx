import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // To get current path
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UploadCloud, FileText, X, CheckCircle, Download, Settings, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, API_URL } from '../services/api';

const toolConfig = {
    '/compress': {
        title: "Compress PDF",
        description: "Reduce file size while optimizing for maximal PDF quality.",
        action: "Compress PDF",
        type: 'compress',
        accept: '.pdf',
        multiple: false
    },
    '/merge': {
        title: "Merge PDF",
        description: "Combine PDFs in the order you want with the easiest PDF merger available.",
        action: "Merge PDF",
        type: 'merge',
        accept: '.pdf',
        multiple: true
    },
    '/split': {
        title: "Split PDF",
        description: "Separate one page or a whole set for easy conversion.",
        action: "Split PDF",
        type: 'split',
        accept: '.pdf',
        multiple: false
    },
    // Add others...
};

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const ToolPage = () => {
    const location = useLocation();
    const config = toolConfig[location.pathname] || toolConfig['/compress']; // Default fallback

    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState(null);
    const [compressionLevel, setCompressionLevel] = useState('medium'); // specific to compress

    // Size Estimation Logic
    const originalSize = files.reduce((acc, file) => acc + file.size, 0);
    const getEstimatedSize = () => {
        const ratios = { low: 0.8, medium: 0.6, high: 0.4, extreme: 0.2 };
        return originalSize * (ratios[compressionLevel] || 0.6);
    };

    const [splitRange, setSplitRange] = useState("1");
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(config.multiple ? [...files, ...selectedFiles] : [selectedFiles[0]]);
            setResultUrl(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
            if (droppedFiles.length > 0) {
                setFiles(config.multiple ? [...files, ...droppedFiles] : [droppedFiles[0]]);
                setResultUrl(null);
            }
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFiles(items);
    };

    const handleSubmit = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setProgress(0);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append(config.multiple ? 'files' : 'file', file);
        });

        if (config.type === 'compress') {
            formData.append('level', compressionLevel);
        } else if (config.type === 'split') {
            formData.append('range', splitRange);
        }

        try {
            // Mocking progress for UX since axios progress is upload only usually
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            let response;
            if (config.type === 'compress') {
                response = await api.compress(formData);
            } else if (config.type === 'merge') {
                response = await api.merge(formData);
            } else if (config.type === 'split') {
                // Ensure API method exists
                response = await api.split(formData);
            } else {
                // Placeholder for other tools
                await new Promise(r => setTimeout(r, 2000));
                response = { data: { downloadUrl: '#' } };
            }

            clearInterval(progressInterval);
            setProgress(100);

            // Assume backend returns { downloadUrl: '...' }
            // For now, if backend is placeholder, we might not get a real URL.
            // But let's assume it does or we mock it.
            if (response.data.downloadUrl) {
                // Prepend backend URL if relative
                const baseUrl = API_URL.replace('/api/pdf', '');
                const url = response.data.downloadUrl.startsWith('http')
                    ? response.data.downloadUrl
                    : `${baseUrl}${response.data.downloadUrl}`;
                setResultUrl(url);
            }

        } catch (error) {
            console.error(error);
            alert("An error occurred during processing.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
            <Header />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{config.title}</h1>
                        <p className="mt-4 text-lg text-slate-600">{config.description}</p>
                    </div>

                    {/* Content Area */}
                    <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-8 border border-slate-100 relative">

                        <AnimatePresence mode='wait'>
                            {/* State 1: Upload */}
                            {files.length === 0 && !resultUrl && (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="w-full text-center"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 rounded-xl p-12 hover:bg-slate-50 hover:border-primary transition-all cursor-pointer flex flex-col items-center gap-4"
                                    >
                                        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                                            <UploadCloud size={40} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900">Select PDF files</h3>
                                        <p className="text-slate-500">or drop PDFs here</p>
                                        <button className="bg-primary text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary/30 mt-4 hover:scale-105 transition-transform">
                                            Select PDF files
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept={config.accept}
                                            multiple={config.multiple}
                                            className="hidden"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* State 2: Files Selected / Options */}
                            {files.length > 0 && !resultUrl && (
                                <motion.div
                                    key="options"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="w-full max-w-2xl"
                                >
                                    <div className="flex flex-col gap-4 mb-8">
                                        {config.type === 'merge' ? (
                                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                                <Droppable droppableId="files">
                                                    {(provided) => (
                                                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-3">
                                                            {files.map((file, index) => (
                                                                <Draggable key={`${file.name}-${index}`} draggableId={`${file.name}-${index}`} index={index}>
                                                                    {(provided) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="cursor-grab text-slate-400">
                                                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                                                                                </div>
                                                                                <FileText className="text-primary" />
                                                                                <div>
                                                                                    <div className="font-medium text-slate-900 truncate max-w-xs">{file.name}</div>
                                                                                    <div className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                                                                </div>
                                                                            </div>
                                                                            <button onClick={() => removeFile(index)} className="text-slate-400 hover:text-red-500">
                                                                                <X size={20} />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </DragDropContext>
                                        ) : (
                                            files.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="text-primary" />
                                                        <div>
                                                            <div className="font-medium text-slate-900 truncate max-w-xs">{file.name}</div>
                                                            <div className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeFile(index)} className="text-slate-400 hover:text-red-500">
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                            ))
                                        )}

                                        {config.multiple && (
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex items-center justify-center gap-2 text-primary font-medium p-2 border border-dashed border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                                            >
                                                <UploadCloud size={16} /> Add more files
                                            </button>
                                        )}
                                    </div>

                                    {/* Tool Specific Options - Compression */}
                                    {config.type === 'compress' && (
                                        <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                                    <Settings size={18} /> Compression Level
                                                </h3>
                                                <div className="text-right">
                                                    <div className="text-sm text-slate-500">Estimated Size</div>
                                                    <div className="font-bold text-green-600">
                                                        ~{formatBytes(getEstimatedSize())}
                                                        <span className="text-slate-400 text-xs font-normal"> (from {formatBytes(originalSize)})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                {[
                                                    { id: 'low', label: 'Low Compression', desc: 'High Quality', ratio: '80%' },
                                                    { id: 'medium', label: 'Medium', desc: 'Balanced', ratio: '60%' },
                                                    { id: 'high', label: 'High', desc: 'Smallest Size', ratio: '40%' }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => setCompressionLevel(opt.id)}
                                                        className={`p-4 rounded-lg text-left border-2 transition-all relative overflow-hidden ${compressionLevel === opt.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}
                                                    >
                                                        <div className="font-semibold text-sm relative z-10">{opt.label}</div>
                                                        <div className="text-xs text-slate-500 mt-1 relative z-10">{opt.desc}</div>
                                                        {compressionLevel === opt.id && (
                                                            <div className="absolute top-0 right-0 p-1 bg-primary text-white text-[10px] rounded-bl-lg">
                                                                check
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Custom Target Size Slider (Simulation) */}
                                            <div className="mt-6 pt-6 border-t border-slate-200">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Target Quality: <span className="text-primary font-bold">{compressionLevel === 'low' ? '80%' : compressionLevel === 'medium' ? '60%' : '40%'}</span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="2"
                                                    step="1"
                                                    value={compressionLevel === 'low' ? 0 : compressionLevel === 'medium' ? 1 : 2}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        setCompressionLevel(val === 0 ? 'low' : val === 1 ? 'medium' : 'high');
                                                    }}
                                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                                <div className="flex justify-between text-xs text-slate-500 mt-2">
                                                    <span>High Quality</span>
                                                    <span>Balanced</span>
                                                    <span>Small Size</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tool Specific Options - Split */}
                                    {config.type === 'split' && (
                                        <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                                            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                                <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary">
                                                    <span className="text-xs font-bold">S</span>
                                                </div> Split Pages
                                            </h3>
                                            <div className="space-y-4">
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Enter Page Ranges (e.g. "1-5, 8, 11-13")
                                                </label>
                                                <input
                                                    type="text"
                                                    value={splitRange}
                                                    onChange={(e) => setSplitRange(e.target.value)}
                                                    placeholder="1-5, 8, 11-13"
                                                    className="block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-4"
                                                />
                                                <p className="text-xs text-slate-500">
                                                    Separate single pages with commas (e.g. 1, 5, 10). Use hyphens for ranges (e.g. 1-10).
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-center">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            className={`rounded-xl bg-slate-900 px-12 py-4 text-lg font-semibold text-white shadow-lg transition-all ${processing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                                        >
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <RefreshCw className="animate-spin" /> Processing... {progress}%
                                                </span>
                                            ) : (
                                                //config.action
                                                // TODO: Fix variable reference
                                                `${config.action}`
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* State 3: Success / Download */}
                            {resultUrl && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Task Completed!</h2>
                                    <p className="text-slate-600 mb-8">Your PDF has been processed successfully.</p>

                                    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
                                        <a href={resultUrl} download className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/30 hover:bg-rose-700 hover:scale-105 transition-all">
                                            <Download size={20} /> Download PDF
                                        </a>
                                        <button onClick={() => { setFiles([]); setResultUrl(null); }} className="text-slate-500 hover:text-slate-900 font-medium">
                                            Process another file
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    <div className="mt-8 text-center text-sm text-slate-400">
                        <p>Files are automatically deleted after 60 minutes for your privacy.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ToolPage;
