import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Trophy className="mx-auto h-12 w-12 text-brand-muted" strokeWidth={1.5} />
        <h2 className="mt-6 text-3xl font-extrabold text-brand-text tracking-tight">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-brand-card py-8 px-4 shadow-sm border border-brand-border sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-brand-text">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brand-border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent sm:text-sm text-brand-text transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brand-border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent sm:text-sm text-brand-text transition-colors"
                />
              </div>
            </div>

            {error && <div className="text-red-700 text-sm font-medium bg-red-50 border border-red-200 p-3 rounded-lg shadow-sm">{error}</div>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
             <span className="text-brand-muted">Don't have an account? </span>
             <Link to="/signup" className="font-semibold text-brand-accent hover:underline">
               Sign up here
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
