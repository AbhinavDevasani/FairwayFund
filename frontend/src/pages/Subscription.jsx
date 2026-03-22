import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const Subscription = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const handleSubscribe = async (plan) => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
      const res = await api.post('/subscription/checkout', { plan });
      if (res.data.success) {
        setSuccessMsg(`Successfully subscribed to the ${plan} plan!`);
        await refreshUser(); 
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 text-center">
        <div className="w-16 h-16 bg-brand-sidebar rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-brand-border">
          <CreditCard className="w-8 h-8 text-brand-muted" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-extrabold text-brand-text mb-3">Choose Your Plan</h1>
        <p className="text-brand-muted text-lg max-w-2xl mx-auto">
          Join Fairway Fund to compete for the monthly jackpot and support verified charities.
        </p>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-center font-medium shadow-sm">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-center font-medium shadow-sm">
          {successMsg}
        </div>
      )}

      {user?.isSubscribed ? (
        <div className="bg-brand-card rounded-xl p-10 text-center shadow-sm border border-brand-border">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-brand-text mb-3">You're Subscribed!</h2>
          <p className="text-lg text-brand-muted mb-8">
            Your <span className="font-semibold text-brand-text capitalize">{user.subscriptionPlan}</span> plan is active. 
            You are eligible for the next draw.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {}
          <div className="bg-brand-card rounded-xl p-8 shadow-sm border border-brand-border flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-brand-text mb-1">Monthly</h3>
            <p className="text-brand-muted text-sm mb-6">Billed every month</p>
            <div className="mb-8">
               <span className="text-4xl font-extrabold text-brand-text">$20</span>
               <span className="text-brand-muted font-medium">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-brand-muted text-sm">
                <CheckCircle2 className="w-5 h-5 text-brand-accent" /> Entry to monthly prize draw
              </li>
              <li className="flex items-center gap-3 text-brand-muted text-sm">
                <CheckCircle2 className="w-5 h-5 text-brand-accent" /> Vote for a charity
              </li>
              <li className="flex items-center gap-3 text-brand-muted text-sm">
                <CheckCircle2 className="w-5 h-5 text-brand-accent" /> Log golf scores
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-brand-text bg-white border border-brand-border hover:bg-brand-sidebar hover:text-brand-text disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? 'Processing...' : 'Subscribe Monthly'}
            </button>
          </div>

          {}
          <div className="bg-brand-card rounded-xl p-8 shadow-md border-2 border-brand-accent flex flex-col relative">
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <span className="bg-brand-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Best Value
              </span>
            </div>
            <h3 className="text-xl font-bold text-brand-text mb-1">Yearly</h3>
            <p className="text-brand-muted text-sm mb-6">Billed annually (Save $40)</p>
            <div className="mb-8 text-brand-text">
               <span className="text-4xl font-extrabold">$200</span>
               <span className="text-brand-muted font-medium">/yr</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-brand-muted text-sm">
                <CheckCircle2 className="w-5 h-5 text-brand-accent" /> Entry to monthly prize draw
              </li>
              <li className="flex items-center gap-3 text-brand-muted text-sm">
                <CheckCircle2 className="w-5 h-5 text-brand-accent" /> Vote for a charity
              </li>
              <li className="flex items-center gap-3 text-brand-muted text-sm">
                <CheckCircle2 className="w-5 h-5 text-brand-accent" /> Log golf scores
              </li>
              <li className="flex items-center gap-3 font-semibold text-brand-accent text-sm">
                <CheckCircle2 className="w-5 h-5 text-brand-accent" /> 2 Months Free
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? 'Processing...' : 'Subscribe Yearly'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
