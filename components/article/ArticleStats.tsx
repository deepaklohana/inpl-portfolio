'use client';

import React from 'react';

interface Stat {
  value: string;
  label: string;
}

interface ArticleStatsProps {
  stats: Stat[];
}

export function ArticleStats({ stats }: ArticleStatsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 my-8 not-prose w-full">
      {stats.map((stat, i) => {
        // Make the middle one stand out just like the design
        const isMiddle = i === 1;
        return (
          <div
            key={i}
            className={`flex-1 rounded-2xl p-6 text-center ${
              isMiddle
                ? 'bg-[#2251B5] text-white shadow-md shadow-[#2251B5]/20'
                : 'bg-gray-50 border border-gray-100'
            }`}
          >
            <div
              className={`text-4xl font-bold mb-2 ${
                isMiddle ? 'text-white' : 'text-[#2251B5]'
              }`}
            >
              {stat.value}
            </div>
            <div
              className={`text-sm font-medium ${
                isMiddle ? 'text-white/90' : 'text-[#101828]'
              }`}
            >
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
