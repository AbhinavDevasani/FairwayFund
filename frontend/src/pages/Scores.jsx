import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Trophy, Plus } from 'lucide-react';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const res = await api.get('/users/scores');
      if (res.data.success) {
        setScores(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load scores", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    if (!newScore) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await api.post('/users/scores', { value: Number(newScore) });
      if (res.data.success) {
        setScores(res.data.data);
        setNewScore('');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add score');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading scores...</div>;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-brand-text mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-brand-muted" strokeWidth={1.5} />
          Your Scores
        </h1>
        <p className="text-brand-muted text-lg">Log your latest scores to participate. Only your 5 most recent scores are kept.</p>
      </header>

      <div className="bg-brand-card rounded-xl p-6 md:p-8 shadow-sm border border-brand-border mb-8">
        <h2 className="text-lg font-bold text-brand-text mb-4">Add New Score</h2>
        <form onSubmit={handleAddScore} className="flex gap-4 items-start">
          <div className="flex-1">
            <input
              type="number"
              min="1"
              max="45"
              required
              placeholder="Enter score (1-45)"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-brand-border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-colors text-brand-text"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg shadow-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {isSubmitting ? 'Adding...' : 'Add Score'}
          </button>
        </form>
      </div>

      <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
        <div className="px-6 py-5 border-b border-brand-border bg-white">
          <h2 className="text-lg font-bold text-brand-text">Score History</h2>
        </div>
        
        {scores.length > 0 ? (
          <div className="divide-y divide-brand-border">
            {scores.map((score, idx) => (
              <div key={score._id} className="p-6 flex items-center justify-between hover:bg-brand-sidebar transition-colors bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-sidebar border border-brand-border flex items-center justify-center font-bold text-brand-muted text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-muted">Date Logged</p>
                    <p className="font-semibold text-brand-text">
                      {new Date(score.date).toLocaleDateString(undefined, { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <p className="text-sm font-medium text-brand-muted hidden sm:block">Score</p>
                  <p className="text-3xl font-extrabold text-brand-text">{score.score}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="p-12 text-center">
             <Trophy className="w-12 h-12 mx-auto text-brand-border mb-4" strokeWidth={1} />
             <p className="text-base font-semibold text-brand-text mb-1">No scores found</p>
             <p className="text-sm text-brand-muted">Add your first score above to start building your record.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Scores;
