import React, { useMemo, useState } from 'react';
import { PerformanceDataPoint, PerformanceTimeframe } from '../../types/Investment';
import { formatCurrency } from '../../utils/formatCurrency';

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
}

const timeframes: PerformanceTimeframe[] = ['1W', '1M', '1Y'];

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data: allData }) => {
  const [timeframe, setTimeframe] = useState<PerformanceTimeframe>('1M');

  const chartData = useMemo(() => {
    const daysMap: Record<PerformanceTimeframe, number> = { '1W': 7, '1M': 30, '1Y': 365 };
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysMap[timeframe]);
    return allData.filter((d) => new Date(d.date) >= cutoff);
  }, [allData, timeframe]);

  const { path, areaPath, minVal, maxVal, latestValue } = useMemo(() => {
    if (chartData.length === 0) {
      return { path: '', areaPath: '', minVal: 0, maxVal: 0, latestValue: 0 };
    }

    const values = chartData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || max * 0.1 || 1;
    const minV = min - padding;
    const maxV = max + padding;
    const range = maxV - minV || 1;

    const width = 100;
    const height = 60;
    const points = chartData.map((d, i) => {
      const x = chartData.length === 1 ? width / 2 : (i / (chartData.length - 1)) * width;
      const y = height - ((d.value - minV) / range) * height;
      return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const area = `${linePath} L ${width} ${height} L 0 ${height} Z`;

    return {
      path: linePath,
      areaPath: area,
      minVal: minV,
      maxVal: maxV,
      latestValue: values[values.length - 1],
    };
  }, [chartData]);

  const isPositive =
    chartData.length >= 2
      ? chartData[chartData.length - 1].value >= chartData[0].value
      : true;

  return (
    <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Performance</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(latestValue)}
          </p>
        </div>
        <div className="flex items-center p-1 bg-gray-100 rounded-full dark:bg-gray-800">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                timeframe === tf
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="relative w-full" style={{ height: 200 }}>
          <svg
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isPositive ? '#34d399' : '#f87171'}
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? '#34d399' : '#f87171'}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#chartGradient)" />
            <path
              d={path}
              fill="none"
              stroke={isPositive ? '#34d399' : '#f87171'}
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{formatCurrency(minVal)}</span>
            <span>{formatCurrency(maxVal)}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
          Add transactions to see performance
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
