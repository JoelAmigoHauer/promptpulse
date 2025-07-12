import React, { useEffect, useState } from 'react';
import { Trophy, Star, Zap, TrendingUp, Target, Crown } from 'lucide-react';

const CelebrationAnimations = ({ 
  isVisible, 
  type = 'grade-improvement', 
  onComplete,
  oldGrade = 'C',
  newGrade = 'A',
  prompt = '',
  ranking = 1 
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      generateParticles();
      
      // Auto-hide after animation completes
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        delay: Math.random() * 2,
        type: Math.random() > 0.5 ? 'star' : 'confetti'
      });
    }
    setParticles(newParticles);
  };

  const getCelebrationContent = () => {
    switch (type) {
      case 'grade-improvement':
        return {
          icon: <TrendingUp className="w-16 h-16 text-green-500" />,
          title: `Content Grade Improved!`,
          subtitle: `From ${oldGrade} to ${newGrade}`,
          message: "Your content optimization is working! Keep up the great work.",
          color: 'green'
        };
      
      case 'top-ranking':
        return {
          icon: <Crown className="w-16 h-16 text-yellow-500" />,
          title: `🎉 #1 Ranking Achieved!`,
          subtitle: `"${prompt}"`,
          message: "You've captured the top spot! Your authority is established.",
          color: 'yellow'
        };
      
      case 'first-win':
        return {
          icon: <Trophy className="w-16 h-16 text-blue-500" />,
          title: `First Win Unlocked!`,
          subtitle: `Analytics dashboard now available`,
          message: "You're on your way to AEO mastery! Check out your new insights.",
          color: 'blue'
        };
      
      case 'content-published':
        return {
          icon: <Zap className="w-16 h-16 text-purple-500" />,
          title: `Content Brief Generated!`,
          subtitle: `Ready for implementation`,
          message: "Your strategic content brief is ready. Time to create authority-building content!",
          color: 'purple'
        };

      default:
        return {
          icon: <Star className="w-16 h-16 text-gold-500" />,
          title: `Great Job!`,
          subtitle: `Progress achieved`,
          message: "You're making excellent progress on your AEO journey.",
          color: 'gold'
        };
    }
  };

  const content = getCelebrationContent();

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20 animate-fade-in" />
      
      {/* Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute animate-confetti-fall ${particle.type === 'star' ? 'text-yellow-400' : 'bg-gradient-to-r from-blue-400 to-purple-500'}`}
            style={{
              left: `${particle.x}%`,
              top: `-10%`,
              transform: `rotate(${particle.rotation}deg)`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          >
            {particle.type === 'star' ? (
              <Star className="w-4 h-4 fill-current" />
            ) : (
              <div className="w-3 h-3 rounded-sm" />
            )}
          </div>
        ))}
      </div>

      {/* Main Celebration Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-celebration-bounce border-4 border-transparent bg-gradient-to-r from-blue-50 to-purple-50">
          {/* Icon with Pulse Animation */}
          <div className="mb-6 animate-pulse-grow">
            {content.icon}
          </div>

          {/* Title with Slide Up Animation */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-slide-up">
            {content.title}
          </h2>

          {/* Subtitle */}
          <p className={`text-lg font-semibold mb-4 animate-slide-up text-${content.color}-600`} style={{ animationDelay: '0.2s' }}>
            {content.subtitle}
          </p>

          {/* Message */}
          <p className="text-gray-600 mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {content.message}
          </p>

          {/* Grade Progress Indicator (for grade improvements) */}
          {type === 'grade-improvement' && (
            <div className="flex items-center justify-center space-x-4 mb-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-red-500">{oldGrade}</span>
                <TrendingUp className="w-6 h-6 text-gray-400 animate-bounce" />
                <span className="text-3xl font-bold text-green-500 animate-pulse">{newGrade}</span>
              </div>
            </div>
          )}

          {/* Ranking Badge (for top rankings) */}
          {type === 'top-ranking' && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold text-xl mb-4 animate-spin-slow">
              #{ranking}
            </div>
          )}

          {/* Success Checkmark */}
          <div className="flex justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Achievement Badge */}
      <div className="absolute top-4 right-4 animate-slide-in-right" style={{ animationDelay: '1s' }}>
        <div className={`bg-${content.color}-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
          🎉 Achievement Unlocked!
        </div>
      </div>

      {/* Animated Styles */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes celebration-bounce {
          0% {
            transform: scale(0.3) translateY(50px);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) translateY(-10px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse-grow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-right {
          0% {
            transform: translateX(100px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-confetti-fall {
          animation: confetti-fall 3s linear infinite;
        }

        .animate-celebration-bounce {
          animation: celebration-bounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-pulse-grow {
          animation: pulse-grow 2s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CelebrationAnimations;