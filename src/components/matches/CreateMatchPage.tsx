'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Clock, MapPin, MessageCircle, ChevronDown, X, Zap, Shield, Trophy, Target } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useMatchStore } from '@/stores/matchStore';
import { SkillLevel } from '@/types/match';
import { useRouter } from 'next/navigation';
import { sportOptions, skillLevelOptions, generateTimeOptions } from './shared/matchUtils';
import { MatchNavigation } from './shared/MatchNavigation';
import { TimeDropdown } from './shared/TimeDropdown';

export const CreateMatchPage = () => {
  const [newMatch, setNewMatch] = useState({
    title: '',
    sport: '',
    date: '',
    time: '',
    location: '',
    address: '',
    maxParticipants: 10,
    skillLevel: 'Thấp',
    description: '',
    phone: '',
    facebook: '',
  });
  const [createDropdown, setCreateDropdown] = useState<{ sport: boolean; skillLevel: boolean; time: boolean }>({ sport: false, skillLevel: false, time: false });

  const { user, isAuthenticated, fetchAllUsers } = useAuthStore();
  const { matches, createMatch } = useMatchStore();
  const router = useRouter();

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newId = matches.length > 0 ? Math.max(...matches.map(m => m.id)) + 1 : 1;
    await createMatch({
      id: newId,
      title: newMatch.title,
      sport: newMatch.sport,
      organizer: user.name,
      organizerAvatar: user.avatar || '',
      date: newMatch.date,
      time: newMatch.time,
      location: newMatch.location,
      address: newMatch.address,
      maxParticipants: Number(newMatch.maxParticipants),
      skillLevel: newMatch.skillLevel as SkillLevel,
      description: newMatch.description,
      status: 'open',
      phone: newMatch.phone,
      facebook: newMatch.facebook,
      role: 'organizer',
      joinRequests: [],
    });
    router.push('/matches/my-matches');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className="relative">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              <div className="flex items-center justify-center space-x-4">
                <Plus className="w-16 h-16 text-green-600" />
                <span>Tạo trận đấu mới</span>
              </div>
            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Tạo cơ hội kết nối và vận động cùng cộng đồng thể thao
            </p>
          </div>
        </div>

        <MatchNavigation />

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
          <div className="p-8 sm:p-12">
            {!isAuthenticated ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center space-x-2">
                  <Shield className="w-6 h-6 text-gray-600" />
                  <span>Vui lòng đăng nhập</span>
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Bạn cần đăng nhập để có thể tạo trận đấu mới
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
                    <Zap className="w-10 h-10 text-green-600" />
                    <span>Tạo trận đấu mới</span>
                  </h2>
                  <p className="text-gray-600 font-medium text-lg">Tạo cơ hội kết nối và vận động cùng cộng đồng thể thao</p>
                </div>
                <form className="space-y-10" onSubmit={handleCreateMatch}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-green-600" />
                        <span>Tên trận đấu *</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                        placeholder="VD: Giao hữu bóng đá cuối tuần"
                        value={newMatch.title}
                        onChange={e => setNewMatch({ ...newMatch, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>Môn thể thao *</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-white text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all flex items-center justify-between hover:border-green-500"
                          onClick={() => setCreateDropdown(d => ({ ...d, sport: !d.sport }))}
                        >
                          <span>{newMatch.sport || 'Chọn môn thể thao'}</span>
                          <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                        </button>
                        {createDropdown.sport && (
                          <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-green-500 rounded-xl shadow-xl">
                            {sportOptions.map(option => (
                              <button
                                key={option.value}
                                className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${newMatch.sport === option.value ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
                                onClick={() => {
                                  setNewMatch(prev => ({ ...prev, sport: option.value }));
                                  setCreateDropdown(d => ({ ...d, sport: false }));
                                }}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>Ngày *</span>
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                        value={newMatch.date}
                        onChange={e => setNewMatch({ ...newMatch, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>Giờ *</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          className={`w-full px-4 py-4 border border-gray-200 rounded-2xl bg-white text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all flex items-center justify-between hover:border-green-500 ${createDropdown.time ? 'border-green-500 ring-2 ring-green-500' : ''}`}
                          onClick={() => setCreateDropdown(d => ({ ...d, time: !d.time }))}
                        >
                          <span className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className={newMatch.time ? '' : 'text-gray-400'}>{newMatch.time || 'Chọn giờ'}</span>
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                        </button>
                        {createDropdown.time && (
                          <TimeDropdown
                            value={newMatch.time}
                            options={timeOptions}
                            onSelect={time => {
                              setNewMatch(prev => ({ ...prev, time }));
                              setCreateDropdown(d => ({ ...d, time: false }));
                            }}
                            onClose={() => setCreateDropdown(d => ({ ...d, time: false }))}
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>Số người tối đa *</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="2"
                        max="22"
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                        value={newMatch.maxParticipants}
                        onChange={e => setNewMatch({ ...newMatch, maxParticipants: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>Địa điểm *</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                        placeholder="VD: Sân bóng Quy Nhon Center"
                        value={newMatch.location}
                        onChange={e => setNewMatch({ ...newMatch, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Target className="w-4 h-4 text-green-600" />
                        <span>Trình độ *</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-white text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all flex items-center justify-between hover:border-green-500"
                          onClick={() => setCreateDropdown(d => ({ ...d, skillLevel: !d.skillLevel }))}
                        >
                          <span>{newMatch.skillLevel || 'Chọn trình độ'}</span>
                          <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                        </button>
                        {createDropdown.skillLevel && (
                          <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-green-500 rounded-xl shadow-xl">
                            {skillLevelOptions.map(option => (
                              <button
                                key={option.value}
                                className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${newMatch.skillLevel === option.value ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
                                onClick={() => {
                                  setNewMatch(prev => ({ ...prev, skillLevel: option.value }));
                                  setCreateDropdown(d => ({ ...d, skillLevel: false }));
                                }}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span>Mô tả</span>
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200 resize-none"
                      placeholder="Mô tả chi tiết về trận đấu, yêu cầu, ghi chú..."
                      value={newMatch.description}
                      onChange={e => setNewMatch({ ...newMatch, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span>Số điện thoại liên hệ *</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                        placeholder="Nhập số điện thoại"
                        value={newMatch.phone}
                        onChange={e => setNewMatch({ ...newMatch, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>Link Facebook *</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                        placeholder="Nhập link Facebook"
                        value={newMatch.facebook}
                        onChange={e => setNewMatch({ ...newMatch, facebook: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
                    <button
                      type="button"
                      className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
                      onClick={() => router.push('/matches/discover')}
                    >
                      <X className="w-4 h-4" />
                      <span>Hủy bỏ</span>
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Tạo trận đấu</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};