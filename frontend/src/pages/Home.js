import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageSquare, Users, Shield, ArrowRight, Sparkles, Moon, Sun } from 'lucide-react';

function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Anonymous Forums",
      description: "Share your thoughts and experiences in a safe, judgment-free space.",
      color: "rose-dust"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Supportive Community",
      description: "Connect with others who understand your journey and offer mutual support.",
      color: "blush"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy First",
      description: "Your identity is protected. Share as much or as little as you're comfortable with.",
      color: "baby-blue"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Mental Wellness",
      description: "Focus on healing, growth, and building resilience together.",
      color: "powder"
    }
  ];

  const stats = [
    { number: "10K+", label: "Community Members", color: "rose-dust" },
    { number: "50K+", label: "Support Messages", color: "blush" },
    { number: "24/7", label: "Available Support", color: "baby-blue" },
    { number: "100%", label: "Anonymous & Safe", color: "powder" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-dust-300 dark:bg-amethyst-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blush-300 dark:bg-plum-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-baby-blue-300 dark:bg-lavender-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Heart className="h-16 w-16 text-rose-dust-600 dark:text-amethyst-400" />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-blush-500 dark:text-plum-400 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Mind</span>
              <span className="text-gray-900 dark:text-gray-100">Connect</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-amethyst-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              A safe, anonymous space for mental health support. 
              Connect with others, share your journey, and find the support you deserve.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!user ? (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-4">
                    Join Our Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link to="/forums" className="btn-secondary text-lg px-8 py-4">
                    Explore Forums
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/forums" className="btn-primary text-lg px-8 py-4">
                    Browse Forums
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link to="/create-post" className="btn-secondary text-lg px-8 py-4">
                    Share Your Story
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card p-6 hover:scale-105 transition-transform duration-300">
                  <div className={`text-3xl md:text-4xl font-bold text-${stat.color}-600 dark:text-amethyst-400 mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-amethyst-200 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Why Choose MindConnect?
            </h2>
            <p className="text-xl text-gray-600 dark:text-amethyst-200 max-w-2xl mx-auto">
              We've created a platform designed specifically for mental health support, 
              prioritizing your privacy, safety, and wellbeing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${feature.color}-100 dark:bg-amethyst-800 text-${feature.color}-600 dark:text-amethyst-300 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-amethyst-200 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-dust-100 to-blush-100 dark:from-amethyst-900 dark:to-plum-900 opacity-50"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              You're Not Alone
            </h2>
            <p className="text-xl text-gray-600 dark:text-amethyst-200 mb-8 leading-relaxed">
              Mental health matters, and so do you. Join thousands of others who have found 
              support, understanding, and hope in our community.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                  Start Your Journey
                  <Heart className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/login" className="btn-ghost text-lg px-8 py-4">
                  Already have an account?
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Theme showcase */}
      <section className="py-16 border-t border-rose-dust-200 dark:border-amethyst-700">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-gray-500 dark:text-amethyst-300">
            <Sun className="h-5 w-5" />
            <span>Switch between light and dark themes</span>
            <Moon className="h-5 w-5" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;