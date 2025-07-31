import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { forumsAPI } from '../services/api';
import { MessageSquare, Users, Clock, Plus, Search, TrendingUp, Heart, Sparkles } from 'lucide-react';

function Forums() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await forumsAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load forum categories');
    } finally {
      setLoading(false);
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

  const getCategoryColor = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('anxiety')) return 'category-anxiety';
    if (name.includes('depression')) return 'category-depression';
    if (name.includes('stress')) return 'category-stress';
    if (name.includes('support')) return 'category-support';
    return 'category-general';
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-amethyst-200">Loading forums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden py-12 mb-8">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-1/4 w-32 h-32 bg-rose-dust-300 dark:bg-amethyst-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-4 right-1/4 w-32 h-32 bg-blush-300 dark:bg-plum-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <MessageSquare className="h-12 w-12 text-rose-dust-600 dark:text-amethyst-400" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-blush-500 dark:text-plum-400 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Community Forums
          </h1>
          <p className="text-xl text-gray-600 dark:text-amethyst-200 max-w-2xl mx-auto mb-6">
            Connect with others, share experiences, and find support in our safe, anonymous community.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link to="/create-post" className="btn-primary flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Share Your Story</span>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Join Community</span>
                </Link>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-amethyst-400" />
            <input
              type="text"
              placeholder="Search forums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 card p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchCategories}
            className="btn-secondary mt-4"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/forums/${category.slug}`}
              className="group"
            >
              <div className="card p-6 h-full hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryIcon(category.name)}</div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-rose-dust-600 dark:group-hover:text-amethyst-400 transition-colors">
                        {category.name}
                      </h3>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.name)}`}>
                        {category.post_count} {category.post_count === 1 ? 'post' : 'posts'}
                      </div>
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-gray-400 dark:text-amethyst-400 group-hover:text-rose-dust-500 dark:group-hover:text-amethyst-300 transition-colors" />
                </div>

                {/* Category Description */}
                {category.description && (
                  <p className="text-gray-600 dark:text-amethyst-200 text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>
                )}

                {/* Category Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-amethyst-300">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{category.post_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Active</span>
                    </div>
                  </div>
                  
                  {/* Latest Activity */}
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Recent activity</span>
                  </div>
                </div>

                {/* Hover Effect Indicator */}
                <div className="mt-4 flex items-center text-rose-dust-600 dark:text-amethyst-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Explore this community</span>
                  <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="card p-8 max-w-md mx-auto">
            <MessageSquare className="h-12 w-12 text-gray-400 dark:text-amethyst-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No forums found
            </h3>
            <p className="text-gray-600 dark:text-amethyst-200 mb-4">
              {searchQuery ? 'No forums match your search.' : 'No forums are available right now.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn-secondary"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}

      {/* Community Guidelines */}
      <div className="mt-16 card p-8">
        <div className="text-center">
          <Heart className="h-8 w-8 text-rose-dust-600 dark:text-amethyst-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Community Guidelines
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-amethyst-200">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Be Respectful</h4>
              <p>Treat everyone with kindness and empathy. We're all here to support each other.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Stay Anonymous</h4>
              <p>Protect your privacy and others'. Don't share personal identifying information.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Seek Help</h4>
              <p>If you're in crisis, please contact emergency services or a mental health hotline.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forums;