import { FC, useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/utility/stores/authStore';
import { getFieldError } from '@/utility/lib/errorHandler';

// React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utility/schema/authSchema';
import type { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

const FormLogin: FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const handleInputChange = (fieldName: keyof LoginFormData) => {
    clearErrors(fieldName);
    // Clear API error khi user bắt đầu sửa
    if (error) {
      clearError();
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // Login thành công sẽ được handle trong store (redirect, toast, etc.)
    } catch (err) {
      // Error đã được handle trong store
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="border-4 border-gray-200 mx-auto w-full max-w-sm rounded-3xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-6 sm:p-8 shadow-2xl ring-1 ring-white/20">
      <h2 className="text-center text-white text-xl sm:text-2xl font-extrabold tracking-wider">
        ĐĂNG NHẬP
      </h2>

      {/* Display API Error */}
      {error && (
        <div className="mt-4 rounded-xl bg-red-500/30 backdrop-blur-sm px-4 py-3 text-white text-sm border border-red-300/50">
          <p className="font-semibold">{error.message}</p>
          {error.errors && error.errors.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs">
              {error.errors.map((err, idx) => (
                <li key={idx}>• {err.field}: {err.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        {/* Email */}
        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              {...register('email', { onChange: () => handleInputChange('email') })}
              placeholder="you@example.com"
              disabled={isLoading}
              className={[
                'w-full pl-10 pr-12 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400',
                'border-4 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                errors.email || getFieldError(error, 'email') ? 'border-red-400' : '',
              ].join(' ')}
            />
          </div>
          {/* Hiển thị lỗi validation từ Zod */}
          {errors.email && (
            <p className="text-white/90 text-sm mt-1 bg-red-500/30 rounded px-2 py-1">
              {errors.email.message}
            </p>
          )}
          {/* Hiển thị lỗi từ API */}
          {!errors.email && getFieldError(error, 'email') && (
            <p className="text-white/90 text-sm mt-1 bg-red-500/30 rounded px-2 py-1">
              {getFieldError(error, 'email')}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { onChange: () => handleInputChange('password') })}
              placeholder="••••••••"
              disabled={isLoading}
              className={[
                'w-full pl-10 pr-12 py-3 rounded-xl text-slate-800 bg-white placeholder-slate-400',
                'border-4 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                errors.password || getFieldError(error, 'password') ? 'border-red-400' : '',
              ].join(' ')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-60"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {/* Hiển thị lỗi validation từ Zod */}
          {errors.password && (
            <p className="text-white/90 text-sm mt-1 bg-red-500/30 rounded px-2 py-1">
              {errors.password.message}
            </p>
          )}
          {/* Hiển thị lỗi từ API */}
          {!errors.password && getFieldError(error, 'password') && (
            <p className="text-white/90 text-sm mt-1 bg-red-500/30 rounded px-2 py-1">
              {getFieldError(error, 'password')}
            </p>
          )}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-white/60 disabled:cursor-not-allowed"
            />
            <span className="text-white/90 text-sm">Remember me</span>
          </label>

          <a
            href="/forgot-password"
            className="text-white/90 text-sm underline-offset-4 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/60 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="text-2xl font-bold">Đăng nhập</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default FormLogin;