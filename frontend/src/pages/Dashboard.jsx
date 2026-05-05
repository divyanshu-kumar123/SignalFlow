import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Activity, BellRing } from 'lucide-react';
import { socket } from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import CreateAlertForm from '../components/CreateAlertForm';
import LiveChart from '../components/LiveChart';
import api from '../services/api'; // Import your API to fetch assets

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [availableAssets, setAvailableAssets] = useState([]);

  //Fetch assets from backend on load
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get('/assets');
        const assets = response.data.data;
        setAvailableAssets(assets);
        if (assets.length > 0) {
          setSelectedAsset(assets[0]); 
        }
      } catch (error) {
        console.error("Failed to fetch assets", error);
        toast.error("Could not load market assets");
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    socket.on('alert-triggered', (alertData) => {
      // Fire off a high-priority toast notification
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-slate-800 shadow-2xl rounded-lg pointer-events-auto flex ring-1 ring-emerald-500/50`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">
                <BellRing className="h-10 w-10 text-emerald-400 p-2 bg-emerald-400/10 rounded-full" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-white uppercase tracking-wider">
                  Target Hit: {alertData.asset_symbol}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Condition: {alertData.condition.replace('_', ' ')} <span className="font-mono text-emerald-400">${alertData.target_price}</span>
                </p>
                <p className="mt-1 text-xs font-mono text-slate-400">
                  Triggered at: ${alertData.triggered_price}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-slate-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Dismiss
            </button>
          </div>
        </div>
      ), { duration: 6000 });

      setRecentAlerts((prev) => [alertData, ...prev]);
    });

    return () => {
      socket.off('alert-triggered');
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center mb-12 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <Activity className="h-8 w-8 text-emerald-500" />
          <h1 className="text-2xl font-bold text-white tracking-tight">SignalFlow</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 text-sm hidden sm:inline-block">Logged in as: {user?.email}</span>
          <button 
            onClick={logout}
            className="text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create Alert Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col h-auto">
          <h2 className="text-xl font-bold text-white mb-4">Create Alert Rule</h2>
          <p className="text-sm text-slate-400 mb-6">Define your market parameters. The system will notify you the moment conditions are met.</p>
          
          <div className="flex-1">
            <CreateAlertForm /> 
          </div>
        </div>

        {/* Right Column: Active Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live LiveChart Controls */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl w-fit border border-slate-800">
              {availableAssets.map((asset) => (
                <button
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedAsset === asset
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {asset}
                </button>
              ))}
            </div>
            {selectedAsset && <LiveChart key={selectedAsset} symbol={selectedAsset} />}
          </div>

          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="relative flex h-3 w-3 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Live Alert Feed
          </h2>
          
          {recentAlerts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl flex flex-col items-center justify-center text-center h-64">
              <BellRing className="h-10 w-10 text-slate-600 mb-4" />
              <p className="text-slate-400">Monitoring data streams.</p>
              <p className="text-sm text-slate-500">No alerts triggered in this session yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center animate-in slide-in-from-right-8 fade-in duration-300">
                  <div>
                    <h3 className="font-bold text-white text-lg">{alert.asset_symbol}</h3>
                    <p className="text-sm text-slate-400">
                      Target: {alert.condition.replace('_', ' ')} <span className="text-emerald-400">${alert.target_price}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xl text-white">${alert.triggered_price}</p>
                    <p className="text-xs text-slate-500 uppercase">Triggered Price</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}