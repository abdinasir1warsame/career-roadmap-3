import React from 'react';

const RadialProgressChart = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = 'from-blue-500 to-purple-600',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = (percentage * circumference) / 100;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#${color.replace(/\s+/g, '-')})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
          className="filter drop-shadow-[0_0_6px_rgba(147,51,234,0.5)]"
        />
        <defs>
          <linearGradient
            id={color.replace(/\s+/g, '-')}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              className="stop-color-start"
              style={{ stopColor: 'rgb(59, 130, 246)' }}
            />
            <stop
              offset="100%"
              className="stop-color-end"
              style={{ stopColor: 'rgb(147, 51, 234)' }}
            />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default RadialProgressChart;
