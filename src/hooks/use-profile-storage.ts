import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  university: string;
  major: string;
  graduationYear: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  achievements: Array<{ title: string; description: string; date: string }>;
  socialLinks: {
    linkedin: string;
    github: string;
    portfolio: string;
  };
  resumeText: string;
  resumeFileName: string;
}

const defaultProfile: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  university: 'University of Technology',
  major: 'Computer Science',
  graduationYear: '2024',
  phone: '',
  location: '',
  bio: 'Computer Science student passionate about full-stack development and machine learning.',
  skills: ['React', 'Python', 'Machine Learning', 'JavaScript'],
  achievements: [
    { title: 'Dean\'s List Fall 2023', description: 'Academic excellence recognition', date: '2023-12-15' },
    { title: 'Hackathon Winner', description: 'TechCrunch Disrupt 2023', date: '2023-10-20' }
  ],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
    portfolio: 'https://alexjohnson.dev'
  },
  resumeText: '',
  resumeFileName: ''
};

export function useProfileStorage() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from cookies on mount
  useEffect(() => {
    try {
      const savedProfile = document.cookie
        .split('; ')
        .find(row => row.startsWith('userProfile='))
        ?.split('=')[1];
      
      if (savedProfile) {
        const decoded = decodeURIComponent(savedProfile);
        const parsedProfile = JSON.parse(decoded);
        setProfile({ ...defaultProfile, ...parsedProfile });
      }
    } catch (error) {
      console.error('Error loading profile from cookies:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile to cookies
  const saveProfile = (newProfile: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...newProfile };
    setProfile(updatedProfile);
    
    try {
      const encoded = encodeURIComponent(JSON.stringify(updatedProfile));
      // Set cookie with 30 days expiration
      const expires = new Date();
      expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
      document.cookie = `userProfile=${encoded}; path=/; expires=${expires.toUTCString()}`;
      return true;
    } catch (error) {
      console.error('Error saving profile to cookies:', error);
      return false;
    }
  };

  // Update specific skill
  const updateSkills = (skills: string[]) => {
    return saveProfile({ skills });
  };

  // Add achievement
  const addAchievement = (achievement: { title: string; description: string; date: string }) => {
    const updatedAchievements = [...profile.achievements, achievement];
    return saveProfile({ achievements: updatedAchievements });
  };

  // Remove achievement
  const removeAchievement = (index: number) => {
    const updatedAchievements = profile.achievements.filter((_, i) => i !== index);
    return saveProfile({ achievements: updatedAchievements });
  };

  return { 
    profile, 
    saveProfile, 
    updateSkills, 
    addAchievement, 
    removeAchievement, 
    isLoading 
  };
}