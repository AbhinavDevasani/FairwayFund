import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { Award, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const Winners = () => {
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputRef = useRef({});

  useEffect(() => {
    fetchWinnings();
  }, []);

  const fetchWinnings = async () => {
    try {
      const res = await api.get('/winner/my');
      if (res.data.success) {
        
        const sorted = res.data.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setWinnings(sorted);
      }
    } catch (err) {
      console.error("Failed to load winnings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProof = async (winnerId, file) => {
    if (!file) return;
    
    setUploadingId(winnerId);
    const formData = new FormData();
    formData.append('proof', file);

    try {
      const res = await api.post(`/winner/${winnerId}/proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        
        setWinnings(prev => prev.map(w => w._id === winnerId ? res.data.data : w));
        alert("Proof uploaded successfully! Awaiting admin verification.");
      }
    } catch (err) {
      console.error("Failed to upload proof", err);
      alert(err.response?.data?.message || "Failed to upload proof.");
    } finally {
      setUploadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Paid</span>;
      case 'approved': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Approved</span>;
      case 'rejected': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Rejected</span>;
      case 'pending': 
      default:
         return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Pending</span>;
    }
  };

  if (loading) return <div className="text-center py-10">Loading winnings...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex items-center gap-4">
        <div className="p-3 bg-brand-sidebar rounded-xl border border-brand-border text-brand-muted">
          <Award className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text mb-1">Your Winnings</h1>
          <p className="text-brand-muted text-lg">Track your prizes and upload proof for payouts.</p>
        </div>
      </header>

      {winnings.length > 0 ? (
        <div className="space-y-6">
          {winnings.map((w) => (
            <div key={w._id} className="bg-brand-card rounded-xl p-6 md:p-8 shadow-sm border border-brand-border flex flex-col md:flex-row gap-6 justify-between items-center transition-shadow hover:shadow-md">
               <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3">
                   <h2 className="text-xl font-bold text-brand-text">Match {w.matchCount}</h2>
                   {getStatusBadge(w.status)}
                 </div>
                 
                 <div className="flex gap-4 text-sm text-brand-muted">
                   <p>Date: <span className="font-semibold text-brand-text">{new Date(w.createdAt).toLocaleDateString()}</span></p>
                   {w.draw && <p>Draw ID: <span className="font-mono text-brand-text">{w.draw._id.slice(-6).toUpperCase()}</span></p>}
                 </div>
                 
                 {w.matchedNumbers?.length > 0 && (
                   <div className="flex items-center gap-3 mt-2">
                     <span className="text-sm font-medium text-brand-muted">Winning Numbers:</span>
                     <div className="flex gap-1.5">
                       {w.matchedNumbers.map((num, i) => (
                         <div key={i} className="w-7 h-7 rounded-sm border border-brand-border bg-brand-sidebar text-brand-text flex items-center justify-center text-xs font-bold shadow-sm">
                           {num}
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               <div className="flex flex-col items-center md:items-end min-w-[200px]">
                 <p className="text-sm font-medium text-brand-muted mb-1">Prize Amount</p>
                 <p className="text-4xl font-extrabold text-brand-text mb-5">${w.prizeAmount.toFixed(2)}</p>
                 
                 {}
                 <div className="w-full">
                    {w.proofImage ? (
                      <div className="flex items-center justify-center md:justify-end gap-2 text-sm text-green-700 font-medium bg-green-50 py-2.5 px-4 rounded-lg border border-green-200 shadow-sm">
                        <CheckCircle2 className="w-4 h-4" /> Proof uploaded
                      </div>
                    ) : w.status === 'pending' ? (
                      <div className="w-full">
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          ref={el => fileInputRef.current[w._id] = el}
                          onChange={(e) => handleUploadProof(w._id, e.target.files[0])}
                        />
                        <button
                          onClick={() => fileInputRef.current[w._id]?.click()}
                          disabled={uploadingId === w._id}
                          className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-brand-text bg-white border border-brand-border hover:bg-brand-sidebar shadow-sm transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingId === w._id ? 'Uploading...' : 'Upload Proof'}
                        </button>
                        <p className="text-xs text-brand-muted mt-2 text-center md:text-right">Required before payout</p>
                      </div>
                    ) : (
                       <div className="flex items-center justify-center md:justify-end gap-2 text-sm text-yellow-700 font-medium bg-yellow-50 py-2.5 px-4 rounded-lg border border-yellow-200 shadow-sm">
                        <AlertCircle className="w-4 h-4" /> Please contact support
                      </div>
                    )}
                 </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-brand-card rounded-xl border border-brand-border shadow-sm">
           <Award className="w-16 h-16 mx-auto text-brand-border mb-4" strokeWidth={1} />
           <h3 className="text-xl font-bold text-brand-text mb-2">No winnings yet</h3>
           <p className="text-brand-muted text-sm max-w-sm mx-auto">
             Keep logging your scores and make sure your subscription is active to enter the next monthly draw.
           </p>
        </div>
      )}
    </div>
  );
};

export default Winners;
