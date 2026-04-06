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
        const isMiddle = i === 1;
        return (
          <div
            key={i}
            className={`flex-1 rounded-[14px] p-6 text-center ${
              isMiddle
                ? 'bg-linear-to-br from-[#2251B5]/10 to-white'
                : 'bg-linear-to-br from-[#E96429]/10 to-white'
            }`}
          >
            <div
              className={`text-4xl font-bold mb-2 ${
                isMiddle ? 'text-[#2251B5]' : 'text-[#E96429]'
              }`}
            >
              {stat.value}
            </div>
            <div className="text-sm font-medium text-[#4A5565]">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
