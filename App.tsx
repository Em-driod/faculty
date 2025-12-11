import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { login, register } from './services/api';
import OtpForm from './components/OtpForm'; // Import OtpForm

type FormState = 'login' | 'register';

export default function App() {
  const [formState, setFormState] = useState<FormState>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false); // New state for OTP form
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null); // New state for logged-in username

  const handleFormSwitch = (state: FormState) => {
    setFormState(state);
    setError('');
    setIsSuccess(false);
    setMessage('');
    setShowOtpForm(false); // Reset OTP form visibility on form switch
    setLoggedInUsername(null); // Reset logged-in username on form switch
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);
    setMessage('');
    setIsLoading(true);
    setShowOtpForm(false); // Hide OTP form on new submission attempt
    setLoggedInUsername(null); // Reset logged-in username on new submission attempt

    if (!username || !password) {
      setError('Please provide both username and password.');
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (formState === 'login') {
        response = await login(username, password);
      } else {
        response = await register(username, password);
      }
      setMessage(response.message);
      setIsSuccess(true);
      if (response.username) { // Check if username is returned
        setLoggedInUsername(response.username);
      }
      setShowOtpForm(true); // Show OTP form on successful login/registration
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess && showOtpForm && loggedInUsername) { // Conditionally render OtpForm after success
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border-t-4 border-green-500 animate-fade-in-up">
          <p className="text-gray-600 mb-4">Logged in as: {loggedInUsername}</p>
          <OtpForm username={loggedInUsername} /> {/* Pass username to OtpForm */}
          <button
            onClick={() => {
              setIsSuccess(false);
              setShowOtpForm(false); // Reset showOtpForm
              setUsername('');
              setPassword('');
              setLoggedInUsername(null); // Reset loggedInUsername
            }}
            className="w-full py-3.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-[0.99] mt-4"
          >
            Back to Login/Register
          </button>
        </div>
      </div>
    );
  } else if (isSuccess) { // Original success message, if OtpForm is not yet shown
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border-t-4 border-green-500 animate-fade-in-up">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {formState === 'login' ? 'Login Successful' : 'Registration Successful'}
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setShowOtpForm(false); // Reset showOtpForm
              setUsername('');
              setPassword('');
              setLoggedInUsername(null); // Reset loggedInUsername
            }}
            className="w-full py-3.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-[0.99]"
          >
            Back to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden relative z-10 mb-8 border border-white/50">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => handleFormSwitch('login')}
              className={`px-4 py-2 text-sm font-medium ${
                formState === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleFormSwitch('register')}
              className={`px-4 py-2 text-sm font-medium ${
                formState === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex items-start gap-3 text-sm animate-pulse-slow">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-500/10 transition-all outline-none"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-500/10 transition-all outline-none"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold text-sm tracking-wide hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>{formState === 'login' ? 'Login' : 'Register'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}