import { TrendingUp } from 'lucide-react';

export default function TradingLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-5">
      <div className="flex items-end space-x-2 h-12">
        <div 
          className="w-3 h-6 bg-emerald-500 rounded-t-sm animate-bounce" 
          style={{ animationDelay: '0ms' }}
        ></div>
        <div 
          className="w-3 h-10 bg-emerald-400 rounded-t-sm animate-bounce" 
          style={{ animationDelay: '150ms' }}
        ></div>
        <div 
          className="w-3 h-8 bg-emerald-600 rounded-t-sm animate-bounce" 
          style={{ animationDelay: '300ms' }}
        ></div>
        <div 
          className="w-3 h-12 bg-emerald-300 rounded-t-sm animate-bounce" 
          style={{ animationDelay: '450ms' }}
        ></div>
      </div>
      
      <div className="flex items-center space-x-2 text-emerald-500 font-mono text-sm">
        <TrendingUp className="h-4 w-4 animate-pulse" />
        <span className="animate-pulse tracking-widest">CONNECTING TO MARKET...</span>
      </div>
    </div>
  );
}