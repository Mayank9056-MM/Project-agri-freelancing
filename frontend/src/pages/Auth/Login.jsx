import React, { useState } from 'react';
import { Moon, Sun, Mail, Lock, Eye, EyeOff, LogIn, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const Login = () => {
  const [theme, setTheme] = useState('dark');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would integrate with your AuthContext
    console.log('Login submitted:', formData);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 lg:p-8 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'
    }`}>
      {/* Theme Toggle */}
      <Button
        onClick={toggleTheme}
        variant="ghost"
        size="icon"
        className={`fixed top-4 right-4 lg:top-6 lg:right-6 rounded-full z-50 ${
          isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-black hover:bg-gray-200'
        }`}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      <Card className={`w-full max-w-5xl border-0 shadow-2xl overflow-hidden ${
        isDark ? 'bg-gray-900/50 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'
      }`}>
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Left Side - Welcome Section */}
          <div className={`hidden lg:flex flex-col justify-center items-center p-12 ${
            isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-200 to-gray-300'
          }`}>
            <div className="text-center space-y-6 max-w-md">
              <div className={`mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${
                isDark ? 'bg-gray-700/50' : 'bg-white/50'
              }`}>
                <Package className={`h-10 w-10 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
              </div>
              <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Welcome Back
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Access your inventory management system
              </p>
              <div className="pt-8 space-y-4">
                <div className={`flex items-center gap-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
                  <span>Track products and stock levels</span>
                </div>
                <div className={`flex items-center gap-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
                  <span>Manage inventory efficiently</span>
                </div>
                <div className={`flex items-center gap-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
                  <span>Real-time stock updates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-200 to-gray-300'
              }`}>
                <LogIn className={`h-8 w-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
              </div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Welcome Back
              </h2>
              <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Sign in to your account
              </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sign In
              </h2>
              <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter your credentials to continue
              </p>
            </div>

            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Email
                </Label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`pl-10 h-11 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Password
                  </Label>
                  <a 
                    href="/forgot-password" 
                    className={`text-sm font-medium ${
                      isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                    } transition-colors`}
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`pl-10 pr-10 h-11 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className={`w-full h-11 mt-6 font-semibold transition-all ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white shadow-lg shadow-gray-900/50' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-400/30'
                }`}
              >
                Sign In
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className={`w-full border-t ${
                    isDark ? 'border-gray-800' : 'border-gray-300'
                  }`} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`px-2 ${
                    isDark ? 'bg-gray-900/50 text-gray-500' : 'bg-white/80 text-gray-500'
                  }`}>
                    New to the system?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <Button
                onClick={() => window.location.href = '/register'}
                variant="outline"
                className={`w-full h-11 font-semibold transition-all ${
                  isDark 
                    ? 'border-gray-700 bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white' 
                    : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                }`}
              >
                Create Account
              </Button>

              {/* Footer Text */}
              <p className={`text-center text-xs mt-6 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                By signing in, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;