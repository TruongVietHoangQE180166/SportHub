"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFieldStore } from '../../stores/fieldStore';
import { MapPin, Clock, DollarSign, Info, Star, Phone, Mail, Calendar, Users, LayoutGrid, ChevronDown } from 'lucide-react';
import Image from 'next/image';


const FieldDetailPage: React.FC<{ fieldId: string }> = ({ fieldId }) => {
  const router = useRouter();
  const {
    allFields, owner, reviews, loading, error,
    fetchAllFields, fetchOwnerByField, fetchReviewsByField, fetchSubCourts
  } = useFieldStore();

  const idNum = Number(fieldId);
  const field = allFields.find(f => f.id === idNum);

  // State cho filter đánh giá
  const [sortType, setSortType] = useState<'ratingAsc' | 'ratingDesc' | 'dateDesc' | 'dateAsc'>('ratingDesc');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sortOptions = [
    { value: 'ratingDesc', label: 'Điểm: Cao đến thấp' },
    { value: 'ratingAsc', label: 'Điểm: Thấp đến cao' },
    { value: 'dateDesc', label: 'Mới nhất' },
    { value: 'dateAsc', label: 'Cũ nhất' },
  ];
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortType === 'ratingAsc') return a.rating - b.rating;
    if (sortType === 'ratingDesc') return b.rating - a.rating;
    if (sortType === 'dateDesc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortType === 'dateAsc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    return 0;
  });

  useEffect(() => {
    if (!allFields.length) fetchAllFields();
    if (idNum) {
      fetchOwnerByField(idNum);
      fetchReviewsByField(idNum);
      fetchSubCourts(idNum);
    }
  }, [idNum, allFields.length, fetchAllFields, fetchOwnerByField, fetchReviewsByField, fetchSubCourts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 rounded-full animate-pulse mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-2xl text-gray-700 font-bold">Đang tải dữ liệu...</p>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-red-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-2xl text-red-600 font-bold mb-2">Có lỗi xảy ra</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-2xl text-gray-600 font-bold mb-2">Không tìm thấy sân</p>
          <p className="text-gray-500">Sân bạn tìm kiếm không tồn tại</p>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden mb-10 border border-gray-100 group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative">
            <div className="overflow-hidden rounded-t-[2rem]">
              <Image
                src={field.image}
                alt={field.name}
                width={1200}
                height={450}
                className="w-full h-[450px] object-cover rounded-t-[2rem] transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Gradient overlays (giảm opacity để ảnh sáng hơn) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-green-900/10"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-green-500/20 rounded-full blur-2xl"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 border border-white/30 shadow-2xl">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-2xl tracking-tight leading-tight">
                  {field.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-green-600/95 backdrop-blur-sm px-4 py-2 rounded-xl border border-green-400/50 shadow-xl">
                    <Star className="w-5 h-5 fill-white text-white drop-shadow-lg" />
                    <span className="font-black text-white text-base">{averageRating}</span>
                  </div>
                  <span className="text-white/95 font-bold text-base drop-shadow-lg">
                    ({reviews.length} đánh giá)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Field Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full -translate-y-20 translate-x-20 opacity-50"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-xl shadow-lg">
                    <Info className="w-6 h-6 text-green-700" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Thông tin sân</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="group/item flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-green-100 transition-all duration-500 border border-gray-200 hover:border-green-300 hover:shadow-lg transform hover:-translate-y-1">
                      <div className="p-2 bg-green-500 rounded-xl shadow-lg group-hover/item:shadow-xl transition-all duration-300 group-hover/item:scale-110">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1 text-base">Địa chỉ</p>
                        <p className="text-gray-700 leading-relaxed text-sm font-medium">{field.location}</p>
                      </div>
                    </div>
                    
                    <div className="group/item flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-green-100 transition-all duration-500 border border-gray-200 hover:border-green-300 hover:shadow-lg transform hover:-translate-y-1">
                      <div className="p-2 bg-green-500 rounded-xl shadow-lg group-hover/item:shadow-xl transition-all duration-300 group-hover/item:scale-110">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1 text-base">Giờ mở cửa</p>
                        <p className="text-gray-700 leading-relaxed text-sm font-medium">{field.openingHours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="group/item flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-green-100 transition-all duration-500 border border-gray-200 hover:border-green-300 hover:shadow-lg transform hover:-translate-y-1">
                      <div className="p-2 bg-green-500 rounded-xl shadow-lg group-hover/item:shadow-xl transition-all duration-300 group-hover/item:scale-110">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1 text-base">Giá</p>
                        <p className="text-gray-700 font-black text-base">{field.price}</p>
                      </div>
                    </div>

                    <div className="group/item flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-green-100 transition-all duration-500 border border-gray-200 hover:border-green-300 hover:shadow-lg transform hover:-translate-y-1">
                      <div className="p-2 bg-green-500 rounded-xl shadow-lg group-hover/item:shadow-xl transition-all duration-300 group-hover/item:scale-110">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1 text-base">Môn thể thao</p>
                        <p className="text-gray-700 font-black text-base">{field.sport}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-inner">
                  <p className="font-black text-gray-900 mb-2 text-base">Mô tả</p>
                  <p className="text-gray-700 leading-relaxed text-sm font-medium">{field.description}</p>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-50 rounded-full -translate-y-16 -translate-x-16 opacity-50"></div>
              
              <div className="relative">
                <h2 className="text-2xl font-black text-gray-900 mb-5">Thông tin chủ sân</h2>
                {owner ? (
                  <div className="flex items-center gap-5 p-5 bg-white rounded-xl border border-gray-200 shadow-inner">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl blur-lg opacity-20"></div>
                      <Image
                        src={owner.avatar || '/default-avatar.png'}
                        alt={owner.name}
                        width={64}
                        height={64}
                        className="relative w-16 h-16 rounded-2xl border-2 border-white shadow-xl object-cover"
                      />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-gray-900 mb-1">{owner.name}</h3>
                      <p className="text-gray-700 mb-2 leading-relaxed text-sm font-medium">{owner.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-xs text-gray-700 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span className="font-bold">{owner.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                          <Mail className="w-4 h-4 text-green-600" />
                          <span className="font-bold">{owner.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-base font-semibold">Không có thông tin chủ sân.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-green-50 rounded-full -translate-y-20 -translate-x-20 opacity-50"></div>
              
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <h2 className="text-xl font-black text-gray-900">Đánh giá từ khách hàng</h2>
                  <div className="flex items-center gap-2 flex-wrap relative">
                    <div className="relative min-w-[170px]">
                      <button
                        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm"
                        onClick={() => setDropdownOpen(v => !v)}
                        type="button"
                        title="Sắp xếp đánh giá"
                      >
                        <span className="text-gray-700 truncate">
                          {sortOptions.find(o => o.value === sortType)?.label}
                        </span>
                        <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                      </button>
                      {dropdownOpen && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-green-500 rounded-lg shadow-xl">
                          {sortOptions.map(option => (
                            <button
                              key={option.value}
                              className={`w-full text-left px-3 py-2 hover:bg-green-50 transition-all text-sm first:rounded-t-lg last:rounded-b-lg ${
                                sortType === option.value ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-700'
                              }`}
                              onClick={() => {
                                setSortType(option.value as typeof sortType);
                                setDropdownOpen(false);
                              }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-gray-200 shadow-lg">
                      <Star className="w-5 h-5 fill-green-600 text-green-600" />
                      <span className="font-black text-gray-900 text-base">{averageRating}</span>
                      <span className="text-gray-700 font-bold text-sm">({reviews.length})</span>
                    </div>
                  </div>
                </div>

                {sortedReviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="relative mx-auto mb-4 w-16 h-16">
                      <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
                      <div className="absolute inset-2 bg-white rounded-full shadow-inner flex items-center justify-center">
                        <Star className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-base font-black mb-1">Chưa có đánh giá nào.</p>
                    <p className="text-sm font-medium">Hãy là người đầu tiên đánh giá sân này!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {sortedReviews.map((review, index) => (
                      <div 
                        key={review.id} 
                        className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-green-100 transition-all duration-500 transform hover:scale-[1.01] hover:-translate-y-0.5 border border-gray-200 hover:border-green-300 hover:shadow-xl group/review"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Image
                              src={review.userAvatar || '/default-avatar.png'}
                              alt={review.userName}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-xl border-2 border-white shadow-xl object-cover flex-shrink-0 group-hover/review:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-black text-gray-900 text-sm">{review.userName}</h4>
                              <div className="flex items-center gap-1 text-xs text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-md">
                                <Calendar className="w-3 h-3" />
                                <span className="font-bold">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 transition-all duration-200 ${i < review.rating ? 'fill-green-600 text-green-600 scale-110' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed text-xs font-medium">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-xl p-5 sticky top-16 border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-black mb-4 text-base border-2 border-gray-200 shadow-lg">
                    <LayoutGrid className="w-5 h-5" />
                    {field.subCourts.length} sân
                  </div>
                  <p className="text-gray-700 mb-4 text-base font-bold">Sẵn sàng cho trận đấu của bạn!</p>
                </div>

                <button
                  onClick={() => router.push(`/booking?fieldId=${field.id}&sport=${field.sport}`)}
                  className="w-full bg-gradient-to-br from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white font-black py-4 px-5 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-2 text-lg border-2 border-green-600 relative overflow-hidden group/button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000"></div>
                  <Calendar className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Đặt sân ngay</span>
                </button>

                <div className="mt-3 text-center">
                  <p className="text-gray-600 font-bold text-xs">Đặt sân dễ dàng, thanh toán linh hoạt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
};

export default FieldDetailPage;