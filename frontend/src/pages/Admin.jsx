import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Shield, PlayCircle, Check, X, CreditCard } from 'lucide-react';

const Admin = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningDraw, setRunningDraw] = useState(false);
  const [drawResult, setDrawResult] = useState(null);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const res = await api.get('/winner');
      if (res.data.success) {
        setWinners(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load winners", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDraw = async () => {
    if (!window.confirm("Are you sure you want to run the draw for this month?")) return;
    
    setRunningDraw(true);
    try {
      const res = await api.post('/draw/run');
      if (res.data.success) {
        setDrawResult(res.data.data.results);
        fetchWinners(); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to run draw");
    } finally {
      setRunningDraw(false);
    }
  };

  const verifyWinner = async (id, status) => {
    try {
      const res = await api.put(`/winner/${id}/verify`, { status });
      if (res.data.success) {
        setWinners(prev => prev.map(w => w._id === id ? { ...w, status } : w));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update verify status");
    }
  };

  if (loading) return <div className="text-center py-10">Loading admin panel...</div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-sidebar border border-brand-border rounded-xl text-brand-muted">
            <Shield className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-brand-text mb-1">Admin Dashboard</h1>
            <p className="text-brand-muted">Manage draws and verify winners</p>
          </div>
        </div>

        <button
          onClick={handleRunDraw}
          disabled={runningDraw}
          className="flex items-center gap-2 py-2.5 px-5 rounded-lg font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50 shadow-sm transition-colors"
        >
          <PlayCircle className="w-5 h-5" />
          {runningDraw ? 'Running Draw...' : 'Run Monthly Draw'}
        </button>
      </header>

      {drawResult && (
        <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-green-800 mb-1">Draw Successful!</h3>
          <p className="text-sm text-green-700 font-medium">
            5 Matches: {drawResult.fiveMatch} | 4 Matches: {drawResult.fourMatch} | 3 Matches: {drawResult.threeMatch}
          </p>
        </div>
      )}

      <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
        <div className="px-6 py-5 border-b border-brand-border bg-white flex items-center gap-2">
          <h2 className="text-lg font-bold text-brand-text">Winner Verifications</h2>
        </div>
        
        {winners.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-sidebar text-brand-muted text-xs uppercase tracking-wider border-b border-brand-border">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Match</th>
                  <th className="px-6 py-4 font-semibold">Prize</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Proof</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border bg-white">
                {winners.map((w) => (
                  <tr key={w._id} className="hover:bg-brand-sidebar transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-text text-sm">{w.user?.name}</p>
                      <p className="text-xs text-brand-muted">{w.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-brand-text text-sm">{w.matchCount} Matches</p>
                      <p className="text-xs text-brand-muted mt-1">Matched: <span className="font-semibold text-brand-accent">{w.matchedNumbers?.join(', ')}</span></p>
                      <p className="text-[10px] text-brand-muted mt-1">Draw: {w.draw?.winningNumbers?.join(', ')}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-text text-sm">${w.prizeAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${
                        w.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                        w.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        w.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {w.proofImage ? (
                        <a href={`http://localhost:8000${w.proofImage}`} target="_blank" rel="noreferrer" className="text-brand-accent hover:underline font-medium text-xs">
                          View Image
                        </a>
                      ) : (
                        <span className="text-xs text-brand-muted">Not uploaded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {w.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => verifyWinner(w._id, 'approved')} className="p-1.5 text-green-700 bg-white border border-green-200 hover:bg-green-50 rounded-md transition-colors shadow-sm" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => verifyWinner(w._id, 'rejected')} className="p-1.5 text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-md transition-colors shadow-sm" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      {w.status === 'approved' && (
                        <button 
                          onClick={() => verifyWinner(w._id, 'paid')} 
                          className="flex items-center justify-center gap-2 w-full py-1.5 px-3 text-xs font-semibold rounded-md text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors shadow-sm"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Mark Paid
                        </button>
                      )}
                      
                      {(w.status === 'paid' || w.status === 'rejected') && (
                        <span className="text-xs text-brand-muted italic">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
           <div className="p-12 text-center text-brand-muted">
             <Shield className="w-12 h-12 mx-auto text-brand-border mb-3" strokeWidth={1} />
             <p className="text-sm font-semibold text-brand-text mb-1">No winners to verify yet.</p>
             <p className="text-xs">Run the monthly draw to generate records.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
