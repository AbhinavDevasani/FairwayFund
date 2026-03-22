import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Trophy, CreditCard, Heart, Award, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [scoresRes, winningsRes] = await Promise.all([
          api.get('/users/scores'),
          api.get('/winner/my')
        ]);
        
        if (scoresRes.data.success) setScores(scoresRes.data.data.slice(0, 5));
        if (winningsRes.data.success) setWinnings(winningsRes.data.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-text mb-1">Welcome back, {user?.name.split(' ')[0]}</h1>
        <p className="text-brand-muted text-base">Here's your Fairway Fund status overview.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Subscription Card */}
        <div className="bg-brand-card rounded-xl p-6 shadow-sm border border-brand-border">
          <h2 className="text-lg font-bold text-brand-text mb-5 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-muted" strokeWidth={1.5} />
            Subscription Plan
          </h2>
          {user?.isSubscribed ? (
            <div>
              <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-green-200">
                Active &middot; {user.subscriptionPlan}
              </div>
              <p className="text-brand-muted text-sm border-t border-brand-border pt-4">You're actively contributing to the prize pool and charity every month.</p>
            </div>
          ) : (
            <div>
               <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-brand-sidebar text-brand-muted text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-border">
                Inactive
              </div>
              <p className="text-brand-muted text-sm mb-5">Subscribe to enter the draw and support a charity.</p>
              <Link to="/subscription" className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg text-sm font-semibold hover:bg-brand-accent-hover transition-colors shadow-sm">
                Subscribe Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {}
        <div className="bg-brand-card rounded-xl p-6 shadow-sm border border-brand-border">
          <div className="flex justify-between items-start mb-5">
            <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-muted" strokeWidth={1.5} />
              Supported Charity
            </h2>
            {user?.selectedCharity && (
              <Link to="/charity" className="text-xs font-medium text-brand-accent hover:underline">Change</Link>
            )}
          </div>
          
          {user?.selectedCharity ? (
            <div>
              <h3 className="text-base font-semibold text-brand-text mb-2">{user.selectedCharity.name}</h3>
              <p className="text-brand-muted text-sm line-clamp-2 border-t border-brand-border pt-4">{user.selectedCharity.description}</p>
            </div>
          ) : (
            <div>
              <p className="text-brand-muted text-sm mb-5">You haven't selected a charity to support yet.</p>
              <Link to="/charity" className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 bg-white border border-brand-border text-brand-text rounded-lg text-sm font-semibold hover:bg-brand-sidebar transition-colors shadow-sm">
                Select a Charity <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
         {/* Recent Scores */}
         <div className="bg-brand-card rounded-xl p-0 shadow-sm border border-brand-border overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-brand-border bg-white">
            <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
              <Trophy className="w-5 h-5 text-brand-muted" strokeWidth={1.5} />
              Recent Scores
            </h2>
            <Link to="/scores" className="text-xs font-medium text-brand-accent hover:underline">View All</Link>
          </div>
          
          {scores.length > 0 ? (
            <div className="divide-y divide-brand-border">
              {scores.map((score, i) => (
                <div key={score._id} className="flex justify-between items-center px-5 py-3.5 bg-white hover:bg-brand-sidebar transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-sidebar text-brand-muted border border-brand-border">#{i+1}</span>
                    <span className="text-brand-muted text-sm">
                      {new Date(score.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="font-bold text-base text-brand-text">{score.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6">
              <Trophy className="w-10 h-10 text-brand-border mx-auto mb-3" strokeWidth={1} />
              <p className="text-brand-text font-medium text-sm mb-1">No scores logged</p>
              <p className="text-brand-muted text-sm mb-4">Start tracking your performance.</p>
              <Link to="/scores" className="text-brand-accent text-sm font-medium hover:underline">Add Score</Link>
            </div>
          )}
        </div>

         {/* Winnings Overview */}
         <div className="bg-brand-card rounded-xl p-0 shadow-sm border border-brand-border overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-brand-border bg-white">
            <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-muted" strokeWidth={1.5} />
              Winnings Overview
            </h2>
            <Link to="/winners" className="text-xs font-medium text-brand-accent hover:underline">View All</Link>
          </div>
          
          {winnings.length > 0 ? (
            <div className="divide-y divide-brand-border">
               {winnings.slice(0,3).map((w) => (
                 <div key={w._id} className="flex justify-between items-center px-5 py-3.5 bg-white hover:bg-brand-sidebar transition-colors">
                    <div>
                      <p className="font-semibold text-brand-text text-sm mb-0.5">Match {w.matchCount}</p>
                      <p className="text-xs text-brand-muted">
                        {new Date(w.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={
                         `text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                         ${w.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                           w.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                           w.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                           'bg-yellow-50 text-yellow-700 border-yellow-200'}`
                       }>
                         {w.status}
                       </span>
                       <p className="font-bold text-base text-brand-text">${w.prizeAmount.toFixed(2)}</p>
                    </div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6">
              <Award className="w-10 h-10 text-brand-border mx-auto mb-3" strokeWidth={1} />
              <p className="text-brand-text font-medium text-sm mb-1">No winnings yet</p>
              <p className="text-brand-muted text-sm">Keep playing to enter the monthly draw.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
