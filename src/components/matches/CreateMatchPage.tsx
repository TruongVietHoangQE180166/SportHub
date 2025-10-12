'use client';
import React, { useState } from 'react';
import { Plus, Users, Calendar, Clock, MapPin, MessageCircle, ChevronDown, X, Zap, Shield, Trophy, Target, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { sportOptions, skillLevelOptions, generateTimeOptions } from './shared/matchUtils';
import { MatchNavigation } from './shared/MatchNavigation';
import { TimeDropdown } from './shared/TimeDropdown';
import { createMatch, CreateMatchRequest } from '@/services/matchService';
import { useAuthStore } from '@/stores/authStore';

// Validation functions
const validateForm = (formData: any) => {
  const errors: Record<string, string> = {};
  
  // Title validation
  if (!formData.title.trim()) {
    errors.title = 'Tên trận đấu là bắt buộc';
  } else if (formData.title.length < 3) {
    errors.title = 'Tên trận đấu phải có ít nhất 3 ký tự';
  } else if (formData.title.length > 100) {
    errors.title = 'Tên trận đấu không được vượt quá 100 ký tự';
  }
  
  // Sport validation
  if (!formData.sport) {
    errors.sport = 'Vui lòng chọn môn thể thao';
  }
  
  // Date validation
  if (!formData.date) {
    errors.date = 'Ngày là bắt buộc';
  } else {
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.date = 'Ngày không được là ngày trong quá khứ';
    }
  }
  
  // Time validation
  if (!formData.time) {
    errors.time = 'Giờ là bắt buộc';
  }
  
  // Location validation
  if (!formData.location.trim()) {
    errors.location = 'Địa điểm là bắt buộc';
  } else if (formData.location.length < 5) {
    errors.location = 'Địa điểm phải có ít nhất 5 ký tự';
  } else if (formData.location.length > 200) {
    errors.location = 'Địa điểm không được vượt quá 200 ký tự';
  }
  
  // Max participants validation
  if (!formData.maxParticipants) {
    errors.maxParticipants = 'Số người tối đa là bắt buộc';
  } else if (formData.maxParticipants < 2) {
    errors.maxParticipants = 'Số người tối đa phải ít nhất là 2';
  } else if (formData.maxParticipants > 22) {
    errors.maxParticipants = 'Số người tối đa không được vượt quá 22';
  }
  
  // Skill level validation
  if (!formData.skillLevel) {
    errors.skillLevel = 'Vui lòng chọn trình độ';
  }
  
  // Phone validation
  if (!formData.phone.trim()) {
    errors.phone = 'Số điện thoại là bắt buộc';
  } else if (!/^(0|\+84)[1-9][0-9]{8,9}$/.test(formData.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }
  
  // Facebook link validation
  if (!formData.facebook.trim()) {
    errors.facebook = 'Link Facebook là bắt buộc';
  } else if (!/^https?:\/\/(www\.)?facebook\.com\/.+$/.test(formData.facebook)) {
    errors.facebook = 'Link Facebook không hợp lệ';
  }
  
  // Description validation (optional but with limits)
  if (formData.description.length > 500) {
    errors.description = 'Mô tả không được vượt quá 500 ký tự';
  }
  
  return errors;
};

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuthStore();

  const timeOptions = generateTimeOptions();

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setApiError('Vui lòng đăng nhập để tạo trận đấu');
      return;
    }
    
    // Validate form
    const formErrors = validateForm(newMatch);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    setApiError(null);
    
    try {
      // Convert form data to API format
      const matchData: CreateMatchRequest = {
        nameMatch: newMatch.title,
        descriptionMatch: newMatch.description,
        nameSport: newMatch.sport,
        timeMatch: new Date(`${newMatch.date}T${newMatch.time}`).toISOString(),
        maxPlayers: Number(newMatch.maxParticipants),
        location: newMatch.location,
        level: newMatch.skillLevel === 'Thấp' ? 'LOW' : 
               newMatch.skillLevel === 'Trung bình' ? 'MEDIUM' : 
               newMatch.skillLevel === 'Cao' ? 'HIGH' : 'PROFESSIONAL',
        numberPhone: newMatch.phone,
        linkFacebook: newMatch.facebook,
      };

      const response = await createMatch(matchData);
      
      if (response.success) {
        // Redirect to my matches page after successful creation
        router.push('/matches/my-matches');
      } else {
        // Handle API validation errors
        if (response.errors && response.errors.length > 0) {
          const errorMessages = response.errors.map(err => `${err.field}: ${err.message}`).join(', ');
          setApiError(errorMessages);
        } else {
          setApiError(response.message?.messageDetail || 'Có lỗi xảy ra khi tạo trận đấu');
        }
      }
    } catch (err: any) {
      console.error('Error creating match:', err);
      // Handle network errors or unexpected errors
      if (err.response?.data?.message?.messageDetail) {
        setApiError(err.response.data.message.messageDetail);
      } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
        setApiError(errorMessages);
      } else {
        setApiError('Có lỗi xảy ra khi tạo trận đấu. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-80 md:h-96 lg:h-[32rem] w-full -mt-12 overflow-hidden">
      {/* Background Image - Clear and Visible */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-gray-200"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?_gl=1*t142ag*_ga*MTM4MjA3NDU0OS4xNzUxMjg5Mzg3*_ga_8JE65Q40S6*czE3NTEyODkzODYkbzEkZzEkdDE3NTEyODk0OTMkajU1JGwwJGgw')",
        }}
      />
      
      {/* Subtle Bottom Gradient Only - Keeps Image Clear */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-12 md:pb-16 lg:pb-20 text-center px-4 sm:px-6 lg:px-8">
        {/* Icon with Clean Design */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-green-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative bg-white p-4 md:p-5 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-green-400">
            <Plus className="w-10 h-10 md:w-14 md:h-14 text-green-400" strokeWidth={3} />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 text-green-400 animate-pulse" />
        </div>

        {/* Title with Shadow for Readability */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          Tạo trận đấu mới
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-semibold max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Tạo cơ hội kết nối và vận động cùng{' '}
          <span className="text-green-400 font-bold">cộng đồng thể thao</span>
        </p>
      </div>
    </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <MatchNavigation />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
          <div className="p-8 sm:p-12">
            {!user ? (
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
                    <span className="text-2xl sm:text-3xl md:text-4xl">Tạo trận đấu mới</span>
                  </h2>
                  <p className="text-gray-600 font-medium text-lg text-sm sm:text-base">
                    Tạo cơ hội kết nối và vận động cùng cộng đồng thể thao
                  </p>
                </div>
                
                {(apiError || Object.keys(errors).length > 0) && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    {apiError && <p className="text-red-700 font-medium">{apiError}</p>}
                    {Object.keys(errors).length > 0 && (
                      <ul className="mt-2 text-red-700 font-medium list-disc pl-5 space-y-1">
                        {Object.entries(errors).map(([field, error]) => (
                          <li key={field}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                
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
                        className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200 ${
                          errors.title ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="VD: Giao hữu bóng đá cuối tuần"
                        value={newMatch.title}
                        onChange={e => {
                          setNewMatch({ ...newMatch, title: e.target.value });
                          if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                        }}
                      />
                      {errors.title && <p className="mt-2 text-red-600 text-sm">{errors.title}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>Môn thể thao *</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          className={`w-full px-4 py-4 border rounded-2xl bg-white text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all flex items-center justify-between hover:border-green-500 ${
                            errors.sport ? 'border-red-500' : 'border-gray-200'
                          }`}
                          onClick={() => setCreateDropdown(d => ({ ...d, sport: !d.sport }))}
                        >
                          <span>{newMatch.sport || 'Chọn môn thể thao'}</span>
                          <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                        </button>
                        {errors.sport && <p className="mt-2 text-red-600 text-sm">{errors.sport}</p>}
                        {createDropdown.sport && (
                          <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-green-500 rounded-xl shadow-xl">
                            {sportOptions.map(option => (
                              <button
                                key={option.value}
                                className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${newMatch.sport === option.value ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
                                onClick={() => {
                                  setNewMatch(prev => ({ ...prev, sport: option.value }));
                                  setCreateDropdown(d => ({ ...d, sport: false }));
                                  if (errors.sport) setErrors(prev => ({ ...prev, sport: '' }));
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
                        className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200 ${
                          errors.date ? 'border-red-500' : 'border-gray-200'
                        }`}
                        value={newMatch.date}
                        onChange={e => {
                          setNewMatch({ ...newMatch, date: e.target.value });
                          if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
                        }}
                      />
                      {errors.date && <p className="mt-2 text-red-600 text-sm">{errors.date}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>Giờ *</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          className={`w-full px-4 py-4 border rounded-2xl bg-white text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all flex items-center justify-between hover:border-green-500 ${
                            errors.time ? 'border-red-500' : 'border-gray-200'
                          } ${createDropdown.time ? 'border-green-500 ring-2 ring-green-500' : ''}`}
                          onClick={() => setCreateDropdown(d => ({ ...d, time: !d.time }))}
                        >
                          <span className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className={newMatch.time ? '' : 'text-gray-400'}>{newMatch.time || 'Chọn giờ'}</span>
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                        </button>
                        {errors.time && <p className="mt-2 text-red-600 text-sm">{errors.time}</p>}
                        {createDropdown.time && (
                          <TimeDropdown
                            value={newMatch.time}
                            options={timeOptions}
                            onSelect={time => {
                              setNewMatch(prev => ({ ...prev, time }));
                              setCreateDropdown(d => ({ ...d, time: false }));
                              if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
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
                        className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200 ${
                          errors.maxParticipants ? 'border-red-500' : 'border-gray-200'
                        }`}
                        value={newMatch.maxParticipants}
                        onChange={e => {
                          setNewMatch({ ...newMatch, maxParticipants: Number(e.target.value) });
                          if (errors.maxParticipants) setErrors(prev => ({ ...prev, maxParticipants: '' }));
                        }}
                      />
                      {errors.maxParticipants && <p className="mt-2 text-red-600 text-sm">{errors.maxParticipants}</p>}
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
                        className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200 ${
                          errors.location ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="VD: Sân bóng Quy Nhon Center"
                        value={newMatch.location}
                        onChange={e => {
                          setNewMatch({ ...newMatch, location: e.target.value });
                          if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
                        }}
                      />
                      {errors.location && <p className="mt-2 text-red-600 text-sm">{errors.location}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Target className="w-4 h-4 text-green-600" />
                        <span>Trình độ *</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          className={`w-full px-4 py-4 border rounded-2xl bg-white text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all flex items-center justify-between hover:border-green-500 ${
                            errors.skillLevel ? 'border-red-500' : 'border-gray-200'
                          }`}
                          onClick={() => setCreateDropdown(d => ({ ...d, skillLevel: !d.skillLevel }))}
                        >
                          <span>{newMatch.skillLevel || 'Chọn trình độ'}</span>
                          <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                        </button>
                        {errors.skillLevel && <p className="mt-2 text-red-600 text-sm">{errors.skillLevel}</p>}
                        {createDropdown.skillLevel && (
                          <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-green-500 rounded-xl shadow-xl">
                            {skillLevelOptions.map(option => (
                              <button
                                key={option.value}
                                className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${newMatch.skillLevel === option.value ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
                                onClick={() => {
                                  setNewMatch(prev => ({ ...prev, skillLevel: option.value }));
                                  setCreateDropdown(d => ({ ...d, skillLevel: false }));
                                  if (errors.skillLevel) setErrors(prev => ({ ...prev, skillLevel: '' }));
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
                      className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200 resize-none ${
                        errors.description ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Mô tả chi tiết về trận đấu, yêu cầu, ghi chú..."
                      value={newMatch.description}
                      onChange={e => {
                        setNewMatch({ ...newMatch, description: e.target.value });
                        if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                      }}
                    ></textarea>
                    {errors.description && <p className="mt-2 text-red-600 text-sm">{errors.description}</p>}
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
                        className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200 ${
                          errors.phone ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Nhập số điện thoại"
                        value={newMatch.phone}
                        onChange={e => {
                          setNewMatch({ ...newMatch, phone: e.target.value });
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                        }}
                      />
                      {errors.phone && <p className="mt-2 text-red-600 text-sm">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>Link Facebook *</span>
                      </label>
                      <input
                        type="text"
                        required
                        className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200 ${
                          errors.facebook ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Nhập link Facebook"
                        value={newMatch.facebook}
                        onChange={e => {
                          setNewMatch({ ...newMatch, facebook: e.target.value });
                          if (errors.facebook) setErrors(prev => ({ ...prev, facebook: '' }));
                        }}
                      />
                      {errors.facebook && <p className="mt-2 text-red-600 text-sm">{errors.facebook}</p>}
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
                      disabled={loading}
                      className="px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang tạo...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Tạo trận đấu</span>
                        </>
                      )}
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

export default CreateMatchPage;