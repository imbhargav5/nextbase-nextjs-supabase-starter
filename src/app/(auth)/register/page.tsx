'use client';

import { createClient } from '@/supabase-clients/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { validateEmail, validateUsername, sanitizeInput } from '@/lib/security';

export default function RegisterPage() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Input validation
        const emailValidation = validateEmail(email);
        if (!emailValidation) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        const displayNameValidation = validateUsername(displayName);
        if (!displayNameValidation.isValid) {
            setError(displayNameValidation.errors[0]);
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        // Additional password strength check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(password)) {
            setError('Password must contain at least one uppercase letter, lowercase letter, number, and special character');
            setLoading(false);
            return;
        }

        try {
            // Sanitize inputs
            const sanitizedDisplayName = sanitizeInput(displayName);
            const sanitizedEmail = sanitizeInput(email);

            const { error: signUpError } = await supabase.auth.signUp({
                email: sanitizedEmail,
                password,
                options: {
                    data: {
                        display_name: sanitizedDisplayName,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
            } else {
                setError(null);
                // Create profile
                const { data: authData } = await supabase.auth.getUser();
                if (authData.user) {
                    const uniqueUsername = await generateUniqueUsername(sanitizedEmail);
                    await supabase.from('profiles').upsert({
                        id: authData.user.id,
                        display_name: sanitizedDisplayName,
                        username: uniqueUsername,
                        is_verified: false,
                    });
                }
                router.push('/login?registered=true');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to generate unique username
    const generateUniqueUsername = async (email: string): Promise<string> => {
        const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
        return baseUsername;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2">TeamGrid</h1>
                <p className="text-center text-gray-600 mb-8">Create your account</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4 mb-6">
                    <div>
                        <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            id="display_name"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="John Doe"
                            disabled={loading}
                            maxLength={100}
                        />
                        <p className="text-xs text-gray-500 mt-1">3-50 characters, letters, numbers, underscores, and hyphens only</p>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="you@example.com"
                            disabled={loading}
                            maxLength={254}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
                            disabled={loading}
                            minLength={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">At least 8 characters with uppercase, lowercase, number, and special character</p>
                    </div>

                    <div>
                        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirm_password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
                            disabled={loading}
                            minLength={8}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        data-testid="register-submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
