import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sparkles, Mail, ArrowRight, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Something went wrong');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-6 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-arabesque opacity-10" />

      <div className="relative w-full max-w-md animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-[#c9b89a]" />
            <span className="font-display text-2xl tracking-[0.25em] text-[#f8f4ef]">KISWA</span>
          </Link>
          <h1 className="font-display text-3xl text-[#f8f4ef] mb-2">Reset Password</h1>
          <p className="text-[#6b6b6b]">Enter your email to receive a reset link</p>
        </div>

        {/* Success Message */}
        {submitted ? (
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-[#c9b89a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#c9b89a]" />
            </div>
            <h2 className="font-display text-xl text-[#f8f4ef] mb-3">Check Your Email</h2>
            <p className="text-[#6b6b6b] mb-8">
              If an account exists with that email, you will receive a password reset link.
              Please check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[#c9b89a] hover:text-[#d4c9a8] transition-colors font-medium"
            >
              <ArrowRight className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          /* Form Container */
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm text-[#a8a4a0] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50 transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#0c0c0e]/30 border-t-[#0c0c0e] rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <p className="text-center text-[#6b6b6b] mt-6">
              Remember your password?{' '}
              <Link to="/login" className="text-[#c9b89a] hover:text-[#d4c9a8] font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;