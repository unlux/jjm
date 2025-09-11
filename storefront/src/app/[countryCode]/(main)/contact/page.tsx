"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        agreementChecked: false,
    });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, agreementChecked: e.target.checked });
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      // POST to Next.js route handler in the storefront
      const resp = await fetch(`/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (resp.ok) {
        setSuccess("Thank you for your message! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          agreementChecked: false,
        });
      } else {
        const data = await resp.json().catch(() => null);
        setError(data?.details?.[0] || data?.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setError(
        err?.message || "Unable to send your message right now. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

    return (
        <section className="bg-gray-50 py-16 px-4 md:px-10 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <p className="uppercase text-sm font-medium tracking-wider text-gray-600 mb-2">
                        CONTACT US
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 leading-tight">
                        Have Questions?
                        <br />
                        Get in touch!
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-center">
                    {/* Left side - Image */}
                    <div className="bg-gray-100 rounded-lg overflow-hidden max-w-md mx-auto">
                        <Image
                            src="/contactus-pic.jpg"
                            alt="Contact The Joy Junction"
                            width={300}
                            height={300}
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Right side - Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                              <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm">
                                {error}
                              </div>
                            )}
                            {success && (
                              <div className="rounded-md border border-green-200 bg-green-50 text-green-700 px-4 py-2 text-sm">
                                {success}
                              </div>
                            )}
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Name field */}
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full py-3 pl-10 pr-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Email field */}
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full py-3 pl-10 pr-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Phone field */}
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full py-3 pl-10 pr-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Subject field */}
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="Subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full py-3 pl-10 pr-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Message field */}
                            <div className="relative">
                                <span className="absolute left-3 top-4 text-gray-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                <textarea
                                    name="message"
                                    placeholder="How can we help you? Feel free to get in touch!"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full py-3 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                ></textarea>
                            </div>

                            {/* Agreement checkbox */}
                            <div className="flex items-start space-x-3 mt-2">
                                <div className="flex items-center h-5 mt-0.5">
                                    <input
                                        type="checkbox"
                                        id="agreement"
                                        checked={formData.agreementChecked}
                                        onChange={handleCheckboxChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-150 cursor-pointer"
                                        required
                                    />
                                </div>
                                <label
                                    htmlFor="agreement"
                                    className="text-sm text-gray-700 leading-5"
                                >
                                    I agree that my submitted data is being{' '}
                                    <a href="/privacy" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150">
                                        collected and stored
                                    </a>
                                    .
                                </label>
                            </div>

                            {/* Submit button */}
                            <div className="mt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                    {submitting ? "Sending..." : "Get In Touch"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">
                        Find Us in Jaipur
                    </h2>
                    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624477!2d75.65046970649679!3d26.88544791796718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1625832766380!5m2!1sen!2sin"
                            className="w-full h-full border-0"
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Map of Jaipur, Rajasthan"
                            aria-label="Map showing our location in Jaipur, Rajasthan"
                        ></iframe>
                    </div>
                    <div className="flex items-center justify-center mt-4 text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p>The Joy Junction, Jaipur, Rajasthan, India</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
