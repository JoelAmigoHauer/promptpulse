import { useState, useCallback } from 'react';

export const useCelebration = () => {
  const [celebration, setCelebration] = useState({
    isVisible: false,
    type: null,
    data: {}
  });

  const triggerCelebration = useCallback((type, data = {}) => {
    setCelebration({
      isVisible: true,
      type,
      data
    });
  }, []);

  const hideCelebration = useCallback(() => {
    setCelebration({
      isVisible: false,
      type: null,
      data: {}
    });
  }, []);

  // Predefined celebration triggers
  const celebrateGradeImprovement = useCallback((oldGrade, newGrade, prompt) => {
    triggerCelebration('grade-improvement', {
      oldGrade,
      newGrade,
      prompt
    });
  }, [triggerCelebration]);

  const celebrateTopRanking = useCallback((prompt, ranking = 1) => {
    triggerCelebration('top-ranking', {
      prompt,
      ranking
    });
  }, [triggerCelebration]);

  const celebrateFirstWin = useCallback(() => {
    triggerCelebration('first-win');
  }, [triggerCelebration]);

  const celebrateContentPublished = useCallback((briefTitle) => {
    triggerCelebration('content-published', {
      briefTitle
    });
  }, [triggerCelebration]);

  const celebrateMilestone = useCallback((milestone, data) => {
    const milestoneTypes = {
      'first-brief': () => triggerCelebration('content-published', data),
      'ranking-improvement': () => triggerCelebration('grade-improvement', data),
      'top-position': () => triggerCelebration('top-ranking', data),
      'analytics-unlocked': () => triggerCelebration('first-win', data)
    };

    const celebrationFunction = milestoneTypes[milestone];
    if (celebrationFunction) {
      celebrationFunction();
    }
  }, [triggerCelebration]);

  return {
    celebration,
    triggerCelebration,
    hideCelebration,
    celebrateGradeImprovement,
    celebrateTopRanking,
    celebrateFirstWin,
    celebrateContentPublished,
    celebrateMilestone
  };
};