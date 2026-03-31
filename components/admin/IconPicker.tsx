'use client';

import React, { useState, useEffect } from 'react';
import { icons } from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const COMMON_ICONS = [
  'Users', 'FileText', 'Settings', 'BarChart', 'Shield',
  'Globe', 'Database', 'Zap', 'Clock', 'CheckCircle',
  'Star', 'Heart', 'Mail', 'Smartphone', 'Monitor',
  'Briefcase', 'MessageSquare', 'Activity', 'Award', 'Book'
];

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState(value || '');

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
  };

  const IconComponent = value && value in icons ? icons[value as keyof typeof icons] : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-gray-700">Icon Name (Lucide)</label>
          <input
            type="text"
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Shield, Users, Zap"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-16 h-[42px] border border-gray-300 bg-gray-50 rounded-md flex items-center justify-center shrink-0">
          {IconComponent ? (
            <IconComponent className="text-gray-700" size={24} />
          ) : (
            <span className="text-xs text-gray-400 block leading-tight text-center">N/A</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Common Icons</label>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {COMMON_ICONS.map((name) => {
            const Icon = icons[name as keyof typeof icons];
            if (!Icon) return null;
            
            return (
              <button
                key={name}
                type="button"
                onClick={() => { setSearchTerm(name); onChange(name); }}
                className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors border ${
                  value === name
                    ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-[inset_0_0_0_1px_rgba(59,130,246,1)]'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 shadow-sm hover:border-gray-300'
                }`}
                title={name}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </div>
      
      {!IconComponent && value && (
        <p className="text-xs text-red-500">Icon "{value}" not found in Lucide library.</p>
      )}
    </div>
  );
}
