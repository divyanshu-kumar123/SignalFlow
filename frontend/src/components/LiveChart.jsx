import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { socket } from '../utils/socket';

export default function LiveChart({ symbol = 'BTC/USD' }) {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isUp, setIsUp] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8', 
      },
      grid: {
        vertLines: { color: '#1e293b' }, 
        horzLines: { color: '#1e293b' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981', 
      downColor: '#f43f5e', 
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    window.addEventListener('resize', handleResize);

    let lastClose = null; 

    socket.on('price-update', (data) => {
      // If we are tracking multiple assets, ensure we only graph this one
      if (data.symbol !== symbol.split('/')[0]) return;

      const newPrice = data.price;
      
      // f this is the very first price we receive from the socket, 
      // set lastClose to the real price instantly.
      if (lastClose === null) {
        lastClose = newPrice;
      }

      // Update the big UI number
      setCurrentPrice(newPrice);
      setIsUp(newPrice >= lastClose);

      // Create a mock candlestick from the single price tick
      const time = Math.floor(Date.now() / 1000);
      const candle = {
        time: time,
        open: lastClose,
        high: Math.max(lastClose, newPrice) + (Math.random() * 10),
        low: Math.min(lastClose, newPrice) - (Math.random() * 10),
        close: newPrice,
      };

      // Push the new candle to the chart
      candlestickSeries.update(candle);
      
      lastClose = newPrice;
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      socket.off('price-update');
      chart.remove();
    };
  }, [symbol]);

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg w-full">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">{symbol}</h2>
          <p className="text-sm text-slate-400">Live Market Data</p>
        </div>
        <div className="text-right">
          <p className={`font-mono text-3xl font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      <div ref={chartContainerRef} className="w-full h-[350px]" />
    </div>
  );
}