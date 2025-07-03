'use client'
import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  EyeOff, 
  User, 
  MapPin, 
  Lock, 
  Edit2, 
  Save, 
  X, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Camera, 
  Shield, 
  Phone,
  Mail,
  Globe,
  Hash,
  FileText,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from "@/stores/authStore";

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
  multiline = false
}) => {
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

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
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
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
            {icon && <span className="text-gray-500">{icon}</span>}
            <span className="text-gray-900 font-medium flex-1">{value || placeholder}</span>
            <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              {icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {icon}
                </div>
              )}
              {multiline ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-4 py-3 border-2 border-green-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 resize-none transition-all duration-200 ${icon ? 'pl-10' : ''}`}
                  placeholder={placeholder}
                  rows={3}
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
              className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 shadow-sm"
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
      <p className="text-xs text-gray-600 font-medium">
        {password ? strengthLabels[Math.min(strength - 1, 4)] : 'Enter a password'}
      </p>
    </div>
  );
};

export default function ProfilePage() {
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

  // Form states (sync with user)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    country: user?.country || "",
    cityState: user?.cityState || "",
    postalCode: user?.postalCode || "",
    taxId: user?.taxId || "",
    facebook: user?.facebook || "",
    twitter: user?.twitter || "",
    linkedin: user?.linkedin || "",
    instagram: user?.instagram || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        country: user.country || "",
        cityState: user.cityState || "",
        postalCode: user.postalCode || "",
        taxId: user.taxId || "",
        facebook: user.facebook || "",
        twitter: user.twitter || "",
        linkedin: user.linkedin || "",
        instagram: user.instagram || "",
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

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      // Nếu muốn cập nhật avatar lên store, có thể gọi updateProfile({ avatar: ... }) ở đây
    }
  };

  // Handle field updates
  const handleFieldUpdate = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    updateProfile({ [field]: value });
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
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
    } catch (error: unknown) {
      if (typeof error === 'object' && error && 'message' in error) {
        alert((error as { message?: string }).message || "Password change failed");
      } else {
        alert("Password change failed");
      }
    }
  };

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-700">Bạn cần đăng nhập để xem trang này.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your account information and preferences</p>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-green-50 rounded-xl border border-green-200">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Verified Account</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sticky top-24">
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
                  <label htmlFor="avatar-upload" className="absolute -right-2 -bottom-2 bg-green-600 border-4 border-white shadow-lg rounded-full p-3 cursor-pointer flex items-center justify-center transition-all hover:bg-green-700 hover:scale-105 duration-200">
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
                <h2 className="text-2xl font-bold text-gray-900 mt-6">
                  {formData.name}
                </h2>
                <p className="text-gray-600 mt-2 text-base">{formData.bio}</p>
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.cityState}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-6 text-center">Social Links</h3>
                <div className="flex justify-center gap-4">
                  <a href={formData.facebook} className="p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border border-gray-200 transition-all duration-200">
                    <Facebook className="w-5 h-5 text-gray-600 hover:text-green-600" />
                  </a>
                  <a href={formData.twitter} className="p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border border-gray-200 transition-all duration-200">
                    <Twitter className="w-5 h-5 text-gray-600 hover:text-green-600" />
                  </a>
                  <a href={formData.linkedin} className="p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border border-gray-200 transition-all duration-200">
                    <Linkedin className="w-5 h-5 text-gray-600 hover:text-green-600" />
                  </a>
                  <a href={formData.instagram} className="p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border border-gray-200 transition-all duration-200">
                    <Instagram className="w-5 h-5 text-gray-600 hover:text-green-600" />
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
                  <User className="w-5 h-5 text-green-600" />
                </div>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InlineInput
                  label="Name"
                  value={formData.name}
                  onChange={(value) => handleFieldUpdate('name', value)}
                  isEditing={editingField === 'name'}
                  onEdit={() => setEditingField('name')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Enter your name"
                />
                <InlineInput
                  label="Email Address"
                  value={formData.email}
                  onChange={(value) => handleFieldUpdate('email', value)}
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  isEditing={editingField === 'email'}
                  onEdit={() => setEditingField('email')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Enter email address"
                />
                <InlineInput
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(value) => handleFieldUpdate('phone', value)}
                  type="tel"
                  icon={<Phone className="w-4 h-4" />}
                  isEditing={editingField === 'phone'}
                  onEdit={() => setEditingField('phone')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Enter phone number"
                />
                <div className="md:col-span-2">
                  <InlineInput
                    label="Bio"
                    value={formData.bio}
                    onChange={(value) => handleFieldUpdate('bio', value)}
                    icon={<FileText className="w-4 h-4" />}
                    isEditing={editingField === 'bio'}
                    onEdit={() => setEditingField('bio')}
                    onSave={() => setEditingField(null)}
                    onCancel={() => setEditingField(null)}
                    placeholder="Tell us about yourself"
                    multiline
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InlineInput
                  label="Country"
                  value={formData.country}
                  onChange={(value) => handleFieldUpdate('country', value)}
                  icon={<Globe className="w-4 h-4" />}
                  isEditing={editingField === 'country'}
                  onEdit={() => setEditingField('country')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Enter country"
                />
                <InlineInput
                  label="City/State"
                  value={formData.cityState}
                  onChange={(value) => handleFieldUpdate('cityState', value)}
                  icon={<MapPin className="w-4 h-4" />}
                  isEditing={editingField === 'cityState'}
                  onEdit={() => setEditingField('cityState')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Enter city and state"
                />
                <InlineInput
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={(value) => handleFieldUpdate('postalCode', value)}
                  icon={<Hash className="w-4 h-4" />}
                  isEditing={editingField === 'postalCode'}
                  onEdit={() => setEditingField('postalCode')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Enter postal code"
                />
                <InlineInput
                  label="Tax ID"
                  value={formData.taxId}
                  onChange={(value) => handleFieldUpdate('taxId', value)}
                  icon={<Hash className="w-4 h-4" />}
                  isEditing={editingField === 'taxId'}
                  onEdit={() => setEditingField('taxId')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Enter tax ID"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                Social Media Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InlineInput
                  label="Facebook"
                  value={formData.facebook}
                  onChange={(value) => handleFieldUpdate('facebook', value)}
                  icon={<Facebook className="w-4 h-4" />}
                  isEditing={editingField === 'facebook'}
                  onEdit={() => setEditingField('facebook')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Facebook profile URL"
                />
                <InlineInput
                  label="Twitter"
                  value={formData.twitter}
                  onChange={(value) => handleFieldUpdate('twitter', value)}
                  icon={<Twitter className="w-4 h-4" />}
                  isEditing={editingField === 'twitter'}
                  onEdit={() => setEditingField('twitter')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Twitter profile URL"
                />
                <InlineInput
                  label="LinkedIn"
                  value={formData.linkedin}
                  onChange={(value) => handleFieldUpdate('linkedin', value)}
                  icon={<Linkedin className="w-4 h-4" />}
                  isEditing={editingField === 'linkedin'}
                  onEdit={() => setEditingField('linkedin')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="LinkedIn profile URL"
                />
                <InlineInput
                  label="Instagram"
                  value={formData.instagram}
                  onChange={(value) => handleFieldUpdate('instagram', value)}
                  icon={<Instagram className="w-4 h-4" />}
                  isEditing={editingField === 'instagram'}
                  onEdit={() => setEditingField('instagram')}
                  onSave={() => setEditingField(null)}
                  onCancel={() => setEditingField(null)}
                  placeholder="Instagram profile URL"
                />
              </div>
            </div>

            {/* Password & Security */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                Password & Security
              </h3>
              
              {!editingPassword ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                        <Lock className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">Password</p>
                        <p className="text-sm text-gray-500">Last changed 2 months ago</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingPassword(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Change Password
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                          placeholder="Enter current password"
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
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                          placeholder="Enter new password"
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
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                          placeholder="Confirm new password"
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
                          <span className="text-sm text-red-600 font-medium">Passwords do not match</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handlePasswordChange}
                      disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                      className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Update Password
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
                      className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}