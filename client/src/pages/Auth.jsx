import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock, User as UserIcon } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    interests: 'AI, Web Dev'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.interests.split(',').map(i => i.trim())
        );
      }
      navigate('/');
    } catch (err) {
      alert("Error during authentication");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl opacity-10 transform translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary rounded-full blur-3xl opacity-10 transform -translate-x-12 translate-y-12"></div>

        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="bg-primary p-3 rounded-xl mb-4 shadow-lg shadow-primary/30">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            {isLogin ? 'Welcome Back' : 'Join SmartAlerts'}
          </h2>
          <p className="text-slate-500 text-sm mt-2 text-center">
            Your personal AI guide to hackathons & internships
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-slate-400"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-slate-400"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-slate-400"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                placeholder="Interests (e.g. AI, Web Dev, React)"
                className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-slate-400"
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-primary-hover shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-0.5 transition-all"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative z-10 mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-600 hover:text-primary transition-colors text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
