"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  ChevronDown,
  Target,
  Zap,
  Shield,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  Sparkles
} from "lucide-react";
import { MatchNavigation } from "./shared/MatchNavigation";
import { getSportIcon, getSportGradient } from "./shared/matchUtils";
import { useRouter } from "next/navigation";
import {
  getAllMatch,
  joinMatch,
  getTeamRequests,
} from "@/services/matchService";
import { useAuthStore } from "@/stores/authStore";
import { MatchDataResponse } from "@/services/matchService";

// Define types directly in the file
type SkillLevel = "Thấp" | "Trung bình" | "Cao" | "Chuyên nghiệp";
type MatchStatus = "open" | "full" | "finished" | "cancelled";

interface Match {
  id: string;
  title: string;
  sport: string;
  organizer: string;
  ownerId: string;
  organizerAvatar: string;
  date: string;
  time: string;
  location: string;
  address: string;
  maxParticipants: number;
  skillLevel: SkillLevel;
  description: string;
  status: MatchStatus;
  phone: string;
  facebook: string;
  role: "organizer" | "participant";
  isJoined: boolean;
  members: Array<{ userId: string; username: string; email: string }>;
  hasPendingRequest: boolean;
}

export const DiscoverMatchesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    sport: "",
    skillLevel: "",
    date: "",
  });
  const [chipDropdown, setChipDropdown] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Fetch all matches from the API
  useEffect(() => {
    const fetchMatchesAndRequests = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch matches and team requests in parallel
        const [matchesResponse, requestsResponse] = await Promise.all([
          getAllMatch(),
          getTeamRequests(user.id),
        ]);

        // Convert API response to Match format
        const convertedMatches: Match[] = matchesResponse.data.content.map(
          (match: MatchDataResponse) => {
            // Check if current user has joined this match
            const isJoined = match.members.some(
              (member) => member.userId === user?.id
            );

            // Check if there's a pending request for this match
            const hasPendingRequest = requestsResponse.data.content.some(
              (request) =>
                request.teamId === match.id.toString() &&
                request.status?.toUpperCase() === "PENDING"
            );

            return {
              id: match.id,
              title: match.nameMatch,
              sport: match.nameSport,
              organizer: match.ownerName,
              ownerId: match.ownerId,
              organizerAvatar: "",
              date: match.timeMatch.split("T")[0],
              time: match.timeMatch.split("T")[1].substring(0, 5),
              location: match.location,
              address: match.location,
              maxParticipants: match.maxPlayers,
              skillLevel:
                match.level === "LOW"
                  ? "Thấp"
                  : match.level === "MEDIUM"
                  ? "Trung bình"
                  : match.level === "HIGH"
                  ? "Cao"
                  : "Chuyên nghiệp",
              description: match.descriptionMatch,
              status: "open",
              phone: match.numberPhone,
              facebook: match.linkFacebook,
              role: match.ownerId === user?.id ? "organizer" : "participant",
              isJoined,
              members: match.members,
              hasPendingRequest,
            };
          }
        );

        setMatches(convertedMatches);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError("Có lỗi xảy ra khi tải danh sách trận đấu");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchesAndRequests();
  }, [isAuthenticated, user]);

  // Handle join match
  const handleJoinMatch = async (teamId: string) => {
    if (!user) return;

    try {
      await joinMatch(teamId);

      // Update the match to show pending request status
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.id.toString() === teamId
            ? { ...match, hasPendingRequest: true }
            : match
        )
      );
    } catch (err) {
      console.error("Error joining match:", err);
      // Handle error (e.g., show notification)
    }
  };

  // Cập nhật logic lọc trận đấu
  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = !filters.sport || match.sport === filters.sport;
    const matchesLevel =
      !filters.skillLevel || match.skillLevel === filters.skillLevel;
    const matchesDate = !filters.date || match.date === filters.date;
    const matchesStatus = match.status === "open" || match.status === "full";
    return (
      matchesSearch &&
      matchesSport &&
      matchesLevel &&
      matchesDate &&
      matchesStatus
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-80 md:h-96 lg:h-[32rem] w-full -mt-12 overflow-hidden">
      {/* Background Image - Clear and Visible */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-gray-200"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?_gl=1*197jvac*_ga*MTM4MjA3NDU0OS4xNzUxMjg5Mzg3*_ga_8JE65Q40S6*czE3NTEyODkzODYkbzEkZzEkdDE3NTEyODkzOTkkajQ3JGwwJGgw')",
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
            <Search className="w-10 h-10 md:w-14 md:h-14 text-green-400" strokeWidth={2.5} />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 text-green-400 animate-pulse" />
        </div>

        {/* Title with Shadow for Readability */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          Khám phá trận đấu
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-semibold max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Tìm kiếm và tham gia các trận đấu{' '}
          <span className="text-green-400 font-bold">thể thao</span>
          {' '}yêu thích của bạn
        </p>
      </div>
    </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <MatchNavigation />
        </div>

        <div className="space-y-8">
          {!isAuthenticated ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center space-x-2">
                <Shield className="w-6 h-6 text-gray-600" />
                <span>Vui lòng đăng nhập</span>
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Bạn cần đăng nhập để khám phá và tham gia các trận đấu thể thao.
              </p>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  <span className="ml-3 text-gray-700 font-medium">
                    Đang tải danh sách trận đấu...
                  </span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <p className="text-red-700 font-medium">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      {/* Sport Dropdown */}
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Môn thể thao
                        </label>
                        <button
                          className="w-full px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm"
                          onClick={() =>
                            setChipDropdown(
                              chipDropdown === "sport" ? null : "sport"
                            )
                          }
                          type="button"
                        >
                          <span className="text-gray-700 truncate">
                            {filters.sport
                              ? filters.sport
                              : "Chọn môn thể thao"}
                          </span>
                          <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                        </button>
                        {chipDropdown === "sport" && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-green-500 rounded-lg shadow-xl">
                            {["", "Bóng đá", "Cầu lông", "Pickle Ball"].map(
                              (option) => (
                                <button
                                  key={option}
                                  className={`w-full text-left px-3 py-2 hover:bg-green-50 transition-all text-sm first:rounded-t-lg last:rounded-b-lg ${
                                    filters.sport === option
                                      ? "bg-green-100 text-green-700 font-medium"
                                      : "text-gray-700"
                                  }`}
                                  onClick={() => {
                                    setFilters((f) => ({
                                      ...f,
                                      sport: option,
                                    }));
                                    setChipDropdown(null);
                                  }}
                                >
                                  {option || "Tất cả môn thể thao"}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      {/* Level Dropdown */}
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Trình độ
                        </label>
                        <button
                          className="w-full px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm"
                          onClick={() =>
                            setChipDropdown(
                              chipDropdown === "level" ? null : "level"
                            )
                          }
                          type="button"
                        >
                          <span className="text-gray-700 truncate">
                            {filters.skillLevel
                              ? filters.skillLevel
                              : "Chọn trình độ"}
                          </span>
                          <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                        </button>
                        {chipDropdown === "level" && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-green-500 rounded-lg shadow-xl">
                            {[
                              "",
                              "Thấp",
                              "Trung bình",
                              "Cao",
                              "Chuyên nghiệp",
                            ].map((option) => (
                              <button
                                key={option}
                                className={`w-full text-left px-3 py-2 hover:bg-green-50 transition-all text-sm first:rounded-t-lg last:rounded-b-lg ${
                                  filters.skillLevel === option
                                    ? "bg-green-100 text-green-700 font-medium"
                                    : "text-gray-700"
                                }`}
                                onClick={() => {
                                  setFilters((f) => ({
                                    ...f,
                                    skillLevel: option,
                                  }));
                                  setChipDropdown(null);
                                }}
                              >
                                {option || "Tất cả trình độ"}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Date Picker */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Ngày
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-all text-sm"
                          value={filters.date}
                          onChange={(e) =>
                            setFilters((f) => ({ ...f, date: e.target.value }))
                          }
                        />
                      </div>
                      {/* Search Input */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Tìm kiếm
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Nhập tên trận đấu, môn thể thao, địa điểm..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-all text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5"
                          >
                            <Search className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Clear Filters */}
                    {(filters.sport ||
                      filters.skillLevel ||
                      filters.date ||
                      searchQuery) && (
                      <div className="mt-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setFilters({ sport: "", skillLevel: "", date: "" });
                            setSearchQuery("");
                          }}
                          className="px-3 py-1.5 text-green-600 hover:text-green-700 font-medium transition-all text-sm"
                        >
                          Xóa tất cả bộ lọc
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 w-full">
                    <div className="bg-white rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-sm border border-gray-100 w-full">
                      <p className="text-gray-700 font-semibold flex items-center space-x-2 text-sm sm:text-base">
                        <Target className="w-4 h-4 text-green-600" />
                        <span>
                          Tìm thấy{" "}
                          <span className="text-green-600 font-bold text-lg">
                            {filteredMatches.length}
                          </span>{" "}
                          trận đấu
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/matches/create")}
                      className="bg-green-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-2xl hover:bg-green-700 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base w-full"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Tạo trận đấu</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMatches.map((match) => {
                      const SportIcon = getSportIcon(match.sport);
                      const isOrganizer = match.ownerId === user?.id;

                      return (
                        <div
                          key={match.id}
                          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 group"
                        >
                          {/* Header with sport icon and title */}
                          <div className="flex items-center space-x-3 mb-4">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getSportGradient()} flex items-center justify-center text-white shadow-sm`}
                            >
                              {React.createElement(SportIcon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors truncate">
                                {match.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {match.sport}
                              </p>
                            </div>
                          </div>

                          {/* Match details */}
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {match.date}
                              </span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span className="text-sm font-medium">
                                {match.time}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm font-medium truncate">
                                {match.location}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Users className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {1 + match.members.length}/
                                {match.maxParticipants} người
                              </span>
                            </div>
                          </div>

                          {/* Status and skill level */}
                          <div className="flex items-center justify-between mb-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                match.status === "open"
                                  ? "bg-green-100 text-green-700"
                                  : match.status === "full"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {match.status === "open"
                                ? "Đang tuyển"
                                : match.status === "full"
                                ? "Đã đầy"
                                : "Đã kết thúc"}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                              {match.skillLevel}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-6 line-clamp-4 h-20">
                            {match.description}
                          </p>

                          {/* Action button */}
                          <div className="mt-auto">
                            {isOrganizer ? (
                              <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-orange-100 text-orange-700 cursor-not-allowed">
                                Trận đấu của bạn
                              </button>
                            ) : match.isJoined ? (
                              <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 cursor-not-allowed">
                                Đã tham gia
                              </button>
                            ) : match.hasPendingRequest ? (
                              <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-yellow-100 text-yellow-700 cursor-not-allowed">
                                Chờ duyệt
                              </button>
                            ) : (
                              <button
                                className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                                onClick={() => handleJoinMatch(match.id)}
                                disabled={match.status !== "open"}
                              >
                                Tham gia ngay
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredMatches.length === 0 && (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-12 h-12 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center space-x-2">
                        <Search className="w-6 h-6 text-gray-600" />
                        <span>Không tìm thấy trận đấu nào</span>
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Có vẻ như chưa có trận đấu nào phù hợp với tiêu chí tìm
                        kiếm của bạn. Hãy thử thay đổi từ khóa hoặc tạo trận đấu
                        mới!
                      </p>
                      <button
                        onClick={() => router.push("/matches/create")}
                        className="bg-green-600 text-white px-8 py-4 rounded-2xl hover:bg-green-700 font-semibold text-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
                      >
                        <Zap className="w-5 h-5" />
                        <span>Tạo trận đấu mới</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
