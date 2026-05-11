import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, User, Check } from 'lucide-react';
import { setUser, setToken } from '../../store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerError, setRegisterError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setRegisterError('');
    try {
      const response = await fetch(`${API_URL}/register?type=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setRegisterError(result.message || 'Registration failed');
        return;
      }

      dispatch(setToken(result.token));
      dispatch(setUser(result.user));
      navigate('/');
    } catch {
      setRegisterError('Unable to connect to server. Please try again.');
    }
  };

  const passwordRequirements = [
    { met: password?.length >= 8, text: 'At least 8 characters' },
    { met: password?.match(/[A-Z]/), text: 'One uppercase letter' },
    { met: password?.match(/[0-9]/), text: 'One number' },
  ];

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
          <h1 className="font-display text-3xl text-[#f8f4ef] mb-2">Create Account</h1>
          <p className="text-[#6b6b6b]">Join our community of fashion enthusiasts</p>
        </div>

        {/* Form Container */}
        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8">
          {registerError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {registerError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm text-[#a8a4a0] mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50 transition-colors"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

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

            {/* Password */}
            <div>
              <label className="block text-sm text-[#a8a4a0] mb-2">Password</label>
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

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors ${
                errors.terms ? 'border-red-500' : 'border-[#2a2a2e] group-hover:border-[#c9b89a]/50'
              }`}>
                <input
                  type="checkbox"
                  {...register('terms', { required: 'You must agree to terms' })}
                  className="sr-only"
                />
                {!errors.terms && (
                  <Check className="w-3 h-3 text-[#c9b89a]" />
                )}
              </div>
              <span className="text-sm text-[#6b6b6b] leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-[#c9b89a] hover:text-[#d4c9a8] transition-colors">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#c9b89a] hover:text-[#d4c9a8] transition-colors">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-400 text-xs">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all flex items-center justify-center gap-2 group"
            >
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-[#6b6b6b] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#c9b89a] hover:text-[#d4c9a8] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;