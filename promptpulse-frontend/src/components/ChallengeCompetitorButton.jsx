import React, { useState } from 'react';
import { 
  Sword, 
  Target, 
  Crown, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Users,
  Brain,
  CheckCircle
} from 'lucide-react';

const ChallengeCompetitorButton = ({ 
  competitor, 
  prompt, 
  ranking, 
  context = 'ranking',
  size = 'medium',
  variant = 'primary',
  onChallenge
}) => {
  const [loading, setLoading] = useState(false);
  const [challenged, setChallenged] = useState(false);

  const handleChallenge = async () => {
    if (challenged) return;
    
    setLoading(true);
    
    // Simulate challenge action
    setTimeout(() => {
      setLoading(false);
      setChallenged(true);
      
      const challengeData = {
        competitor,
        prompt,
        ranking,
        context,
        strategy: generateChallengeStrategy(),
        timestamp: new Date()
      };
      
      onChallenge?.(challengeData);
      
      // Auto-reset after a few seconds for demo purposes
      setTimeout(() => {
        setChallenged(false);
      }, 3000);
    }, 1000);
  };

  const generateChallengeStrategy = () => {
    const strategies = {
      ranking: `Create superior content for "${prompt}" targeting ${competitor}'s #${ranking} position`,
      mention: `Develop competitive content to outrank ${competitor} in AI mentions`,
      authority: `Build stronger authority signals than ${competitor} in this topic area`,
      gap: `Exploit content gap where ${competitor} is currently winning`
    };
    
    return strategies[context] || strategies.ranking;
  };

  const getButtonConfig = () => {
    const configs = {
      primary: {
        base: 'bg-red-600 hover:bg-red-700 text-white',
        loading: 'bg-red-400 text-white',
        success: 'bg-green-600 text-white'
      },
      secondary: {
        base: 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50',
        loading: 'bg-gray-100 border-gray-300 text-gray-500',
        success: 'bg-green-50 border-green-600 text-green-600'
      },
      minimal: {
        base: 'text-red-600 hover:text-red-700 hover:bg-red-50',
        loading: 'text-gray-500',
        success: 'text-green-600'
      }
    };

    return configs[variant] || configs.primary;
  };

  const getSizeConfig = () => {
    const sizes = {
      small: {
        button: 'px-3 py-1.5 text-sm',
        icon: 'w-3 h-3',
        spacing: 'space-x-1'
      },
      medium: {
        button: 'px-4 py-2 text-sm',
        icon: 'w-4 h-4',
        spacing: 'space-x-2'
      },
      large: {
        button: 'px-6 py-3 text-base',
        icon: 'w-5 h-5',
        spacing: 'space-x-2'
      }
    };

    return sizes[size] || sizes.medium;
  };

  const getContextMessage = () => {
    const messages = {
      ranking: `Challenge ${competitor}'s #${ranking} ranking`,
      mention: `Outrank ${competitor} in mentions`,
      authority: `Beat ${competitor}'s authority`,
      gap: `Exploit ${competitor}'s weakness`
    };
    
    return messages[context] || messages.ranking;
  };

  const buttonConfig = getButtonConfig();
  const sizeConfig = getSizeConfig();

  let buttonClass = `inline-flex items-center ${sizeConfig.spacing} ${sizeConfig.button} font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed`;
  let IconComponent = Sword;
  let buttonText = getContextMessage();

  if (challenged) {
    buttonClass += ` ${buttonConfig.success}`;
    IconComponent = CheckCircle;
    buttonText = 'Challenge Created!';
  } else if (loading) {
    buttonClass += ` ${buttonConfig.loading}`;
    IconComponent = Brain;
    buttonText = 'Creating Challenge...';
  } else {
    buttonClass += ` ${buttonConfig.base}`;
  }

  // Add hover effects for non-minimal variants
  if (variant !== 'minimal' && !loading && !challenged) {
    buttonClass += ' shadow-sm hover:shadow-md transform hover:-translate-y-0.5';
  }

  return (
    <button
      onClick={handleChallenge}
      disabled={loading || challenged}
      className={buttonClass}
      title={`Challenge ${competitor} for "${prompt}"`}
    >
      <IconComponent className={`${sizeConfig.icon} ${loading ? 'animate-pulse' : ''}`} />
      <span>{buttonText}</span>
      {!loading && !challenged && variant === 'primary' && (
        <ArrowRight className={`${sizeConfig.icon} transition-transform group-hover:translate-x-1`} />
      )}
    </button>
  );
};

// Specialized component variants for common use cases
export const RankingChallengeButton = ({ competitor, prompt, ranking, onChallenge }) => (
  <ChallengeCompetitorButton
    competitor={competitor}
    prompt={prompt}
    ranking={ranking}
    context="ranking"
    variant="primary"
    size="medium"
    onChallenge={onChallenge}
  />
);

export const MentionChallengeButton = ({ competitor, prompt, onChallenge }) => (
  <ChallengeCompetitorButton
    competitor={competitor}
    prompt={prompt}
    context="mention"
    variant="secondary"
    size="small"
    onChallenge={onChallenge}
  />
);

export const AuthorityChallengeButton = ({ competitor, prompt, onChallenge }) => (
  <ChallengeCompetitorButton
    competitor={competitor}
    prompt={prompt}
    context="authority"
    variant="minimal"
    size="small"
    onChallenge={onChallenge}
  />
);

export const QuickChallengeButton = ({ competitor, prompt, onChallenge }) => (
  <ChallengeCompetitorButton
    competitor={competitor}
    prompt={prompt}
    context="gap"
    variant="primary"
    size="large"
    onChallenge={onChallenge}
  />
);

export default ChallengeCompetitorButton;