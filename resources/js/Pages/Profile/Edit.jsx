import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeft, User, Mail, Target } from 'lucide-react';

export default function ProfileEdit({ auth }) {
    const { data, setData, put, processing, errors } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        current_level: auth.user.current_level,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('profile.update'));
    };

    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    return (
        <AuthenticatedLayout>
            <Head title="Edit Profile" />

            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link href={route('dashboard')}>
                        <button className="btn btn-outline btn-sm mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="text-gray-600">Update your personal information</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="input input-bordered"
                                    placeholder="Enter your name"
                                />
                                {errors.name && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.name}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Email</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="input input-bordered"
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.email}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Current Level</span>
                                </label>
                                <select
                                    value={data.current_level}
                                    onChange={(e) => setData('current_level', e.target.value)}
                                    className="select select-bordered"
                                >
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                                {errors.current_level && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.current_level}</span>
                                    </label>
                                )}
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn btn-primary w-full"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="card bg-base-100 shadow-lg mt-6">
                    <div className="card-body">
                        <h2 className="card-title">Account Info</h2>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm text-gray-600">{auth.user.email}</span>
                            </div>
                            <div className="flex items-center">
                                <Target className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm text-gray-600">Current Level: {auth.user.current_level}</span>
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm text-gray-600">Role: {auth.user.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
