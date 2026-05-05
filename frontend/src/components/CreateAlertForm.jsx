import { useState, useRef, useEffect } from 'react';
import { Plus, Target, TrendingDown, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

// Mock database - We will move this to the DB/API later

export default function CreateAlertForm() {
  const [assetSymbol, setAssetSymbol] = useState('');
  const [condition, setCondition] = useState('GREATER_THAN');
  const [targetPrice, setTargetPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get('/assets'); // We will create this endpoint next
        setAvailableAssets(response.data.data);
      } catch (error) {
        console.error("Could not fetch available assets:", error);
        toast.error("Failed to load asset list.");
      }
    };
    fetchAssets();
  }, []);
  
  // states for the searchable dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
 useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/alerts', {
        asset_symbol: assetSymbol.toUpperCase(),
        condition,
        target_price: parseFloat(targetPrice),
      });

      toast.success(`Alert created for ${assetSymbol.toUpperCase()}`);
      
      setAssetSymbol('');
      setTargetPrice('');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create alert rule.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter assets based on what the user types
 const filteredAssets = availableAssets.filter(asset => 
    asset.toLowerCase().includes(assetSymbol.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Asset Input with Searchable Dropdown */}
      <div ref={dropdownRef}>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Asset Symbol</label>
        <div className="relative">
          <input
            type="text"
            required
            placeholder="e.g. BTC"
            value={assetSymbol}
            onChange={(e) => {
              setAssetSymbol(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="appearance-none block w-full pl-4 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-lg placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors uppercase font-mono"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-slate-500 font-mono text-sm">/USD</span>
          </div>
          {showDropdown && filteredAssets.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              {filteredAssets.map((asset) => (
                <div
                  key={asset}
                  onClick={() => {
                    setAssetSymbol(asset);
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2 text-sm text-slate-300 font-mono hover:bg-slate-700 hover:text-white cursor-pointer transition-colors"
                >
                  {asset}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Trigger Condition</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCondition('GREATER_THAN')}
            className={`flex items-center justify-center py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
              condition === 'GREATER_THAN'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Goes Above
          </button>
          <button
            type="button"
            onClick={() => setCondition('LESS_THAN')}
            className={`flex items-center justify-center py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
              condition === 'LESS_THAN'
                ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Drops Below
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Target Price</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-emerald-500 font-mono font-bold">$</span>
          </div>
          <input
            type="number"
            required
            step="any"
            min="0"
            placeholder="65000"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="appearance-none block w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors font-mono"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Target className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-slate-950 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-all mt-4 ${
          isSubmitting ? 'opacity-70 cursor-wait' : 'hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
        }`}
      >
        {isSubmitting ? (
          'Deploying...'
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2" />
            Deploy Alert Rule
          </>
        )}
      </button>
    </form>
  );
}