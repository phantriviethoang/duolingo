import React from "react";

function About() {
    return (
        <div className="min-h-screen bg-base-100">

            {/* Hero */}
            <div className="hero bg-base-200 py-20">
                <div className="hero-content text-center">
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-bold">About Our Platform</h1>
                        <p className="py-6">
                            Our English multiple-choice exam platform helps students
                            practice grammar, vocabulary, and reading skills through
                            thousands of interactive questions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission */}
            <section className="max-w-5xl mx-auto py-16 px-6">
                <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>

                <p className="text-center text-gray-500">
                    We aim to make English exam preparation easier, smarter,
                    and more accessible for students everywhere. Our system
                    provides realistic exam simulations, instant feedback,
                    and detailed explanations.
                </p>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-12">
                    What We Offer
                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="card bg-base-200 shadow">
                        <div className="card-body">
                            <h3 className="card-title">Practice Tests</h3>
                            <p>
                                Thousands of multiple-choice questions covering grammar,
                                vocabulary, and reading comprehension.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow">
                        <div className="card-body">
                            <h3 className="card-title">Instant Feedback</h3>
                            <p>
                                Get immediate results and explanations after finishing
                                each test.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow">
                        <div className="card-body">
                            <h3 className="card-title">Progress Tracking</h3>
                            <p>
                                Track your performance over time and focus on weak
                                areas to improve faster.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Stats */}
            <section className="bg-base-200 py-16">
                <div className="max-w-5xl mx-auto stats stats-vertical md:stats-horizontal shadow">

                    <div className="stat">
                        <div className="stat-title">Students</div>
                        <div className="stat-value">12K+</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">Questions</div>
                        <div className="stat-value">5,000+</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">Practice Tests</div>
                        <div className="stat-value">300+</div>
                    </div>

                </div>
            </section>

        </div>
    );
}

export default About;
