import { Field, SubCourt, TimeSlot, MainSport, Review, Owner } from '../types/field';

const createSampleSlots = (subCourtId: string, startHour: number, endHour: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let day = 0; day < 28; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateString = date.toISOString().split('T')[0];
    
    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      const isBooked = Math.random() < 0.2;
      
      slots.push({
        id: `${subCourtId}-${dateString}-${startTime}`,
        date: dateString,
        startTime,
        endTime,
        isBooked,
        price: hour >= 17 && hour < 21 ? 300000 : 250000
      });
    }
  }
  
  return slots;
};

const createSubCourts = (fieldId: number, count: number, startHour: number, endHour: number): SubCourt[] => {
  const courts: SubCourt[] = [];
  
  for (let i = 1; i <= count; i++) {
    const subCourtId = `field-${fieldId}-court-${i}`;
    courts.push({
      id: subCourtId,
      name: `Sân ${i}`,
      timeSlots: createSampleSlots(subCourtId, startHour, endHour)
    });
  }
  
  return courts;
};

// Sample owners data
const owners: Owner[] = [
  {
    id: 'owner-1',
    name: 'Anh Minh Tuấn',
    phone: '0905123456',
    email: 'minhtuan@quynhoncenter.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    businessLicense: 'GP số 123/2020/UBND',
    establishedYear: 2020,
    description: 'Có 5 năm kinh nghiệm trong lĩnh vực kinh doanh sân thể thao tại Quy Nhon',
    socialMedia: {
      facebook: 'fb.com/quynhoncenter',
      zalo: '0905123456',
      website: 'quynhoncenter.vn'
    }
  },
  {
    id: 'owner-2', 
    name: 'Chị Phương Linh',
    phone: '0912345678',
    email: 'phuonglinh.sports@gmail.com',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    businessLicense: 'GP số 456/2019/UBND',
    establishedYear: 2019,
    description: 'Chuyên cung cấp dịch vụ sân bóng chất lượng cao cho cộng đồng',
    socialMedia: {
      facebook: 'fb.com/sanbongthanhpho',
      zalo: '0912345678'
    }
  },
  {
    id: 'owner-3',
    name: 'Anh Đức Mạnh',
    phone: '0938765432',
    email: 'ducmanh.sports@yahoo.com',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150',
    businessLicense: 'GP số 789/2021/UBND',
    establishedYear: 2021,
    description: 'Mong muốn mang đến không gian thể thao xanh, sạch cho mọi người',
    socialMedia: {
      zalo: '0938765432'
    }
  },
  {
    id: 'owner-4',
    name: 'Ông Hoàng Việt',
    phone: '0907111222',
    email: 'hoangviet.badminton@gmail.com',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
    businessLicense: 'GP số 111/2018/UBND',
    establishedYear: 2018,
    description: 'Chuyên gia cầu lông với 10 năm kinh nghiệm, từng là VĐV cấp quốc gia',
    socialMedia: {
      facebook: 'fb.com/caulonghoanggia',
      zalo: '0907111222',
      website: 'caulonghoanggia.com'
    }
  },
  {
    id: 'owner-5',
    name: 'Bà Thanh Hương',
    phone: '0913456789',
    email: 'thanhuong.premium@gmail.com',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
    businessLicense: 'GP số 222/2019/UBND',
    establishedYear: 2019,
    description: 'Tập trung vào dịch vụ cao cấp và chăm sóc khách hàng tận tình',
    socialMedia: {
      facebook: 'fb.com/caulongpremium',
      zalo: '0913456789'
    }
  },
  {
    id: 'owner-6',
    name: 'Anh Trung Kiên',
    phone: '0909888777',
    email: 'trungkien.student@gmail.com',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    businessLicense: 'GP số 333/2020/UBND',
    establishedYear: 2020,
    description: 'Mong muốn hỗ trợ sinh viên với giá cả phải chăng nhất',
    socialMedia: {
      facebook: 'fb.com/caulongsinhvien',
      zalo: '0909888777'
    }
  },
  {
    id: 'owner-7',
    name: 'Chị Hải Yến',
    phone: '0916123456',
    email: 'haiyen.marina@gmail.com',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    businessLicense: 'GP số 444/2021/UBND',
    establishedYear: 2021,
    description: 'Người tiên phong đưa Pickle Ball đến Quy Nhon với view biển tuyệt đẹp',
    socialMedia: {
      facebook: 'fb.com/pickleballmarina',
      zalo: '0916123456',
      website: 'pickleballmarina.vn'
    }
  },
  {
    id: 'owner-8',
    name: 'Anh Quốc Dũng',
    phone: '0925555666',
    email: 'quocdung.riverside@gmail.com',
    avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150',
    businessLicense: 'GP số 555/2020/UBND',
    establishedYear: 2020,
    description: 'Yêu thích không gian ven sông mát mẻ, phù hợp mọi lứa tuổi',
    socialMedia: {
      zalo: '0925555666'
    }
  },
  {
    id: 'owner-9',
    name: 'Ông Minh Đức',
    phone: '0932777888',
    email: 'minhduc.central@gmail.com',
    avatar: 'https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=150',
    businessLicense: 'GP số 666/2019/UBND',
    establishedYear: 2019,
    description: 'Chuyên gia Pickle Ball với trang thiết bị hiện đại nhất thành phố',
    socialMedia: {
      facebook: 'fb.com/pickleballcentral',
      zalo: '0932777888',
      website: 'pickleballcentral.vn'
    }
  }
];

// Sample reviews data
const generateReviews = (fieldId: number, count: number): Review[] => {
  const sampleUsers = [
    { name: 'Minh Hoàng', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Phương Anh', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Tuấn Anh', avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Thu Hà', avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Văn Đức', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Hoài Thu', avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100' }
  ];

  const sampleComments = {
    5: [
      'Sân rất đẹp, sạch sẽ. Chủ sân nhiệt tình, giá cả hợp lý!',
      'Tuyệt vời! Sân chất lượng cao, đặt lịch dễ dàng.',
      'Rất hài lòng với dịch vụ ở đây. Sẽ quay lại!',
      'Sân đẹp, tiện ích đầy đủ. Highly recommended!'
    ],
    4: [
      'Sân tốt, chỉ có điều đỗ xe hơi khó một chút.',
      'Chất lượng sân ổn, giá hợp lý cho khu vực trung tâm.',
      'Sân sạch, nhân viên thân thiện. Có thể cải thiện thêm về ánh sáng.',
      'Tổng thể tốt, sẽ giới thiệu cho bạn bè.'
    ],
    3: [
      'Sân bình thường, phù hợp với giá tiền.',
      'Vị trí thuận tiện nhưng sân hơi cũ.',
      'Dịch vụ ổn, có thể cải thiện thêm về tiện nghi.'
    ]
  };

  const reviews: Review[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const user = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
    const rating = Math.random() < 0.7 ? (Math.random() < 0.8 ? 5 : 4) : 3;
    const comments = sampleComments[rating as keyof typeof sampleComments];
    const comment = comments[Math.floor(Math.random() * comments.length)];
    
    const reviewDate = new Date(today);
    reviewDate.setDate(today.getDate() - Math.floor(Math.random() * 60));
    
    reviews.push({
      id: `review-${fieldId}-${i + 1}`,
      userId: `user-${fieldId}-${i + 1}`,
      userName: user.name,
      rating,
      comment,
      date: reviewDate.toISOString(),
      userAvatar: user.avatar
    });
  }

  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const allFields: Field[] = [
  // Football Fields
  {
    id: 1,
    name: 'Sân bóng Quy Nhon Center',
    location: 'Trung tâm Quy Nhon',
    rating: 4.8,
    reviews: 5,
    reviewsList: generateReviews(1, 5),
    price: '250.000đ/giờ',
    openingHours: '06:00 - 21:00',
    startHour: 6,
    endHour: 21,
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sân bóng đá mini chất lượng cao, có mái che và ánh sáng tốt.',
    sport: 'football',
    isPopular: true,
    subCourts: createSubCourts(1, 2, 6, 21),
    owner: owners[0]
  },
  {
    id: 2,
    name: 'Sân bóng đá Thành Phố',
    location: 'Nguyễn Huệ',
    rating: 4.6,
    reviews: 6,
    reviewsList: generateReviews(2, 6),
    price: '200.000đ/giờ',
    openingHours: '05:30 - 22:00',
    startHour: 6,
    endHour: 22,
    image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sân bóng đá cỏ nhân tạo chất lượng cao, phù hợp cho các trận đấu lớn.',
    sport: 'football',
    isPopular: true,
    subCourts: createSubCourts(2, 3, 6, 22),
    owner: owners[1]
  },
  {
    id: 3,
    name: 'Sân bóng Công Viên',
    location: 'Trần Phú',
    rating: 4.2,
    reviews: 2,
    reviewsList: generateReviews(3, 2),
    price: '180.000đ/giờ',
    openingHours: '07:00 - 20:00',
    startHour: 7,
    endHour: 20,
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sân bóng đá ngoài trời với không gian xanh, thoải mái.',
    sport: 'football',
    isPopular: false,
    subCourts: createSubCourts(3, 2, 7, 20),
    owner: owners[2]
  },

  // Badminton Fields
  {
    id: 4,
    name: 'Sân cầu lông Hoàng Gia',
    location: 'Lê Hồng Phong',
    rating: 4.9,
    reviews: 4,
    reviewsList: generateReviews(4, 4),
    price: '100.000đ/giờ',
    openingHours: '07:00 - 22:00',
    startHour: 7,
    endHour: 22,
    image: 'https://images.pexels.com/photos/8224103/pexels-photo-8224103.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sân cầu lông chuyên nghiệp với sàn gỗ và hệ thống ánh sáng hiện đại.',
    sport: 'badminton',
    isPopular: true,
    subCourts: createSubCourts(4, 4, 7, 22),
    owner: owners[3]
  },
  {
    id: 5,
    name: 'Sân cầu lông Premium',
    location: 'Trần Hưng Đạo',
    rating: 4.8,
    reviews: 5,
    reviewsList: generateReviews(5, 5),
    price: '120.000đ/giờ',
    openingHours: '06:00 - 21:30',
    startHour: 6,
    endHour: 21,
    image: 'https://images.pexels.com/photos/8224108/pexels-photo-8224108.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sân cầu lông cao cấp với điều hòa và dịch vụ tốt nhất.',
    sport: 'badminton',
    isPopular: true,
    subCourts: createSubCourts(5, 3, 6, 21),
    owner: owners[4]
  },
  {
    id: 6,
    name: 'Sân cầu lông Sinh Viên',
    location: 'Đại học Quy Nhon',
    rating: 4.3,
    reviews: 4,
    reviewsList: generateReviews(6, 4),
    price: '80.000đ/giờ',
    openingHours: '08:00 - 20:00',
    startHour: 8,
    endHour: 20,
    image: 'https://images.pexels.com/photos/8224103/pexels-photo-8224103.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sân cầu lông giá rẻ dành cho sinh viên và người có thu nhập thấp.',
    sport: 'badminton',
    isPopular: false,
    subCourts: createSubCourts(6, 2, 8, 20),
    owner: owners[5]
  },

  // Pickle Ball Fields
  {
    id: 7,
    name: 'Sân Pickle Ball Marina',
    location: 'Ven biển Quy Nhon',
    rating: 4.7,
    reviews: 3,
    reviewsList: generateReviews(7, 3),
    price: '120.000đ/giờ',
    openingHours: '08:00 - 20:00',
    startHour: 8,
    endHour: 20,
    image: 'https://images.pexels.com/photos/8224122/pexels-photo-8224122.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sân Pickle Ball view biển tuyệt đẹp, không gian thoáng đãng.',
    sport: 'pickle',
    isPopular: true,
    subCourts: createSubCourts(7, 2, 8, 20),
    owner: owners[6]
  },
  {
    id: 8,
    name: 'Sân Pickle Ball Riverside',
    location: 'Bạch Đằng',
    rating: 4.6,
    reviews: 5,
    reviewsList: generateReviews(8, 5),
    price: '140.000đ/giờ',
    openingHours: '07:00 - 21:00',
    startHour: 7,
    endHour: 21,
    image: 'https://images.pexels.com/photos/8224122/pexels-photo-8224122.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sân Pickle Ball ven sông, không gian mát mẻ.',
    sport: 'pickle',
    isPopular: false,
    subCourts: createSubCourts(8, 3, 7, 21),
    owner: owners[7]
  },
  {
    id: 9,
    name: 'Sân Pickle Ball Central',
    location: 'Ngô Mây',
    rating: 4.8,
    reviews: 4,
    reviewsList: generateReviews(9, 4),
    price: '150.000đ/giờ',
    openingHours: '06:00 - 22:00',
    startHour: 6,
    endHour: 22,
    image: 'https://images.pexels.com/photos/8224122/pexels-photo-8224122.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sân Pickle Ball trung tâm thành phố, tiện lợi và hiện đại.',
    sport: 'pickle',
    isPopular: true,
    subCourts: createSubCourts(9, 4, 6, 22),
    owner: owners[8]
  }
];

export const popularFields: Field[] = allFields.filter(field => field.isPopular);

export const mainSports: MainSport[] = [
  {
    name: "Cầu lông",
    icon: "🏸",
    description: "Cầu lông là môn thể thao trong nhà phổ biến, phù hợp với mọi lứa tuổi.",
    courts: allFields.filter(f => f.sport === 'badminton').length,
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Bóng đá",
    icon: "⚽",
    description: "Bóng đá – môn thể thao vua – luôn là lựa chọn hàng đầu cho các hoạt động thể chất.",
    courts: allFields.filter(f => f.sport === 'football').length,
    color: "from-emerald-500 to-green-600",
  },
  {
    name: "Pickle Ball",
    icon: "🎾",
    description: "Pickle Ball là môn thể thao kết hợp giữa tennis, cầu lông và bóng bàn.",
    courts: allFields.filter(f => f.sport === 'pickle').length,
    color: "from-emerald-500 to-green-600",
  },
];

// Export thêm data để sử dụng riêng biệt
export { owners };