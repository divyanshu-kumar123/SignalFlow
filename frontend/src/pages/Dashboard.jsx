export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center flex-col gap-6 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Active Terminal</h1>
        <p className="text-emerald-400 font-mono">Connection Secure • SignalFlow API</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg max-w-lg w-full">
        <p className="text-slate-300">
          You have successfully authenticated. Real-time market data modules will initialize here shortly.
        </p>
      </div>
    </div>
  );
}