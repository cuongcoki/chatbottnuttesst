import { FC, useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, Send, CheckCircle } from 'lucide-react';

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Password reset email sent to:', email);
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleTryAgain = () => {
    setIsSuccess(false);
    setEmail('');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-light to-secondary flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-dark/20 rounded-full blur-3xl"></div>
        </div>

        {/* Success Card */}
        <div className="w-full max-w-md relative z-10">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative backdrop-blur-md bg-white/20 border border-white/30 p-4 rounded-full shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
              Check Your Email
            </h1>
            <p className="text-white/80 mb-6">
              We've sent a password reset link to <strong className="text-white">{email}</strong>
            </p>
            <p className="text-white/70 text-sm mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full py-3 backdrop-blur-md bg-white/30 hover:bg-white/40 border border-white/40 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Try Another Email
              </button>
              <a
                href="/login"
                className="block w-full py-3 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200 text-center"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-light to-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-light/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-dark/20 rounded-full blur-3xl"></div>
      </div>

      {/* Forgot Password Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <a
          href="/login"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </a>

        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
              <div className="relative backdrop-blur-md bg-white/20 border border-white/30 p-4 rounded-full shadow-lg">
                <Send className="w-8 h-8 text-white drop-shadow-lg" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2 drop-shadow-lg">
            Forgot Password?
          </h1>
          <p className="text-white/80 text-center mb-8">
            No worries, we'll send you reset instructions
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/10 border ${
                    error ? 'border-red-400/50' : 'border-white/20'
                  } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all`}
                />
              </div>
              {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 backdrop-blur-md bg-white/30 hover:bg-white/40 border border-white/40 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send Reset Link
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;