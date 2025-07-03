import { Match } from '../types/match';

export const MOCK_MATCHES: Match[] = [
  {
    id: 1,
    title: 'Giao hữu bóng đá cuối tuần',
    sport: 'Bóng đá',
    organizer: 'Nguyễn Văn An',
    organizerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-05',
    time: '16:00',
    location: 'Sân Quy Nhon Center',
    address: '123 Trần Hưng Đạo, Quy Nhon',
    maxParticipants: 10,
    skillLevel: 'Trung bình',
    description: 'Tìm thêm 2 người chơi bóng đá giao hữu. Không phân biệt trình độ, miễn là vui vẻ!',
    status: 'open',
    phone: '0123456789',
    facebook: 'https://facebook.com/nguyenvanan',
    role: 'organizer',
    joinRequests: [
      { user: 'Trần Thị Bình', status: 'pending' },
      { user: 'Lê Văn Cường', status: 'approved' }
    ]
  },
  {
    id: 2,
    title: 'Cầu lông tối thứ 6',
    sport: 'Cầu lông',
    organizer: 'Trần Thị Bình',
    organizerAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-06',
    time: '18:00',
    location: 'Sân Hoàng Gia',
    address: '456 Lê Hồng Phong, Quy Nhon',
    maxParticipants: 8,
    skillLevel: 'Cao',
    description: 'Tìm đối thủ cầu lông trình độ cao để luyện tập. Yêu cầu có kinh nghiệm chơi ít nhất 2 năm.',
    status: 'open',
    phone: '0987654321',
    facebook: 'https://facebook.com/tranthibinh',
    role: 'organizer',
    joinRequests: [
      { user: 'Nguyễn Văn An', status: 'pending' },
      { user: 'Lê Văn Cường', status: 'approved' }
    ]
  },
  {
    id: 3,
    title: 'Pickle Ball buổi sáng',
    sport: 'Pickle Ball',
    organizer: 'Lê Văn Cường',
    organizerAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-07',
    time: '07:00',
    location: 'Sân Marina',
    address: '789 Ven biển, Quy Nhon',
    maxParticipants: 6,
    skillLevel: 'Thấp',
    description: 'Mời mọi người thử môn thể thao mới. Sẽ có hướng dẫn cơ bản cho người mới bắt đầu.',
    status: 'open',
    phone: '0909090909',
    facebook: 'https://facebook.com/levancuong',
    role: 'organizer',
    joinRequests: [
      { user: 'Nguyễn Văn An', status: 'approved' }
    ]
  },
  {
    id: 4,
    title: 'Bóng đá giao hữu buổi tối',
    sport: 'Bóng đá',
    organizer: 'Lê Văn Cường',
    organizerAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-08',
    time: '20:00',
    location: 'Sân Thể Thao Thành Phố',
    address: '12 Nguyễn Huệ, Quy Nhon',
    maxParticipants: 10,
    skillLevel: 'Cao',
    description: 'Đội bóng đá đã đủ người, hẹn gặp lại lần sau!',
    status: 'open',
    phone: '0111222333',
    facebook: 'https://facebook.com/levancuong',
    role: 'organizer',
    joinRequests: [
      { user: 'Nguyễn Văn An', status: 'approved' },
      { user: 'Trần Thị Bình', status: 'approved' }
    ]
  },
  {
    id: 5,
    title: 'Cầu lông nữ cuối tuần',
    sport: 'Cầu lông',
    organizer: 'Trần Thị Bình',
    organizerAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-10',
    time: '15:00',
    location: 'Sân Cầu Lông Nữ',
    address: '22 Lê Lợi, Quy Nhon',
    maxParticipants: 8,
    skillLevel: 'Trung bình',
    description: 'Ưu tiên các bạn nữ, giao lưu cuối tuần.',
    status: 'open',
    phone: '0888777666',
    facebook: 'https://facebook.com/tranthibinh',
    role: 'organizer',
    joinRequests: [
      { user: 'Nguyễn Văn An', status: 'pending' }
    ]
  },
  {
    id: 6,
    title: 'Pickle Ball giao lưu cuối tuần',
    sport: 'Pickle Ball',
    organizer: 'Nguyễn Văn An',
    organizerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-12',
    time: '09:00',
    location: 'Sân Pickle Ball Quy Nhơn',
    address: '99 Nguyễn Thị Minh Khai, Quy Nhon',
    maxParticipants: 8,
    skillLevel: 'Chuyên nghiệp',
    description: 'Giao lưu Pickle Ball trình độ cao, ưu tiên các bạn đã từng thi đấu.',
    status: 'open',
    phone: '0999888777',
    facebook: 'https://facebook.com/nguyenvanan',
    role: 'organizer',
    joinRequests: [
      { user: 'Trần Thị Bình', status: 'pending' }
    ]
  },
  {
    id: 7,
    title: 'Bóng đá đã đầy',
    sport: 'Bóng đá',
    organizer: 'Nguyễn Văn An',
    organizerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-15',
    time: '16:00',
    location: 'Sân Quy Nhon Center',
    address: '123 Trần Hưng Đạo, Quy Nhon',
    maxParticipants: 3,
    skillLevel: 'Trung bình',
    description: 'Tìm thêm 2 người chơi bóng đá giao hữu. Không phân biệt trình độ, miễn là vui vẻ!',
    status: 'full',
    phone: '0123456789',
    facebook: 'https://facebook.com/nguyenvanan',
    role: 'organizer',
    joinRequests: [
      { user: 'Trần Thị Bình', status: 'approved' },
      { user: 'Lê Văn Cường', status: 'approved' }
    ]
  },
  {
    id: 8,
    title: 'Cầu lông đã kết thúc',
    sport: 'Cầu lông',
    organizer: 'Trần Thị Bình',
    organizerAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-18',
    time: '18:00',
    location: 'Sân Hoàng Gia',
    address: '456 Lê Hồng Phong, Quy Nhon',
    maxParticipants: 8,
    skillLevel: 'Cao',
    description: 'Tìm đối thủ cầu lông trình độ cao để luyện tập. Yêu cầu có kinh nghiệm chơi ít nhất 2 năm.',
    status: 'finished',
    phone: '0987654321',
    facebook: 'https://facebook.com/tranthibinh',
    role: 'organizer',
    joinRequests: [
      { user: 'Nguyễn Văn An', status: 'pending' },
      { user: 'Lê Văn Cường', status: 'approved' }
    ]
  },
  {
    id: 9,
    title: 'Pickle Ball đã bị hủy',
    sport: 'Pickle Ball',
    organizer: 'Lê Văn Cường',
    organizerAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-20',
    time: '07:00',
    location: 'Sân Marina',
    address: '789 Ven biển, Quy Nhon',
    maxParticipants: 6,
    skillLevel: 'Thấp',
    description: 'Mời mọi người thử môn thể thao mới. Sẽ có hướng dẫn cơ bản cho người mới bắt đầu.',
    status: 'cancelled',
    phone: '0909090909',
    facebook: 'https://facebook.com/levancuong',
    role: 'organizer',
    joinRequests: [
      { user: 'Nguyễn Văn An', status: 'approved' }
    ]
  },
  {
    id: 10,
    title: 'Bóng đá giao hữu sáng thứ 7',
    sport: 'Bóng đá',
    organizer: 'Trần Thị Bình',
    organizerAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-22',
    time: '08:00',
    location: 'Sân Thành Công',
    address: '88 Nguyễn Thị Minh Khai, Quy Nhon',
    maxParticipants: 5,
    skillLevel: 'Thấp',
    description: 'Giao hữu bóng đá cho mọi lứa tuổi, ưu tiên các bạn mới.',
    status: 'open',
    phone: '0123456788',
    facebook: 'https://facebook.com/tranthibinh',
    role: 'organizer',
    joinRequests: [
      { user: 'Nguyễn Văn An', status: 'approved' },
      { user: 'Lê Văn Cường', status: 'pending' }
    ]
  },
  {
    id: 11,
    title: 'Pickle Ball nữ giao lưu',
    sport: 'Pickle Ball',
    organizer: 'Nguyễn Văn An',
    organizerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-23',
    time: '10:00',
    location: 'Sân Pickle Ball Nữ',
    address: '22 Lê Lợi, Quy Nhon',
    maxParticipants: 4,
    skillLevel: 'Trung bình',
    description: 'Ưu tiên các bạn nữ, giao lưu Pickle Ball cuối tuần.',
    status: 'open',
    phone: '0999888778',
    facebook: 'https://facebook.com/nguyenvanan',
    role: 'organizer',
    joinRequests: [
      { user: 'Trần Thị Bình', status: 'approved' }
    ]
  },
  {
    id: 12,
    title: 'Cầu lông giao hữu cao cấp',
    sport: 'Cầu lông',
    organizer: 'Lê Văn Cường',
    organizerAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-24',
    time: '19:00',
    location: 'Sân Cầu Lông VIP',
    address: '99 Nguyễn Huệ, Quy Nhon',
    maxParticipants: 6,
    skillLevel: 'Chuyên nghiệp',
    description: 'Chỉ dành cho các bạn đã từng thi đấu giải.',
    status: 'full',
    phone: '0909090999',
    facebook: 'https://facebook.com/levancuong',
    role: 'organizer',
    joinRequests: [
      { user: 'Nguyễn Văn An', status: 'approved' },
      { user: 'Trần Thị Bình', status: 'approved' },
      { user: 'Lê Văn Cường', status: 'approved' },
      { user: 'Nguyễn Văn An', status: 'approved' },
      { user: 'Trần Thị Bình', status: 'approved' }
    ]
  },
  {
    id: 13,
    title: 'Bóng đá mini đã kết thúc',
    sport: 'Bóng đá',
    organizer: 'Lê Văn Cường',
    organizerAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-10',
    time: '17:00',
    location: 'Sân Mini',
    address: '12 Nguyễn Huệ, Quy Nhon',
    maxParticipants: 6,
    skillLevel: 'Cao',
    description: 'Trận đấu đã kết thúc, cảm ơn mọi người đã tham gia!',
    status: 'finished',
    phone: '0111222334',
    facebook: 'https://facebook.com/levancuong',
    role: 'organizer',
    joinRequests: [
      { user: 'Nguyễn Văn An', status: 'approved' },
      { user: 'Trần Thị Bình', status: 'approved' }
    ]
  },
  {
    id: 14,
    title: 'Pickle Ball bị hủy',
    sport: 'Pickle Ball',
    organizer: 'Trần Thị Bình',
    organizerAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-01-25',
    time: '14:00',
    location: 'Sân Pickle Ball',
    address: '88 Nguyễn Thị Minh Khai, Quy Nhon',
    maxParticipants: 4,
    skillLevel: 'Thấp',
    description: 'Trận đấu đã bị hủy do thời tiết xấu.',
    status: 'cancelled',
    phone: '0123456799',
    facebook: 'https://facebook.com/tranthibinh',
    role: 'organizer',
    joinRequests: [
      { user: 'Lê Văn Cường', status: 'approved' }
    ]
  }
];
