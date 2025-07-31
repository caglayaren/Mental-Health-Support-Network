import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { forumsAPI } from '../services/api';
import { 
  ArrowLeft, 
  Send, 
  AlertCircle, 
  Plus, 
  X,
  MessageSquare,
  Heart
} from 'lucide-react';

function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_slug: location.state?.categorySlug || '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await forumsAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrors({ general: 'Failed to load categories' });
    } finally {
      setLoadingCategories(false);
    }
  };

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

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && formData.tags.length < 5 && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }

    if (!formData.category_slug) {
      newErrors.category_slug = 'Please select a category';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await forumsAPI.createPost(formData);
      const createdPost = response.data.post;
      
      // Redirect to the created post
      navigate(`/posts/${createdPost.post_id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to create post. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('anxiety')) return '😰';
    if (name.includes('depression')) return '💙';
    if (name.includes('stress')) return '😮‍💨';
    if (name.includes('support')) return '🤗';
    if (name.includes('wellness')) return '🌸';
    if (name.includes('general')) return '💬';
    return '💝';
  };

  if (loadingCategories) {
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="btn-ghost p-2 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-rose-dust-600 dark:text-amethyst-400" />
            <div>
              <h1 className="text-3xl font-bold gradient-text">Share Your Story</h1>
              <p className="text-gray-600 dark:text-amethyst-200">
                Connect with others by sharing your experiences and thoughts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 animate-slide-up">
          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="mb-8 p-4 bg-baby-blue-50 dark:bg-amethyst-800/50 rounded-lg border border-baby-blue-200 dark:border-amethyst-600">
            <div className="flex items-start space-x-2">
              <Heart className="h-5 w-5 text-baby-blue-600 dark:text-amethyst-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-baby-blue-900 dark:text-amethyst-200">Safe Space Reminder</h3>
                <p className="text-xs text-baby-blue-700 dark:text-amethyst-300 mt-1">
                  Remember that this is a supportive community. Share only what you're comfortable with, 
                  and remember that others are here to help, not judge.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label htmlFor="category_slug" className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category_slug"
                name="category_slug"
                value={formData.category_slug}
                onChange={handleChange}
                className={`input-field ${errors.category_slug ? 'border-red-500 dark:border-red-500' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {getCategoryIcon(category.name)} {category.name}
                  </option>
                ))}
              </select>
              {errors.category_slug && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category_slug}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-field ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="What would you like to talk about?"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-amethyst-400">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                Your Story <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className={`textarea-field ${errors.content ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Share your thoughts, experiences, or ask for support. Remember, you're in a safe space with people who understand..."
                disabled={isLoading}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-amethyst-400">
                Minimum 20 characters • {formData.content.length} characters
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-amethyst-200 mb-2">
                Tags <span className="text-gray-400">(optional)</span>
              </label>
              
              {/* Add Tag Input */}
              <form onSubmit={handleAddTag} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add a tag (e.g., anxiety, support, coping)"
                  disabled={isLoading || formData.tags.length >= 5}
                />
                <button
                  type="submit"
                  disabled={!tagInput.trim() || formData.tags.length >= 5 || isLoading}
                  className="btn-secondary px-4 py-2 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              {/* Tags Display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-rose-dust-100 dark:bg-amethyst-800 text-rose-dust-700 dark:text-amethyst-200 text-sm rounded-full"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-rose-dust-900 dark:hover:text-amethyst-100"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500 dark:text-amethyst-400">
                Add up to 5 tags to help others find your post • {formData.tags.length}/5 tags
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-amethyst-700">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center justify-center space-x-2 flex-1 sm:flex-none"
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Publish Post</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="btn-ghost flex-1 sm:flex-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Community Guidelines
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-amethyst-200">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">✨ Be Supportive</h4>
              <p>Offer encouragement, share experiences, and be kind to others.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">🛡️ Stay Safe</h4>
              <p>Don't share personal identifying information. Keep your anonymity.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">💝 Respect Others</h4>
              <p>Everyone's journey is different. Avoid judgment and be respectful.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">🚨 Get Help</h4>
              <p>If you're in crisis, contact emergency services or a crisis hotline.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;