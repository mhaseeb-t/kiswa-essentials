import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock } from 'lucide-react';
import { setUser, setToken } from '../../store/slices/authSlice';
import { clearWishlist, syncWishlist } from '../../store/slices/wishlistSlice';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoginError('');
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(result.message || 'Login failed');
        return;
      }

      dispatch(setToken(result.token));
      dispatch(setUser(result.user));

      // Sync wishlist from server
      try {
        const wishlistRes = await fetch(`${API_URL}/wishlist`, {
          headers: { 'Authorization': `Bearer ${result.token}` },
        });
        const wishlistData = await wishlistRes.json();
        if (wishlistData.items) {
          dispatch(syncWishlist(wishlistData.items));
        }
      } catch {
        // Wishlist sync failed - keep local state
      }

      navigate('/');
    } catch {
      setLoginError('Unable to connect to server. Please try again.');
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
          <h1 className="font-display text-3xl text-[#f8f4ef] mb-2">Welcome Back</h1>
          <p className="text-[#6b6b6b]">Sign in to continue shopping</p>
        </div>

        {/* Form Container */}
        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8">
          {(loginError || error) && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-shake">
              {loginError || error}
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

            {/* Password */}
            <div>
              <label className="block text-sm text-[#a8a4a0] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
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

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-[#c9b89a] hover:text-[#d4c9a8] transition-colors">
                Forgot password?
              </Link>
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
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#2a2a2e]" />
            <span className="text-xs text-[#6b6b6b] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[#2a2a2e]" />
          </div>

          {/* Demo Credentials */}
          <div className="bg-[#0c0c0e] rounded-xl p-4 mb-6">
            <p className="text-xs text-[#6b6b6b] mb-2 text-center">Demo Credentials</p>
            <div className="space-y-1 text-xs text-[#a8a4a0]">
              <p><span className="text-[#c9b89a]">Admin:</span> admin@kiswa.com / password</p>
              <p><span className="text-[#c9b89a]">Staff:</span> staff@kiswa.com / password</p>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-[#6b6b6b]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#c9b89a] hover:text-[#d4c9a8] font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;