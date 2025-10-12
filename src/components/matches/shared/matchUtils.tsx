import React from 'react';
import { Star, X, Zap, Shield } from 'lucide-react';

export const getSkillLevelColor = (level: string) => {
  switch (level) {
    case 'Thấp':
      return 'bg-gray-50 text-gray-700 border border-gray-200';
    case 'Trung bình':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'Cao':
      return 'bg-orange-50 text-orange-700 border border-orange-200';
    case 'Chuyên nghiệp':
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

export const getSportIcon = (sportName: string) => {
  switch (sportName) {
    case 'Bóng đá': return function FootballIcon() { return <span className="text-2xl">⚽</span>; };
    case 'Cầu lông': return function BadmintonIcon() { return <span className="text-2xl">🏸</span>; };
    case 'Pickle Ball': return function PickleIcon() { return <span className="text-2xl">🎾</span>; };
    default: return function DefaultIcon() { return <span className="text-2xl">🏅</span>; };
  }
};

export const getSportGradient = () => {
  return 'from-green-500 to-emerald-600';
};

export function findUserByName(users: {name: string, avatar?: string}[], name: string): {name: string, avatar?: string} | undefined {
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  return users.find((u) => normalize(u.name) === normalize(name));
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return <span className="px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold bg-green-100 text-green-700 border border-green-200 flex items-center space-x-1 md:space-x-2"> <Zap className="w-3 h-3 md:w-4 md:h-4" /><span>Đang tuyển</span></span>;
    case 'full':
      return <span className="px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200 flex items-center space-x-1 md:space-x-2"> <Shield className="w-3 h-3 md:w-4 md:h-4" /><span>Đã đầy</span></span>;
    case 'finished':
      return <span className="px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200 flex items-center space-x-1 md:space-x-2"> <Star className="w-3 h-3 md:w-4 md:h-4" /><span>Đã kết thúc</span></span>;
    case 'cancelled':
      return <span className="px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center space-x-1 md:space-x-2"> <X className="w-3 h-3 md:w-4 md:h-4" /><span>Đã hủy</span></span>;
    default:
      return null;
  }
};

export const sportOptions = [
  { value: '', label: 'Chọn môn thể thao' },
  { value: 'Bóng đá', label: 'Bóng đá' },
  { value: 'Cầu lông', label: 'Cầu lông' },
  { value: 'Pickle Ball', label: 'Pickle Ball' },
];

export const skillLevelOptions = [
  { value: 'Thấp', label: 'Thấp' },
  { value: 'Trung bình', label: 'Trung bình' },
  { value: 'Cao', label: 'Cao' },
  { value: 'Chuyên nghiệp', label: 'Chuyên nghiệp' },
];

// Generate time options for dropdown
export const generateTimeOptions = () => {
  const timeOptions = [];
  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }
  return timeOptions;
};