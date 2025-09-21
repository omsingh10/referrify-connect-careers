import { useState, useCallback } from 'react';
import { getUserData, setUserData, removeUserData } from '@/lib/storage';

const PROFILE_PICTURE_KEY = 'profilePicture';

export const useProfilePicture = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(() => {
    const savedPicture = getUserData(PROFILE_PICTURE_KEY);
    return savedPicture || null;
  });

  const uploadProfilePicture = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please upload a valid image file'));
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        reject(new Error('Image size must be less than 5MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setProfilePicture(base64String);
        
        // Store using enhanced storage (cookies + localStorage)
        setUserData(PROFILE_PICTURE_KEY, base64String, 30);
        resolve(base64String);
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const removeProfilePicture = useCallback(() => {
    setProfilePicture(null);
    removeUserData(PROFILE_PICTURE_KEY);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return {
    profilePicture,
    uploadProfilePicture,
    removeProfilePicture,
    getInitials,
  };
};