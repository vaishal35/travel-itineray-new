// components/UserProfile.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, LogOut, Edit, Save, X } from 'lucide-react';

const UserProfile = ({ onClose }) => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateUserProfile({ displayName });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      setError('Failed to log out');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(currentUser?.displayName || '');
                        setError('');
                        setSuccess('');
                      }}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">
                    {currentUser?.displayName || 'No name set'}
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{currentUser?.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-gray-900">
                  {currentUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google Account' :
                   currentUser?.providerData?.[0]?.providerId === 'facebook.com' ? 'Facebook Account' :
                   'Email Account'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
