import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { forumsAPI } from '../services/api';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Clock, 
  Heart, 
  Eye, 
  ArrowLeft,
  Filter,
  TrendingUp,
  Pin,
  Lock,
  User
} from 'lucide-react';

function CategoryPosts() {
  const { categorySlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchCategoryPosts();
  }, [categorySlug, currentPage, searchQuery, sortBy]);

  const fetchCategoryPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        search: searchQuery,
        sort: sortBy
      };
      
      const response = await forumsAPI.getCategoryPosts(categorySlug, params);
      setCategory(response.data.category);
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 404) {
        setError('Category not found');
      } else {
        setError('Failed to load posts');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategoryPosts();
  };

  const handleCreatePost = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/create-post', { state: { categorySlug } });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('anxiety')) return '😰';
    if (name.includes('depression')) return '💙';
    if (name.includes('stress')) return '😮‍💨';
    if (name.includes('support')) return '🤗';
    if (name.includes('wellness')) return '🌸';
    if (name.includes('general')) return '💬';
    return '💝';
  };

  if (loading && !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-amethyst-200">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center max-w-md mx-auto">
          <MessageSquare className="h-12 w-12 text-gray-400 dark:text-amethyst-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {error}
          </h2>
          <p className="text-gray-600 dark:text-amethyst-200 mb-4">
            The category you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/forums" className="btn-primary">
            Back to Forums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link 
            to="/forums" 
            className="btn-ghost p-2 mr-4 hover:bg-rose-dust-100 dark:hover:bg-amethyst-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getCategoryIcon(category?.name)}</div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {category?.name}
              </h1>
              {category?.description && (
                <p className="text-gray-600 dark:text-amethyst-200 mt-1">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-amethyst-300">
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{category?.post_count || 0} posts</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span>Active community</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 space-y-4">
        {/* Search and Create Post */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-amethyst-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </form>

          <button
            onClick={handleCreatePost}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Post</span>
          </button>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500 dark:text-amethyst-400" />
            <span className="text-sm text-gray-600 dark:text-amethyst-200">Sort by:</span>
          </div>
          
          <div className="flex space-x-2">
            {[
              { value: 'recent', label: 'Recent' },
              { value: 'popular', label: 'Popular' },
              { value: 'oldest', label: 'Oldest' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === option.value
                    ? 'bg-rose-dust-100 dark:bg-amethyst-800 text-rose-dust-700 dark:text-amethyst-200'
                    : 'text-gray-600 dark:text-amethyst-300 hover:bg-rose-dust-50 dark:hover:bg-amethyst-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="card p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-amethyst-700 rounded-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-amethyst-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 dark:bg-amethyst-700 rounded w-16"></div>
                </div>
                <div className="h-6 bg-gray-300 dark:bg-amethyst-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-amethyst-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <Link
              key={post.post_id}
              to={`/posts/${post.post_id}`}
              className="block group"
            >
              <div className="card p-6 hover:shadow-xl transition-all duration-300 post-card animate-slide-up"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-rose-dust-100 dark:bg-amethyst-800 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-rose-dust-600 dark:text-amethyst-300" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {post.author.display_name || post.author.username}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-amethyst-400">
                          {formatTimeAgo(post.created_at)}
                        </span>
                        {post.is_pinned && (
                          <Pin className="h-4 w-4 text-rose-dust-500 dark:text-amethyst-400" />
                        )}
                        {post.is_locked && (
                          <Lock className="h-4 w-4 text-gray-500 dark:text-amethyst-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-rose-dust-600 dark:group-hover:text-amethyst-400 transition-colors">
                  {post.title}
                </h3>

                {/* Post Preview */}
                {post.content && (
                  <p className="text-gray-600 dark:text-amethyst-200 text-sm mb-4 line-clamp-2">
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 && '...'}
                  </p>
                )}

                {/* Post Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-rose-dust-50 dark:bg-amethyst-800 text-rose-dust-700 dark:text-amethyst-200 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-amethyst-400">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-amethyst-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.reply_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.like_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.view_count || 0}</span>
                    </div>
                  </div>

                  {/* Latest Reply */}
                  {post.latest_reply && (
                    <div className="flex items-center space-x-1 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>
                        Last reply by {post.latest_reply.author} {formatTimeAgo(post.latest_reply.created_at)}
                      </span>
                    </div>
                  )}
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
              {searchQuery ? 'No posts found' : 'No posts yet'}
            </h3>
            <p className="text-gray-600 dark:text-amethyst-200 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms.' 
                : 'Be the first to start a conversation in this community.'
              }
            </p>
            
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="btn-secondary"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={handleCreatePost}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Create First Post</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.page_size && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.has_previous}
              className="btn-ghost px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, Math.ceil(pagination.total / pagination.page_size)))].map((_, index) => {
                const pageNum = Math.max(1, currentPage - 2) + index;
                const totalPages = Math.ceil(pagination.total / pagination.page_size);
                
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-rose-dust-600 dark:bg-amethyst-600 text-white'
                        : 'text-gray-600 dark:text-amethyst-300 hover:bg-rose-dust-50 dark:hover:bg-amethyst-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.has_next}
              className="btn-ghost px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPosts;