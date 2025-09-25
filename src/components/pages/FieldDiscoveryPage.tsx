'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, StarHalf, Clock, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useFieldStore } from '../../stores/fieldStore';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export const FieldDiscoveryPage: React.FC = () => {
  const { serverFields, loading, error, fetchServerFields } = useFieldStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sport: '',
    priceRange: '',
    rating: '',
  });
  const [chipDropdown, setChipDropdown] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter(); 

  const FIELDS_PER_PAGE = 8;

  useEffect(() => {
    fetchServerFields();
  }, [fetchServerFields]);

  // Set filter from query param sport
  useEffect(() => {
    const sportParam = searchParams.get('sport');
    console.log("value:", sportParam)
    if (sportParam) {
      let sportValue = '';
      if (sportParam === 'Bóng đá') sportValue = 'football';
      else if (sportParam === 'Cầu lông') sportValue = 'badminton';
      else if (sportParam === 'Pickle Ball') sportValue = 'pickle';
      console.log("SportValue:", sportValue)
      setFilters(f => ({ ...f, sport: sportValue }));
    }
  }, [searchParams]);

  // Transform ServerField to match UI expectations
  const transformServerFieldToUI = (serverField: any) => ({
    id: serverField.id,
    name: serverField.fieldName,
    location: serverField.location,
    rating: serverField.averageRating || 0, // Use actual averageRating
    bookings: serverField.totalBookings || 0, // Use actual totalBookings
    price: `${serverField.normalPricePerHour.toLocaleString('vi-VN')}đ/giờ`,
    openingHours: `${serverField.openTime.substring(0, 5)} - ${serverField.closeTime.substring(0, 5)}`,
    image: serverField.images[0] || 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sport: serverField.typeFieldName === 'Bóng Đá' ? 'football' : 
           serverField.typeFieldName === 'Cầu Lông' ? 'badminton' : 'pickle',
    isPopular: serverField.totalBookings > 50, // Use actual totalBookings for popularity with a reasonable threshold
    subCourts: [],
    owner: undefined,
    reviewsList: [],
    startHour: parseInt(serverField.openTime.substring(0, 2)),
    endHour: parseInt(serverField.closeTime.substring(0, 2)),
  });

  const filteredFields = serverFields
    .filter((serverField: any) => serverField.available !== false) // Filter out unavailable fields
    .map(transformServerFieldToUI)
    .filter((field: any) => {
      const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSport = !filters.sport || field.sport === filters.sport;
      const matchesRating = !filters.rating || field.rating >= parseFloat(filters.rating);

      let matchesPrice = true;
      if (filters.priceRange) {
        const price = parseInt(field.price.replace(/[^\d]/g, ''));
        switch (filters.priceRange) {
          case 'under100':
            matchesPrice = price < 100000;
            break;
          case '100-150':
            matchesPrice = price >= 100000 && price < 150000;
            break;
          case '150-200':
            matchesPrice = price >= 150000 && price < 200000;
            break;
          case '200-250':
            matchesPrice = price >= 200000 && price < 250000;
            break;
          case '250-300':
            matchesPrice = price >= 250000 && price < 300000;
            break;
          case 'over300':
            matchesPrice = price >= 300000;
            break;
          default:
            matchesPrice = true;
        }
      }

      return matchesSearch && matchesSport && matchesRating && matchesPrice;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredFields.length / FIELDS_PER_PAGE);
  const startIndex = (currentPage - 1) * FIELDS_PER_PAGE;
  const paginatedFields = filteredFields.slice(startIndex, startIndex + FIELDS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Các lựa chọn cho filter
  const sportOptions = [
    { value: '', label: 'Tất cả môn thể thao' },
    { value: 'football', label: 'Bóng đá' },
    { value: 'badminton', label: 'Cầu lông' },
    { value: 'pickle', label: 'Pickle Ball' },
  ];
  const ratingOptions = [
    { value: '', label: 'Mọi đánh giá' },
    {
      value: '4.5', label: (
        <span className="flex items-center gap-0.5">
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <StarHalf className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <span className="ml-1">4.5+</span>
        </span>
      )
    },
    {
      value: '4.0', label: (
        <span className="flex items-center gap-0.5">
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <span className="ml-1">4.0+</span>
        </span>
      )
    },
    {
      value: '3.5', label: (
        <span className="flex items-center gap-0.5">
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <Star className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <StarHalf className="w-4 h-4 text-green-500" fill="#22c55e" strokeWidth={0} />
          <span className="ml-1">3.5+</span>
        </span>
      )
    },
  ];
  const priceOptions = [
    { value: '', label: 'Mọi mức giá' },
    { value: 'under100', label: 'Dưới 100.000đ' },
    { value: '100-150', label: '100.000đ - 150.000đ' },
    { value: '150-200', label: '150.000đ - 200.000đ' },
    { value: '200-250', label: '200.000đ - 250.000đ' },
    { value: '250-300', label: '250.000đ - 300.000đ' },
    { value: 'over300', label: 'Trên 300.000đ' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách sân...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchServerFields}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Search Section */}
        <div className="relative h-96 mb-12 rounded-3xl shadow-2xl">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Sân thể thao"
              fill
              className="w-full h-full object-cover"
              style={{ objectFit: 'cover' }}
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                Khám Phá Sân Thể Thao
              </h1>
              <h2 className="text-3xl lg:text-4xl font-bold text-green-400 mb-4 drop-shadow-lg">
                Hoàn Hảo Cho Bạn
              </h2>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                Tìm và đặt sân thể thao chất lượng cao với hệ thống tiện lợi nhất
              </p>
            </div>

            {/* Search Form */}
            <div className="max-w-6xl mx-auto w-full">
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  {/* Sport Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Môn thể thao
                    </label>
                    <button
                      className="w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm font-medium"
                      onClick={() => setChipDropdown(chipDropdown === 'sport' ? null : 'sport')}
                    >
                      <span className="text-gray-700 truncate">
                        {filters.sport ? sportOptions.find(o => o.value === filters.sport)?.label : 'Chọn môn thể thao'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                    </button>
                    {chipDropdown === 'sport' && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-green-500 rounded-xl shadow-2xl">
                        {sportOptions.map(option => (
                          <button
                            key={option.value}
                            className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm font-medium first:rounded-t-xl last:rounded-b-xl ${filters.sport === option.value ? 'bg-green-100 text-green-700' : 'text-gray-700'
                              }`}
                            onClick={() => {
                              setFilters(f => ({ ...f, sport: option.value }));
                              setChipDropdown(null);
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rating Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Đánh giá
                    </label>
                    <button
                      className="w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm font-medium"
                      onClick={() => setChipDropdown(chipDropdown === 'rating' ? null : 'rating')}
                    >
                      <span className="text-gray-700 truncate flex items-center">
                        {filters.rating ? ratingOptions.find(o => o.value === filters.rating)?.label : 'Chọn đánh giá'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                    </button>
                    {chipDropdown === 'rating' && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-green-500 rounded-xl shadow-2xl">
                        {ratingOptions.map(option => (
                          <button
                            key={option.value}
                            className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm font-medium first:rounded-t-xl last:rounded-b-xl flex items-center ${filters.rating === option.value ? 'bg-green-100 text-green-700' : 'text-gray-700'
                              }`}
                            onClick={() => {
                              setFilters(f => ({ ...f, rating: option.value }));
                              setChipDropdown(null);
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mức giá
                    </label>
                    <button
                      className="w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm font-medium"
                      onClick={() => setChipDropdown(chipDropdown === 'price' ? null : 'price')}
                    >
                      <span className="text-gray-700 truncate">
                        {filters.priceRange ? priceOptions.find(o => o.value === filters.priceRange)?.label : 'Chọn mức giá'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                    </button>
                    {chipDropdown === 'price' && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-green-500 rounded-xl shadow-2xl">
                        {priceOptions.map(option => (
                          <button
                            key={option.value}
                            className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm font-medium first:rounded-t-xl last:rounded-b-xl ${filters.priceRange === option.value ? 'bg-green-100 text-green-700' : 'text-gray-700'
                              }`}
                            onClick={() => {
                              setFilters(f => ({ ...f, priceRange: option.value }));
                              setChipDropdown(null);
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Input - Spans 2 columns */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tìm kiếm
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Nhập tên sân hoặc địa điểm..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all text-sm font-medium"
                        />
                      </div>
                      <button
                        onClick={() => {
                          // Trigger search - results will update automatically
                        }}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Tìm</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(filters.sport || filters.rating || filters.priceRange || searchQuery) && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        setFilters({ sport: '', priceRange: '', rating: '' });
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 text-green-600 hover:text-green-700 font-semibold transition-all text-sm border-2 border-green-600 rounded-lg hover:bg-green-50"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-8 flex justify-between items-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Kết quả tìm kiếm
            </h3>
            <p className="text-gray-600">
              Tìm thấy <span className="font-bold text-green-600">{filteredFields.length}</span> sân thể thao phù hợp
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Trang</div>
            <div className="text-lg font-bold text-gray-900">
              {currentPage} / {totalPages}
            </div>
          </div>
        </div>


        {/* Field Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {paginatedFields.map((field) => (
            <div key={field.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100">
              <div className="relative h-36">
                <Image
                  src={field.image}
                  alt={field.name}
                  width={400}
                  height={144}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 border border-green-100 shadow">
                  <Star className="w-4 h-4 text-green-500 fill-current" />
                  <span className="text-sm font-bold text-green-700">{field.rating}</span>
                </div>
                <div className="absolute top-3 left-3 bg-white text-green-700 w-9 h-9 flex items-center justify-center rounded-full text-xl shadow">
                  {field.sport === "football"
                    ? "⚽"
                    : field.sport === "badminton"
                      ? "🏸"
                      : field.sport === "pickle"
                        ? "🎾"
                        : ""}
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">{field.name}</h3>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-xs font-medium">{field.location}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-xs font-medium">{field.openingHours}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3 p-2 rounded-xl">
                  <div>
                    <div className="text-base font-bold text-green-700">
                      {field.price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-700">{field.bookings} lượt đặt</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-xl hover:bg-green-700 transition-colors font-semibold text-xs"
                    onClick={() => router.push(`/booking?fieldId=${field.id}&sport=${field.sport}`)}
                  >
                    Đặt ngay
                  </button>
                  <button
                    className="px-3 py-2 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors text-xs font-semibold"
                    onClick={() => router.push(`/field-detail/${field.id}`)}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <nav className="flex justify-center items-center gap-2" aria-label="Pagination">
              <button
                type="button"
                className="px-4 py-3 text-sm font-bold text-gray-700 bg-gray-100 border-2 border-gray-200 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {(() => {
                  const start = Math.max(1, currentPage - 2);
                  const end = Math.min(totalPages, currentPage + 2);
                  const pages = [];
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  return pages.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-12 h-12 text-sm font-bold rounded-xl transition-all ${currentPage === page
                          ? 'bg-black text-white border-2 border-black'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  ));
                })()}
              </div>

              <button
                type="button"
                className="px-4 py-3 text-sm font-bold text-gray-700 bg-gray-100 border-2 border-gray-200 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}

        {/* No Results */}
        {filteredFields.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Không tìm thấy sân nào
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc
            </p>
            <button
              onClick={() => {
                setFilters({ sport: '', priceRange: '', rating: '' });
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};