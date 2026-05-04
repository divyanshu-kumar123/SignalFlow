import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { TrendingUp } from 'lucide-react'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        await register(email, password);
        toast.success('Registration successful! Welcome to SignalFlow.');
      } else {
        await login(email, password);
        toast.success('Logged in successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Authentication failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-800">
        
        <div className="flex flex-col items-center">
          <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
            <TrendingUp className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white tracking-tight">
            {isRegistering ? 'Initialize Account' : 'Access Terminal'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            SignalFlow Real-Time Market Alerts
          </p>
        </div>

        {/* The Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors sm:text-sm"
                placeholder="trader@hcl.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-slate-950 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-all ${isLoading ? 'opacity-70 cursor-wait' : 'hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
            >
              {isLoading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Authenticate')}
            </button>
          </div>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-sm text-slate-400 hover:text-emerald-400 transition-colors font-medium"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering 
              ? 'Already have access? Authenticate' 
              : "No access token? Initialize account"}
          </button>
        </div>
      </div>
    </div>
  );
}