'use client'
import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  Edit2, 
  Save, 
  X, 
  Facebook, 
  Twitter, 
  Instagram, 
  Camera, 
  Shield, 
  Phone,
  Globe,
  AlertCircle,
  ChevronDown,
  Calendar,
  Users,
  AlertTriangle,
  Gift
} from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from "@/stores/authStore";
import { useFieldStore } from "@/stores/fieldStore";
import { useRouter } from 'next/navigation';

interface InlineInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder?: string;
  multiline?: boolean;
  // Add new props for special input types
  inputType?: 'text' | 'textarea' | 'select' | 'date' | 'dropdown';
  options?: { value: string; label: string }[]; // For select inputs
}

const InlineInput: React.FC<InlineInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  icon,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  placeholder = "",
  multiline = false,
  inputType = 'text',
  options = []
}) => {
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(tempValue);
    onSave();
  };

  const handleCancel = () => {
    setTempValue(value);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && inputType !== 'textarea') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Handle dropdown option selection
  const handleOptionSelect = (optionValue: string) => {
    setTempValue(optionValue);
    setDropdownOpen(false);
  };

  return (
    <div className="group">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        {!isEditing ? (
          <div 
            className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-green-300 hover:bg-green-50/30 transition-all duration-200 group"
            onClick={onEdit}
          >
            {icon && <span className="text-gray-500 flex-shrink-0">{icon}</span>}
            <span className="text-gray-900 font-medium flex-1 truncate">
              {inputType === 'select' || inputType === 'dropdown'
                ? (value && options.length > 0
                    ? options.find(option => option.value === value)?.label || value
                    : placeholder)
                : value || placeholder}
            </span>
            <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              {icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {icon}
                </div>
              )}
              {inputType === 'textarea' ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-4 py-3 border-2 border-green-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 resize-none transition-all duration-200 ${icon ? 'pl-10' : ''}`}
                  placeholder={placeholder}
                  rows={3}
                />
              ) : inputType === 'select' || inputType === 'dropdown' ? (
                <div className="relative">
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm font-medium ${icon ? 'pl-10' : ''}`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {icon && (
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {icon}
                      </div>
                    )}
                    <span className="text-gray-700 truncate flex items-center">
                      {tempValue 
                        ? options.find(o => o.value === tempValue)?.label || tempValue 
                        : placeholder}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-green-500 rounded-xl shadow-2xl">
                      {options.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm font-medium first:rounded-t-xl last:rounded-b-xl flex items-center ${
                            tempValue === option.value ? 'bg-green-100 text-green-700' : 'text-gray-700'
                          }`}
                          onClick={() => handleOptionSelect(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : inputType === 'date' ? (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type="date"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className={`w-full px-4 py-3 border-2 border-green-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 ${icon ? 'pl-10' : ''}`}
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={type}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-4 py-3 border-2 border-green-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 ${icon ? 'pl-10' : ''}`}
                  placeholder={placeholder}
                />
              )}
            </div>
            <button
              onClick={handleSave}
              className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-sm flex-shrink-0"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 shadow-sm flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Password strength indicator
const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

  return (
    <div className="mt-3">
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
              i < strength ? strengthColors[Math.min(strength - 1, 4)] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600 font-medium truncate">
        {password ? strengthLabels[Math.min(strength - 1, 4)] : 'Enter a password'}
      </p>
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  
  // Edit states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingPassword, setEditingPassword] = useState(false);
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auth store hooks
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const changePassword = useAuthStore((state) => state.changePassword);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);
  const uploadImage = useAuthStore((state) => state.uploadImage);

  // Form states (sync with user)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    cityState: "",
    postalCode: "",
    taxId: "",
    facebook: "",
    twitter: "",
    instagram: "",
    nickName: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
  });

  // Add field store hooks for vouchers
  const { userPoints, fetchUserPoints } = useFieldStore();
  
  // Fetch user profile when component mounts and user is authenticated
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const userProfile = await fetchUserProfile(user.id);
          // Update form data with fetched profile
          setFormData({
            name: userProfile.name || "",
            email: userProfile.email || "",
            phone: userProfile.phone || "",
            country: userProfile.country || "",
            cityState: userProfile.cityState || "",
            postalCode: userProfile.postalCode || "",
            taxId: userProfile.taxId || "",
            facebook: userProfile.facebook || "",
            twitter: userProfile.twitter || "",
            instagram: userProfile.instagram || "",
            nickName: userProfile.nickName || "",
            fullName: userProfile.fullName || "",
            dateOfBirth: userProfile.dateOfBirth || "",
            gender: userProfile.gender || "",
          });
          
          // Fetch user points
          await fetchUserPoints(user.id);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    loadUserProfile();
  }, [isAuthenticated, user?.id, fetchUserProfile, fetchUserPoints]);

  // Update form data when user object changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
        cityState: user.cityState || "",
        postalCode: user.postalCode || "",
        taxId: user.taxId || "",
        facebook: user.facebook || "",
        twitter: user.twitter || "",
        instagram: user.instagram || "",
        nickName: user.nickName || "",
        fullName: user.fullName || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Avatar states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Handle avatar file selection and upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Show loading state
        setLoading(true);
        
        // Upload the image first
        const imageUrl = await uploadImage(file);
        
        // Update the avatar preview
        setAvatarPreview(imageUrl);
        
        // Update the profile with the new avatar URL
        await handleFieldUpdate('avatar', imageUrl);
      } catch (err: unknown) {
        // Set error and show modal
        const error = err as Error;
        const errorMessage = error.message || "Tải ảnh lên thất bại";
        setError(errorMessage);
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Add loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Handle field updates with loading and error handling
  const handleFieldUpdate = async (field: string, value: string) => {
    setLoading(true);
    setError(null);
    
    try {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Prepare the data to match the API structure
      const profileData: Record<string, string | undefined> = {
        [field]: value
      };
      
      // Handle special fields that need to be mapped differently
      if (field === 'nickName') profileData.nickName = value;
      if (field === 'fullName') profileData.fullName = value;
      if (field === 'phone') profileData.phoneNumber = value;
      if (field === 'dateOfBirth') {
        // Format date properly for API
        profileData.dateOfBirth = value ? new Date(value).toISOString() : undefined;
      }
      if (field === 'gender') profileData.gender = value;
      if (field === 'facebook') profileData.facebook = value;
      if (field === 'twitter') profileData.twitter = value;
      if (field === 'instagram') profileData.instagram = value;
      // Handle avatar field
      if (field === 'avatar') profileData.avatar = value;
      
      await updateProfile(profileData);
      
      // Reload profile data to ensure synchronization
      if (user?.id) {
        const updatedProfile = await fetchUserProfile(user.id);
        setFormData({
          name: updatedProfile.name || "",
          email: updatedProfile.email || "",
          phone: updatedProfile.phone || "",
          country: updatedProfile.country || "",
          cityState: updatedProfile.cityState || "",
          postalCode: updatedProfile.postalCode || "",
          taxId: updatedProfile.taxId || "",
          facebook: updatedProfile.facebook || "",
          twitter: updatedProfile.twitter || "",
          instagram: updatedProfile.instagram || "",
          nickName: updatedProfile.nickName || "",
          fullName: updatedProfile.fullName || "",
          dateOfBirth: updatedProfile.dateOfBirth || "",
          gender: updatedProfile.gender || "",
        });
      }
      
      setEditingField(null);
    } catch (err: unknown) {
      // Revert the form data change
      setFormData(prev => ({ ...prev, [field]: formData[field as keyof typeof formData] }));
      
      // Set error and show modal
      const error = err as Error;
      const errorMessage = error.message || "Cập nhật thông tin thất bại";
      setError(errorMessage);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change with loading and error handling
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('Password changed successfully!');
      setEditingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err: unknown) {
      const error = err as Error;
      const errorMessage = error.message || "Thay đổi mật khẩu thất bại";
      setError(errorMessage);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Close error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError(null);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng nhập để xem trang này</h3>
          <p className="text-gray-600">Bạn cần đăng nhập để xem trang này.</p>
        </div>
      </div>
    );
  }

  // Add function to navigate to booking page
  // handleUseVoucher function has been moved to RewardsPage

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-400">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-4">Có lỗi xảy ra</h3>
              <div className="mt-4">
                <p className="text-gray-600 break-words">{error}</p>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  className="px-6 py-3 bg-green-400 text-white rounded-xl hover:bg-green-500 transition-colors duration-200 font-medium"
                  onClick={closeErrorModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mb-4"></div>
            <p className="text-gray-700 font-medium">Đang xử lý...</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sticky top-1">
              {/* Avatar Section */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-36 h-36 overflow-hidden border-4 border-gray-100 rounded-full bg-white flex items-center justify-center shadow-lg">
                    {avatarPreview ? (
                      <Image src={avatarPreview} alt="avatar" width={144} height={144} className="w-full h-full object-cover" />
                    ) : user.avatar ? (
                      <Image src={user.avatar} alt="avatar" width={144} height={144} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-18 h-18 text-gray-400" />
                    )}
                  </div>
                  <label htmlFor="avatar-upload" className="absolute -right-2 -bottom-2 bg-green-400 border-4 border-white shadow-lg rounded-full p-3 cursor-pointer flex items-center justify-center transition-all hover:bg-green-500 hover:scale-105 duration-200">
                    <Camera className="w-5 h-5 text-white" />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange} 
                    />
                  </label>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-6 truncate">
                  {formData.nickName || formData.name}
                </h2>
                {/* Display user points */}
                <div className="flex items-center justify-center gap-2 mt-3 bg-green-400 rounded-full py-2 px-4 border border-green-200">
                  <Gift className="w-5 h-5 text-white" />
                  <span className="text-lg font-bold text-white">
                    {(userPoints?.currentPoints || 0)} điểm
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-6 text-center">Liên kết mạng xã hội</h3>
                <div className="flex justify-center gap-4">
                  <a 
                    href={formData.facebook} 
                    className="p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border border-gray-200 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={formData.facebook}
                  >
                    <Facebook className="w-5 h-5 text-gray-600 hover:text-green-400" />
                  </a>
                  <a 
                    href={formData.twitter} 
                    className="p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border border-gray-200 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={formData.twitter}
                  >
                    <Twitter className="w-5 h-5 text-gray-600 hover:text-green-400" />
                  </a>
                  <a 
                    href={formData.instagram} 
                    className="p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border border-gray-200 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={formData.instagram}
                  >
                    <Instagram className="w-5 h-5 text-gray-600 hover:text-green-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Editable Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-green-400" />
                </div>
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InlineInput
                  label="Tên người dùng"
                  value={formData.nickName}
                  onChange={(value) => handleFieldUpdate('nickName', value)}
                  isEditing={editingField === 'nickName'}
                  onEdit={() => setEditingField('nickName')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Nhập tên người dùng của bạn"
                  icon={<User className="w-4 h-4 text-green-400" />}
                />
                <InlineInput
                  label="Họ và tên"
                  value={formData.fullName}
                  onChange={(value) => handleFieldUpdate('fullName', value)}
                  isEditing={editingField === 'fullName'}
                  onEdit={() => setEditingField('fullName')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Nhập họ và tên của bạn"
                  icon={<Users className="w-4 h-4 text-green-400" />}
                />
                <InlineInput
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={(value) => handleFieldUpdate('phone', value)}
                  type="tel"
                  icon={<Phone className="w-4 h-4 text-green-400" />}
                  isEditing={editingField === 'phone'}
                  onEdit={() => setEditingField('phone')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Nhập số điện thoại"
                />
                <InlineInput
                  label="Ngày sinh"
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                  onChange={(value) => handleFieldUpdate('dateOfBirth', value)}
                  isEditing={editingField === 'dateOfBirth'}
                  onEdit={() => setEditingField('dateOfBirth')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  inputType="date"
                  placeholder="Nhập ngày sinh của bạn"
                  icon={<Calendar className="w-4 h-4 text-green-400" />}
                />
                <InlineInput
                  label="Giới tính"
                  value={formData.gender}
                  onChange={(value) => handleFieldUpdate('gender', value)}
                  isEditing={editingField === 'gender'}
                  onEdit={() => setEditingField('gender')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  inputType="dropdown"
                  options={[
                    { value: 'MALE', label: 'Nam' },
                    { value: 'FEMALE', label: 'Nữ' }
                  ]}
                  placeholder="Chọn giới tính"
                  icon={<Users className="w-4 h-4 text-green-400" />}
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-400" />
                </div>
                Liên kết mạng xã hội
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InlineInput
                  label="Facebook"
                  value={formData.facebook}
                  onChange={(value) => handleFieldUpdate('facebook', value)}
                  icon={<Facebook className="w-4 h-4 text-green-400" />}
                  isEditing={editingField === 'facebook'}
                  onEdit={() => setEditingField('facebook')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="URL trang cá nhân Facebook"
                />
                <InlineInput
                  label="Twitter"
                  value={formData.twitter}
                  onChange={(value) => handleFieldUpdate('twitter', value)}
                  icon={<Twitter className="w-4 h-4 text-green-400" />}
                  isEditing={editingField === 'twitter'}
                  onEdit={() => setEditingField('twitter')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="URL trang cá nhân Twitter"
                />
                <InlineInput
                  label="Instagram"
                  value={formData.instagram}
                  onChange={(value) => handleFieldUpdate('instagram', value)}
                  icon={<Instagram className="w-4 h-4 text-green-400" />}
                  isEditing={editingField === 'instagram'}
                  onEdit={() => setEditingField('instagram')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="URL trang cá nhân Instagram"
                />
              </div>
            </div>

            {/* Password & Security */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-green-400" />
                </div>
                <span className="truncate">Mật khẩu & Bảo mật</span>
              </h3>
              
              {!editingPassword ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200 gap-4 sm:gap-0">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200 flex-shrink-0">
                        <Lock className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg truncate">Mật khẩu</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingPassword(true)}
                      className="px-4 py-3 md:px-6 md:py-3 bg-green-400 text-white rounded-xl hover:bg-green-500 transition-colors duration-200 flex items-center gap-2 font-medium whitespace-nowrap text-sm md:text-base w-full sm:w-auto justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden md:inline">Thay đổi mật khẩu</span>
                      <span className="md:hidden">Thay đổi</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition-all duration-200"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition-all duration-200"
                          placeholder="Nhập mật khẩu mới"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <PasswordStrengthIndicator password={passwordData.newPassword} />
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition-all duration-200"
                          placeholder="Xác nhận mật khẩu mới"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                        <div className="flex items-center gap-2 mt-3">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600 font-medium">Mật khẩu không khớp</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handlePasswordChange}
                      disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword || loading}
                      className="px-6 py-3 md:px-8 md:py-3 bg-green-400 text-white rounded-xl hover:bg-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium flex-1"
                    >
                      <Save className="w-4 h-4" />
                      <span className="whitespace-nowrap">Cập nhật mật khẩu</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: ""
                        });
                      }}
                      className="px-6 py-3 md:px-8 md:py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2 font-medium flex-1"
                    >
                      <X className="w-4 h-4" />
                      <span className="whitespace-nowrap">Hủy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Vouchers Section - REMOVED */}
            {/* Voucher section has been moved to the RewardsPage */}
          </div>
        </div>
      </div>
    </div>
  );
}
