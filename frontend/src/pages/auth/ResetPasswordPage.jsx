import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sparkles, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Loader, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidationError('No reset token provided');
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/reset-password/${token}`);
        const result = await response.json();

        if (!response.ok) {
          setValidationError(result.message || 'Invalid or expired reset link');
          return;
        }

        setIsValid(true);
      } catch {
        setValidationError('Unable to validate reset link. Please try again.');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setValidationError(result.message || 'Something went wrong');
        return;
      }

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch {
      setValidationError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { met: password?.length >= 8, text: 'At least 8 characters' },
    { met: password?.match(/[A-Z]/), text: 'One uppercase letter' },
    { met: password?.match(/[0-9]/), text: 'One number' },
  ];

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-6 py-20">
        <div className="text-center">
          <Loader className="w-8 h-8 text-[#c9b89a] animate-spin mx-auto mb-4" />
          <p className="text-[#6b6b6b]">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (validationError && !isValid) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 pattern-arabesque opacity-10" />

        <div className="relative w-full max-w-md animate-fadeInUp">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-[#c9b89a]" />
              <span className="font-display text-2xl tracking-[0.25em] text-[#f8f4ef]">KISWA</span>
            </Link>
          </div>

          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="font-display text-xl text-[#f8f4ef] mb-3">Invalid Reset Link</h2>
            <p className="text-[#6b6b6b] mb-8">{validationError}</p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-[#c9b89a] hover:text-[#d4c9a8] transition-colors font-medium"
            >
              Request New Link
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 pattern-arabesque opacity-10" />

        <div className="relative w-full max-w-md animate-fadeInUp">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-[#c9b89a]" />
              <span className="font-display text-2xl tracking-[0.25em] text-[#f8f4ef]">KISWA</span>
            </Link>
          </div>

          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-[#c9b89a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#c9b89a]" />
            </div>
            <h2 className="font-display text-xl text-[#f8f4ef] mb-3">Password Reset Complete</h2>
            <p className="text-[#6b6b6b] mb-8">Your password has been successfully reset.</p>
            <p className="text-[#a8a4a0] text-sm mb-6">Redirecting to login...</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[#c9b89a] hover:text-[#d4c9a8] transition-colors font-medium"
            >
              Sign In Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Reset form
  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 pattern-arabesque opacity-10" />

      <div className="relative w-full max-w-md animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-[#c9b89a]" />
            <span className="font-display text-2xl tracking-[0.25em] text-[#f8f4ef]">KISWA</span>
          </Link>
          <h1 className="font-display text-3xl text-[#f8f4ef] mb-2">Set New Password</h1>
          <p className="text-[#6b6b6b]">Create a strong password for your account</p>
        </div>

        {/* Form Container */}
        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm text-[#a8a4a0] mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                  })}
                  className="w-full pl-12 pr-12 py-3.5 bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#f8f4ef] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Password Strength */}
            {password && (
              <div className="space-y-2 p-3 bg-[#0c0c0e] rounded-xl">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-[#c9b89a] text-[#0c0c0e]' : 'border border-[#2a2a2e]'}`}>
                      {req.met && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className={req.met ? 'text-[#c9b89a]' : 'text-[#6b6b6b]'}>{req.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-[#a8a4a0] mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className="w-full pl-12 pr-12 py-3.5 bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#f8f4ef] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>
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
                  Reset Password
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
      </div>
    </div>
  );
};

export default ResetPasswordPage;