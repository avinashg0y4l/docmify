
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
            <Header />
            <main className="flex-1 py-12 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Contact Us</h1>
                        <p className="mt-4 text-lg text-slate-600">
                            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="mx-auto max-w-xl bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 sm:p-12">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold leading-6 text-slate-900">Name</label>
                                <input type="text" name="name" id="name" className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-slate-900">Email</label>
                                <input type="email" name="email" id="email" className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-slate-900">Message</label>
                                <textarea name="message" id="message" rows="4" className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"></textarea>
                            </div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
