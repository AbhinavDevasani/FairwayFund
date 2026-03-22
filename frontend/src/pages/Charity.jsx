import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Heart, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const Charity = () => {
  const { user, refreshUser } = useAuth();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState(null);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await api.get('/charity');
      if (res.data.success) {
        setCharities(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load charities", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCharity = async (charityId) => {
    setSelectingId(charityId);
    try {
      const res = await api.put('/users/charity', { charityId });
      if (res.data.success) {
        await refreshUser();
      }
    } catch (err) {
      console.error("Failed to select charity", err);
      alert("Failed to update charity selection.");
    } finally {
      setSelectingId(null);
    }
  };

  if (loading) return <div className="text-center py-10">Loading charities...</div>;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm">
          <Heart className="w-8 h-8 text-red-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-extrabold text-brand-text mb-3">Support a Cause</h1>
        <p className="text-brand-muted text-lg max-w-2xl mx-auto">
          Choose the charity you want to support this month. A portion of the platform's revenue goes directly to your selected cause.
        </p>
      </header>

      {charities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((charity) => {
            const isSelected = user?.selectedCharity?._id === charity._id;
            const isProcessing = selectingId === charity._id;

            return (
              <div 
                key={charity._id} 
                className={clsx(
                  "bg-brand-card rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all duration-300",
                  isSelected ? "border-brand-accent ring-1 ring-brand-accent scale-[1.02]" : "border-brand-border hover:shadow-md"
                )}
              >
                {charity.image ? (
                  <div className="h-48 w-full bg-cover bg-center border-b border-brand-border" style={{ backgroundImage: `url(${charity.image})` }} />
                ) : (
                  <div className="h-48 w-full bg-brand-sidebar flex items-center justify-center border-b border-brand-border">
                    <Heart className="w-10 h-10 text-brand-border" strokeWidth={1.5} />
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col bg-white">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-lg font-bold text-brand-text">{charity.name}</h3>
                     {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-accent flex-shrink-0" />}
                  </div>
                  <p className="text-brand-muted text-sm mb-6 flex-1 line-clamp-3">
                    {charity.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border">
                    <div className="text-sm">
                      <span className="font-bold text-brand-text">${charity.totalDonations || 0}</span>
                      <span className="text-brand-muted ml-1">raised</span>
                    </div>
                    
                    <button
                      onClick={() => handleSelectCharity(charity._id)}
                      disabled={isSelected || isProcessing}
                      className={clsx(
                        "px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm",
                        isSelected 
                          ? "bg-green-50 text-green-700 border border-green-200 cursor-default" 
                          : "bg-white border border-brand-border text-brand-text hover:bg-brand-sidebar"
                      )}
                    >
                      {isProcessing ? 'Saving...' : isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-brand-card rounded-xl border border-brand-border shadow-sm">
           <Heart className="w-12 h-12 mx-auto text-brand-border mb-4" strokeWidth={1} />
           <p className="text-brand-muted text-base font-medium">No charities available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Charity;
