import React from "react";

function Contact() {
    return (
        <div className="min-h-screen bg-base-100">

            {/* Hero */}
            <div className="hero bg-base-200 py-20">
                <div className="hero-content text-center">
                    <div className="max-w-lg">
                        <h1 className="text-5xl font-bold">Contact Us</h1>
                        <p className="py-6">
                            If you have questions about exams, accounts, or features,
                            feel free to contact our support team.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-3xl mx-auto px-6 py-16">

                <div className="card bg-base-200 shadow">
                    <div className="card-body">

                        <h2 className="card-title text-2xl mb-4">
                            Send us a message
                        </h2>

                        <form className="space-y-4">

                            <input
                                type="text"
                                placeholder="Your name"
                                className="input input-bordered w-full"
                            />

                            <input
                                type="email"
                                placeholder="Email address"
                                className="input input-bordered w-full"
                            />

                            <input
                                type="text"
                                placeholder="Subject"
                                className="input input-bordered w-full"
                            />

                            <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="Your message"
                                rows="5"
                            ></textarea>

                            <button className="btn btn-primary w-full">
                                Send Message
                            </button>

                        </form>

                    </div>
                </div>

            </div>

            {/* Contact Info */}
            <div className="bg-base-200 py-12">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-center">

                    <div>
                        <h3 className="font-bold">Email</h3>
                        <p className="text-gray-500">support@examenglish.com</p>
                    </div>

                    <div>
                        <h3 className="font-bold">Office</h3>
                        <p className="text-gray-500">Hanoi, Vietnam</p>
                    </div>

                    <div>
                        <h3 className="font-bold">Phone</h3>
                        <p className="text-gray-500">+84 123 456 789</p>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Contact;
