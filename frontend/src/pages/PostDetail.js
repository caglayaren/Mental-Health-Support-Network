import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { forumsAPI } from '../services/api';
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  Eye, 
  Clock, 
  User, 
  Send,
  Pin,
  Lock,
  AlertCircle
} from 'lucide-react';

function PostDetail() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likedReplies, setLikedReplies] = useState(new Set());

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      const response = await forumsAPI.getPostDetail(postId);
      setPost(response.data.post);
      setReplies(response.data.replies);
    } catch (error) {
      console.error('Error fetching post:', error);
      if (error.response?.status === 404) {
        setError('Post not found');
      } else {
        setError('Failed to load post');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      const response = await forumsAPI.replyToPost(postId, {
        content: replyContent
      });
      
      setReplies(prev => [...prev, response.data.reply]);
      setReplyContent('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLikePost = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await forumsAPI.likePost(postId);
      setPost(prev => ({
        ...prev,
        like_count: response.data.like_count
      }));
      
      if (response.data.liked) {
        setLikedPosts(prev => new Set([...prev, postId]));
      } else {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-amethyst-200">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-gray-400 dark:text-amethyst-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {error || 'Post not found'}
          </h2>
          <p className="text-gray-600 dark:text-amethyst-200 mb-4">
            The post you're looking for doesn't exist or has been removed.
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
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          to={`/forums/${post.category.slug}`}
          className="btn-ghost flex items-center space-x-2 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {post.category.name}</span>
        </Link>
      </div>

      {/* Post Content */}
      <div className="card p-8 mb-8 animate-slide-up">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-rose-dust-100 dark:bg-amethyst-800 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-rose-dust-600 dark:text-amethyst-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {post.author.display_name || post.author.username}
                </span>
                <span className="text-sm text-gray-500 dark:text-amethyst-400">
                  {formatTimeAgo(post.created_at)}
                </span>
                {post.is_pinned && (
                  <Pin className="h-4 w-4 text-rose-dust-500 dark:text-amethyst-400" />
                )}
                {post.is_locked && (
                  <Lock className="h-4 w-4 text-gray-500 dark:text-amethyst-500" />
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-amethyst-300">
                in {post.category.name}
              </div>
            </div>
          </div>
        </div>

        {/* Post Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {post.title}
        </h1>

        {/* Post Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
          <p className="text-gray-700 dark:text-amethyst-100 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-rose-dust-50 dark:bg-amethyst-800 text-rose-dust-700 dark:text-amethyst-200 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Stats & Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-amethyst-700">
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-amethyst-400">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.view_count || 0} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{replies.length} replies</span>
            </div>
          </div>

          <button
            onClick={handleLikePost}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              likedPosts.has(postId)
                ? 'bg-rose-dust-100 dark:bg-amethyst-800 text-rose-dust-700 dark:text-amethyst-200'
                : 'hover:bg-rose-dust-50 dark:hover:bg-amethyst-800 text-gray-600 dark:text-amethyst-300'
            }`}
          >
            <Heart className={`h-4 w-4 ${likedPosts.has(postId) ? 'fill-current' : ''}`} />
            <span>{post.like_count || 0}</span>
          </button>
        </div>
      </div>

      {/* Reply Form */}
      {user && !post.is_locked ? (
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Share your thoughts
          </h3>
          <form onSubmit={handleSubmitReply}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a supportive reply..."
              className="textarea-field mb-4"
              rows={4}
              disabled={isSubmittingReply}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingReply || !replyContent.trim()}
                className="btn-primary flex items-center space-x-2"
              >
                {isSubmittingReply ? (
                  <>
                    <div className="spinner"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Post Reply</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : !user ? (
        <div className="card p-6 mb-8 text-center">
          <p className="text-gray-600 dark:text-amethyst-200 mb-4">
            Join the conversation by signing in
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      ) : post.is_locked ? (
        <div className="card p-6 mb-8 text-center">
          <Lock className="h-8 w-8 text-gray-400 dark:text-amethyst-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-amethyst-200">
            This post is locked and no longer accepting replies.
          </p>
        </div>
      ) : null}

      {/* Replies */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Replies ({replies.length})
        </h3>
        
        {replies.length > 0 ? (
          replies.map((reply, index) => (
            <div key={reply.reply_id} className="card p-6 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-rose-dust-100 dark:bg-amethyst-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-rose-dust-600 dark:text-amethyst-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {reply.author.display_name || reply.author.username}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-amethyst-400">
                      {formatTimeAgo(reply.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-amethyst-100 whitespace-pre-wrap mb-3">
                    {reply.content}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {/* TODO: Implement reply likes */}}
                      className="flex items-center space-x-1 text-sm text-gray-500 dark:text-amethyst-400 hover:text-rose-dust-600 dark:hover:text-amethyst-300"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{reply.like_count || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 dark:text-amethyst-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-amethyst-200">
              No replies yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetail;