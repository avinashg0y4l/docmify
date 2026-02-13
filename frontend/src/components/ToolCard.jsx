
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ToolCard = ({ icon: Icon, title, description, link }) => {
    return (
        <Link
            to={link}
            className="group relative flex flex-col items-start gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-xl hover:-translate-y-1 hover:ring-primary/20"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon size={24} strokeWidth={2} />
            </div>
            <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
            <div className="mt-auto flex items-center font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Try now <ArrowRight size={16} className="ml-1" />
            </div>
        </Link>
    );
};

export default ToolCard;
