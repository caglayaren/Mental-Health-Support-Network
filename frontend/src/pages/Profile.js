import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle,
  Settings,
  Moon,
  Sun,
  Shield,
  Heart,
  Trash2,
  LogOut
} from 'lucide-react';

function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    preferred_topics: []
  });
  const [topicInput, setTopicInput] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setFormData({
      display_name: user.display_name || '',
      bio: user.bio || '',
      preferred_topics: user.preferred_topics || []
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (topicInput.trim() && formData.preferred_topics.length < 10 && !formData.preferred_topics.includes(topicInput.trim())) {
      setFormData(prev => ({
        ...prev,
        preferred_topics: [...prev.preferred_topics, topicInput.trim()]
      }));
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (topicToRemove) => {
    setFormData(prev => ({
      ...prev,
      preferred_topics: prev.preferred_topics.filter(topic => topic !== topicToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    setIsLoading(true);

    // Validation
    const newErrors = {};
    if (formData.display_name && formData.display_name.length > 50) {
      newErrors.display_name = 'Display name must be less than 50 characters';
    }
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors(result.error);
      }
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      display_name: user.display_name || '',
      bio: user.bio || '',
      preferred_topics: user.preferred_topics || []
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-amethyst-200">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-amethyst-200">
            Manage your anonymous profile and preferences
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">{success}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{errors.general}</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="card p-8 animate-slide-up">
              {/* Profile Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-rose-dust-100 dark:bg-amethyst-800 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-rose-dust-600 dark:text-amethyst-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {user.display_name || user.username}
                    </h2>
                    <p className="text-gray-600 dark:text-amethyst-200">
                      Member since {formatJoinDate(user.created_at)}
                    </p>
                  </div>
                </div>
                
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="mb-8 p-4 bg-baby-blue-50 dark:bg-amethyst-800/50 rounded-lg border border-baby-blue-200 dark:border-amethyst-600">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-baby-blue-600 dark:text-amethyst-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-baby-blue-900 dark:text-amethyst-200">Anonymous Profile</h3>
                    <p className="text-xs text-baby-blue-700 dark:text-amethyst-300 mt-1">
                      Your username ({user.username}) and display name are the only information visible to other users. 
                      Everything else remains private.
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit}>
                {/* Display Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                    Display Name
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="display_name"
                        value={formData.display_name}
                        onChange={handleChange}
                        className={`input-field ${errors.display_name ? 'border-red-500' : ''}`}
                        placeholder="How you'd like to be called"
                        disabled={isLoading}
                      />
                      {errors.display_name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.display_name}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-amethyst-400">
                        {formData.display_name.length}/50 characters
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100 py-2">
                      {user.display_name || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className={`textarea-field ${errors.bio ? 'border-red-500' : ''}`}
                        placeholder="Tell others a bit about yourself (optional)"
                        disabled={isLoading}
                      />
                      {errors.bio && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-amethyst-400">
                        {formData.bio.length}/500 characters
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100 py-2 whitespace-pre-wrap">
                      {user.bio || 'No bio added yet'}
                    </p>
                  )}
                </div>

                {/* Preferred Topics */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                    Interested Topics
                  </label>
                  
                  {isEditing && (
                    <div className="mb-3">
                      <form onSubmit={handleAddTopic} className="flex gap-2">
                        <input
                          type="text"
                          value={topicInput}
                          onChange={(e) => setTopicInput(e.target.value)}
                          className="input-field flex-1"
                          placeholder="Add a topic of interest"
                          disabled={isLoading || formData.preferred_topics.length >= 10}
                        />
                        <button
                          type="submit"
                          disabled={!topicInput.trim() || formData.preferred_topics.length >= 10 || isLoading}
                          className="btn-secondary px-4 py-2 disabled:opacity-50"
                        >
                          Add
                        </button>
                      </form>
                      <p className="mt-1 text-xs text-gray-500 dark:text-amethyst-400">
                        {formData.preferred_topics.length}/10 topics
                      </p>
                    </div>
                  )}

                  {/* Topics Display */}
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? formData.preferred_topics : user.preferred_topics || []).map((topic, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-rose-dust-100 dark:bg-amethyst-800 text-rose-dust-700 dark:text-amethyst-200 text-sm rounded-full"
                      >
                        {topic}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(topic)}
                            className="ml-1 hover:text-rose-dust-900 dark:hover:text-amethyst-100"
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                    {(!user.preferred_topics || user.preferred_topics.length === 0) && !isEditing && (
                      <span className="text-gray-500 dark:text-amethyst-400 text-sm">No topics added yet</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-amethyst-700">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="btn-ghost flex items-center justify-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Theme Settings */}
            <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Preferences</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-amethyst-200">
                      Theme
                    </label>
                    <p className="text-xs text-gray-500 dark:text-amethyst-400">
                      Choose your preferred theme
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="btn-ghost p-2"
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Account</span>
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full btn-ghost flex items-center justify-center space-x-2 text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full btn-ghost text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>

            {/* User Stats */}
            <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Your Impact
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-amethyst-200">Member since</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatJoinDate(user.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-amethyst-200">User ID</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
                    {user.user_id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Delete Account
            </h3>
            <p className="text-gray-600 dark:text-amethyst-200 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your posts and replies will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement account deletion
                  setShowDeleteConfirm(false);
                }}
                className="btn-primary bg-red-600 hover:bg-red-700 flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;