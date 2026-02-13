import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url = 'https://docmify.com' }) => {
    const defaultTitle = 'Docmify - All-in-One PDF Tools';
    const defaultDescription = 'Free online PDF tools to merge, split, compress, and convert PDF files. Secure and easy to use.';

    return (
        <Helmet>
            <title>{title ? `${title} | Docmify` : defaultTitle}</title>
            <meta name='description' content={description || defaultDescription} />
            <meta property='og:title' content={title ? `${title} | Docmify` : defaultTitle} />
            <meta property='og:description' content={description || defaultDescription} />
            <meta property='og:url' content={url} />
            <meta property='twitter:card' content='summary_large_image' />
            <meta property='twitter:title' content={title ? `${title} | Docmify` : defaultTitle} />
            <meta property='twitter:description' content={description || defaultDescription} />
        </Helmet>
    );
};

export default SEO;
