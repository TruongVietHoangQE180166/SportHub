"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFieldStore } from '../../stores/fieldStore';
import { MapPin, Clock, DollarSign, Info, Star, Phone, Mail, Calendar, Users, LayoutGrid, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';


const FieldDetailPage: React.FC<{ fieldId: string }> = ({ fieldId }) => {
  const router = useRouter();
  const {
    selectedField, owner, reviews, loading, error,
    fetchFieldDetail, fetchOwnerByField, fetchReviewsByField, fetchSubCourts
  } = useFieldStore();

  // State cho image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mock data cho nhiều ảnh (trong thực tế, bạn sẽ lấy từ API)
  const fieldImages = selectedField && selectedField.images ? 
    selectedField.images.map((img, index) => 
      img || `https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200&random=${index}`
    ) : [
      'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ];

  // State cho filter đánh giá
  const [sortType, setSortType] = useState<'ratingAsc' | 'ratingDesc' | 'dateDesc' | 'dateAsc'>('ratingDesc');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sortOptions = [
    { value: 'ratingDesc', label: 'Điểm: Cao đến thấp' },
    { value: 'ratingAsc', label: 'Điểm: Thấp đến cao' },
    { value: 'dateDesc', label: 'Mới nhất' },
    { value: 'dateAsc', label: 'Cũ nhất' },
  ];
  
  // Use rateResponses from selectedField instead of separate reviews
  const reviewsData = selectedField?.rateResponses || [];
  
  const sortedReviews = [...reviewsData].sort((a, b) => {
    if (sortType === 'ratingAsc') return a.rating - b.rating;
    if (sortType === 'ratingDesc') return b.rating - a.rating;
    if (sortType === 'dateDesc') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    if (sortType === 'dateAsc') return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
    return 0;
  });

  // Functions cho carousel
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % fieldImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + fieldImages.length) % fieldImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (fieldImages.length > 1) {
      const interval = setInterval(() => {
        nextImage();
      }, 5000); // Chuyển ảnh sau mỗi 5 giây
      
      return () => clearInterval(interval);
    }
  }, [fieldImages.length]);

  useEffect(() => {
    if (fieldId) {
      // Decode the fieldId to handle special characters
      const decodedFieldId = decodeURIComponent(fieldId);
      fetchFieldDetail(decodedFieldId);
      const idNum = Number(decodedFieldId);
      if (idNum) {
        fetchOwnerByField(idNum);
        // fetchReviewsByField is no longer needed since we get reviews from field detail
        fetchSubCourts(idNum);
      }
    }
  }, [fieldId, fetchFieldDetail, fetchOwnerByField, fetchSubCourts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 rounded-full animate-pulse mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
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

  // Check if field is available
  if (!selectedField || selectedField.available === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-2xl text-gray-600 font-bold mb-2">Sân không khả dụng</p>
          <p className="text-gray-500">Sân bạn tìm kiếm hiện không khả dụng để đặt chỗ</p>
        </div>
      </div>
    );
  }

  // Use actual averageRating from API
  const averageRating = selectedField.averageRating ? selectedField.averageRating.toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section với Carousel - Full Width */}
      <div className="relative bg-white shadow-2xl overflow-hidden border-b border-gray-100 group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div className="relative">
          {/* Image Carousel Container */}
          <div className="relative overflow-hidden h-64 sm:h-[600px]">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {fieldImages.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 relative">
                  <Image
                    src={image}
                    alt={`${selectedField?.fieldName || 'Sân thể thao'} - Ảnh ${index + 1}`}
                    width={1200}
                    height={600}
                    className="w-full h-64 sm:h-[600px] object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {fieldImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {fieldImages.length > 1 && (
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold z-10">
                {currentImageIndex + 1} / {fieldImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail dots - chỉ hiển thị dots ở dưới ảnh */}
          {fieldImages.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-1 sm:gap-2 bg-black/30 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-full">
                {fieldImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      currentImageIndex === index
                        ? 'bg-white scale-125 shadow-lg'
                        : 'bg-white/50 hover:bg-white/75 hover:scale-110'
                    }`}
                    aria-label={`Xem ảnh ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Field Name & Rating - đưa ra ngoài ảnh */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight leading-tight">
                  {selectedField?.fieldName || 'Tên sân không xác định'}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-xl border-2 border-green-200 shadow-lg">
                    <Star className="w-5 h-5 fill-green-400 text-green-400" />
                    <span className="font-black text-green-400 text-base">{averageRating}</span>
                  </div>
                  <span className="text-gray-700 font-bold text-base">
                    ({selectedField.totalBookings || 0} lượt đặt)
                  </span>
                </div>
              </div>
              
              {/* Quick Info */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-black text-sm border-2 border-gray-200 shadow-lg">
                  <LayoutGrid className="w-4 h-4" />
                  {/* Using a default value since ServerField doesn't have subYards */}
                  {selectedField.smallFieldResponses?.length || 0} sân
                </div>
                <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-black text-sm border-2 border-gray-200 shadow-lg">
                  <Users className="w-4 h-4" />
                  {selectedField.typeFieldName}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Field Information */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-40 sm:h-40 bg-green-50 rounded-full -translate-y-10 sm:-translate-y-20 translate-x-10 sm:translate-x-20 opacity-50"></div>
              
              <div className="relative">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="p-1.5 sm:p-2 rounded-xl shadow-lg">
                    <Info className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">Thông tin sân</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="group/item flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-green-100 transition-all duration-500 border border-gray-200 hover:border-green-400 hover:shadow-lg transform hover:-translate-y-1">
                      <div className="p-1.5 sm:p-2 bg-green-400 rounded-xl shadow-lg group-hover/item:shadow-xl transition-all duration-300 group-hover/item:scale-110">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1 text-sm sm:text-base">Địa chỉ</p>
                        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm font-medium">{selectedField.location}</p>
                      </div>
                    </div>
                    
                    <div className="group/item flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-green-100 transition-all duration-500 border border-gray-200 hover:border-green-400 hover:shadow-lg transform hover:-translate-y-1">
                      <div className="p-1.5 sm:p-2 bg-green-400 rounded-xl shadow-lg group-hover/item:shadow-xl transition-all duration-300 group-hover/item:scale-110">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1 text-sm sm:text-base">Giờ mở cửa</p>
                        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm font-medium">
                          {selectedField.openTime?.substring(0, 5)} - {selectedField.closeTime?.substring(0, 5)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="group/item flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-green-100 transition-all duration-500 border border-gray-200 hover:border-green-400 hover:shadow-lg transform hover:-translate-y-1">
                      <div className="p-1.5 sm:p-2 bg-green-400 rounded-xl shadow-lg group-hover/item:shadow-xl transition-all duration-300 group-hover/item:scale-110">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1 text-sm sm:text-base">Giá</p>
                        <p className="text-gray-700 font-black text-sm sm:text-base">
                          {selectedField.normalPricePerHour?.toLocaleString('vi-VN')}đ/giờ
                        </p>
                      </div>
                    </div>

                    <div className="group/item flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-green-100 transition-all duration-500 border border-gray-200 hover:border-green-400 hover:shadow-lg transform hover:-translate-y-1">
                      <div className="p-1.5 sm:p-2 bg-green-400 rounded-xl shadow-lg group-hover/item:shadow-xl transition-all duration-300 group-hover/item:scale-110">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1 text-sm sm:text-base">Môn thể thao</p>
                        <p className="text-gray-700 font-black text-sm sm:text-base">{selectedField.typeFieldName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-inner">
                  <p className="font-black text-gray-900 mb-2 text-sm sm:text-base">Mô tả</p>
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm font-medium">{selectedField.description}</p>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-green-50 rounded-full -translate-y-8 sm:-translate-y-16 -translate-x-8 sm:-translate-x-16 opacity-50"></div>
              
              <div className="relative">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-5">Thông tin chủ sân</h2>
                {selectedField && (selectedField.ownerName || selectedField.numberPhone) ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-white rounded-xl border border-gray-200 shadow-inner">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-400 rounded-2xl blur-lg opacity-20"></div>
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-2 border-white shadow-xl bg-gray-200 flex items-center justify-center overflow-hidden">
                        {selectedField.avatar ? (
                          <Image
                            src={selectedField.avatar}
                            alt={selectedField.ownerName || 'Chủ sân'}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
                        <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1">{selectedField.ownerName || 'Chủ sân'}</h3>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {selectedField.numberPhone && (
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-700 bg-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                            <span className="font-bold">{selectedField.numberPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    </div>
                    <p className="text-sm sm:text-base font-semibold">Không có thông tin chủ sân.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 sm:w-40 sm:h-40 bg-green-50 rounded-full -translate-y-10 sm:-translate-y-20 -translate-x-10 sm:-translate-x-20 opacity-50"></div>
              
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
                  <h2 className="text-lg sm:text-xl font-black text-gray-900">Đánh giá từ khách hàng</h2>
                  <div className="flex items-center gap-2 flex-wrap relative">
                    <div className="relative min-w-[120px] sm:min-w-[170px]">
                      <button
                        className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-green-400 focus:border-green-400 focus:outline-none transition-all flex items-center justify-between text-xs sm:text-sm"
                        onClick={() => setDropdownOpen(v => !v)}
                        type="button"
                        title="Sắp xếp đánh giá"
                      >
                        <span className="text-gray-700 truncate">
                          {sortOptions.find(o => o.value === sortType)?.label}
                        </span>
                        <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500 flex-shrink-0 ml-1" />
                      </button>
                      {dropdownOpen && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-green-400 rounded-lg shadow-xl">
                          {sortOptions.map(option => (
                            <button
                              key={option.value}
                              className={`w-full text-left px-2 py-1.5 sm:px-3 sm:py-2 hover:bg-green-50 transition-all text-xs sm:text-sm first:rounded-t-lg last:rounded-b-lg ${
                                sortType === option.value ? 'bg-green-100 text-green-400 font-medium' : 'text-gray-700'
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
                    <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 border-gray-200 shadow-lg">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-green-400 text-green-400" />
                      <span className="font-black text-gray-900 text-sm">{averageRating}</span>
                      <span className="text-gray-700 font-bold text-xs sm:text-sm">({reviewsData.length})</span>
                    </div>
                  </div>
                </div>

                {sortedReviews.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <div className="relative mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16">
                      <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
                      <div className="absolute inset-2 bg-white rounded-full shadow-inner flex items-center justify-center">
                        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm sm:text-base font-black mb-1">Chưa có đánh giá nào.</p>
                    <p className="text-xs sm:text-sm font-medium">Hãy là người đầu tiên đánh giá sân này!</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                    {sortedReviews.map((review, index) => (
                      <div 
                        key={review.id} 
                        className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-green-100 transition-all duration-500 transform hover:scale-[1.01] hover:-translate-y-0.5 border border-gray-200 hover:border-green-400 hover:shadow-xl group/review"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="relative">
                            <Image
                              src={review.avatar || '/default-avatar.png'}
                              alt={review.email}
                              width={32}
                              height={32}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-xl object-cover flex-shrink-0 group-hover/review:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border border-white"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-black text-gray-900 text-xs sm:text-sm">{review.email}</h4>
                              <div className="flex items-center gap-1 text-xs text-gray-600 bg-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg border border-gray-200 shadow-md">
                                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span className="font-bold">{new Date(review.createdDate).toLocaleDateString('vi-VN')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${i < review.rating ? 'fill-green-400 text-green-400 scale-110' : 'text-gray-300'}`} 
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
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 sticky top-16 border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-black mb-3 sm:mb-4 text-sm sm:text-base border-2 border-gray-200 shadow-lg">
                    <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                    {selectedField.smallFieldResponses?.length || 0} sân
                  </div>
                  <p className="text-gray-700 mb-1 text-sm sm:text-base font-bold">{selectedField.totalBookings || 0} lượt đặt</p>
                  <p className="text-gray-700 mb-3 sm:mb-4 text-xs sm:text-sm">Sẵn sàng cho trận đấu của bạn!</p>
                </div>

                <button
                  onClick={() => {
                    // Map typeFieldName to sport key expected by booking page
                    let sportKey = 'football'; // default
                    if (selectedField.typeFieldName === 'Bóng Đá') {
                      sportKey = 'football';
                    } else if (selectedField.typeFieldName === 'Cầu Lông') {
                      sportKey = 'badminton';
                    } else if (selectedField.typeFieldName === 'Pickle Ball') {
                      sportKey = 'pickle';
                    }
                    
                    router.push(`/booking?fieldId=${encodeURIComponent(selectedField.id)}&sport=${encodeURIComponent(sportKey)}`);
                  }}
                  className="w-full bg-gradient-to-br from-green-400 via-green-400 to-green-400 hover:from-green-400 hover:via-green-400 hover:to-green-400 text-white font-black py-3 px-4 sm:py-4 sm:px-5 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-2 text-base sm:text-lg border-2 border-green-400 relative overflow-hidden group/button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000"></div>
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                  <span className="relative z-10">Đặt sân ngay</span>
                </button>

                <div className="mt-2 sm:mt-3 text-center">
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
          background: #22c55e;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #22c55e;
        }
      `}</style>
    </div>
  );
};

export default FieldDetailPage;