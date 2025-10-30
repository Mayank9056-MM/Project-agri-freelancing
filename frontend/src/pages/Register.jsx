import React, { useState } from 'react';
import { Moon, Sun, Upload, User, Mail, Lock, Eye, EyeOff, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const Register = () => {
  const [theme, setTheme] = useState('dark');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    avatar: null,
    fullName: '',
    email: '',
    password: ''
  });

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would integrate with your AuthContext
    console.log('Form submitted:', formData);
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
                Join Our System
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Start managing your inventory efficiently
              </p>
              <div className="pt-8 space-y-4">
                <div className={`flex items-center gap-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
                  <span>Seamless product management</span>
                </div>
                <div className={`flex items-center gap-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
                  <span>Real-time stock tracking</span>
                </div>
                <div className={`flex items-center gap-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
                  <span>Multi-user access control</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
                isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-200 to-gray-300'
              }`}>
                <User className={`h-7 w-7 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
              </div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create Account
              </h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Register for inventory system
              </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-6">
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create Account
              </h2>
              <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Fill in your details to get started
              </p>
            </div>

            <div className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0 ${
                  isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'
                }`}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className={`h-8 w-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>
                <Label
                  htmlFor="avatar"
                  className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  Upload Avatar
                </Label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </Label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`pl-10 h-10 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                    className={`pl-10 h-10 ${
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
                <Label htmlFor="password" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </Label>
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
                    className={`pl-10 pr-10 h-10 ${
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
                className={`w-full h-10 mt-4 font-semibold transition-all ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white shadow-lg shadow-gray-900/50' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-400/30'
                }`}
              >
                Create Account
              </Button>

              {/* Login Link */}
              <p className={`text-center text-sm pt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <a href="/login" className={`font-medium ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-black'
                } transition-colors`}>
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;